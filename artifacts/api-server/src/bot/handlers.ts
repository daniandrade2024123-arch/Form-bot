import {
  type ButtonInteraction,
  type ModalSubmitInteraction,
  MessageFlags,
} from "discord.js";
import { logger } from "../lib/logger";
import {
  BTN_OPEN_FORM,
  BTN_PAGE2,
  BTN_PAGE3,
  BTN_SUBMIT,
  BTN_CANCEL,
  BTN_APPROVE_PREFIX,
  BTN_REJECT_PREFIX,
  MODAL_PAGE_1_ID,
  MODAL_PAGE_2_ID,
  MODAL_PAGE_3_ID,
  MODAL_APPROVE_PREFIX,
  MODAL_REJECT_PREFIX,
  buildPage1Modal,
  buildPage2Modal,
  buildPage3Modal,
  buildApproveModal,
  buildRejectModal,
} from "./modals";
import {
  buildStep1DonePanel,
  buildStep2DonePanel,
  buildStep3DonePanel,
  buildSuccessPanel,
  buildErrorPanel,
  buildCancelledPanel,
  buildApplicationCard,
  buildApplicationCardEvaluated,
  buildOnboardingDM,
  buildRejectionDM,
} from "./embeds";
import { getSession, setSession, clearSession } from "./session";
import {
  storePendingApplication,
  getPendingApplication,
  removePendingApplication,
  type PendingApplication,
} from "./applications";
import { getDiscordClient } from "./client-singleton";

// ─────────────────────────────────────────────────────────────────────────────
// Button interactions
// ─────────────────────────────────────────────────────────────────────────────
export async function handleButton(
  interaction: ButtonInteraction,
): Promise<void> {
  const { customId, user } = interaction;

  // ── Open form ──────────────────────────────────────────────────────────────
  if (customId === BTN_OPEN_FORM) {
    await interaction.showModal(buildPage1Modal());
    return;
  }

  // ── Navigate to page 2 ─────────────────────────────────────────────────────
  if (customId === BTN_PAGE2) {
    if (!getSession(user.id)?.page1) {
      await interaction.showModal(buildPage1Modal());
      return;
    }
    await interaction.showModal(buildPage2Modal());
    return;
  }

  // ── Navigate to page 3 ─────────────────────────────────────────────────────
  if (customId === BTN_PAGE3) {
    if (!getSession(user.id)?.page2) {
      await interaction.showModal(buildPage2Modal());
      return;
    }
    await interaction.showModal(buildPage3Modal());
    return;
  }

  // ── Submit application ─────────────────────────────────────────────────────
  if (customId === BTN_SUBMIT) {
    const deferPromise = interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });
    const session = getSession(user.id);
    await deferPromise;

    if (!session?.page1 || !session?.page2 || !session?.page3) {
      const { components } = buildErrorPanel(
        "Sessão expirada ou dados incompletos. Por favor, inicie o formulário novamente.",
      );
      await interaction.editReply({ components });
      return;
    }

    const application: PendingApplication = {
      discordUsername: user.tag ?? user.username,
      discordId: user.id,
      realName: session.page1.real_name,
      age: session.page1.age,
      timezone: session.page1.timezone,
      availability: session.page1.availability,
      experience: session.page2.experience,
      whyJoin: session.page2.why_join,
      skills: session.page2.skills,
      discordUser: session.page3.discord_user,
      serverOrigin: session.page3.server_origin,
      scenario: session.page3.scenario,
      additionalInfo: session.page3.additional_info,
    };

    try {
      await sendToApplicationChannel(application);
      storePendingApplication(user.id, application);
      clearSession(user.id);

      const { components } = buildSuccessPanel();
      await interaction.editReply({ components });
    } catch (err) {
      logger.error({ err, userId: user.id }, "Failed to post application to channel");
      const { components } = buildErrorPanel(
        "Ocorreu um erro ao enviar sua candidatura. Por favor, tente novamente mais tarde.",
      );
      await interaction.editReply({ components });
    }
    return;
  }

  // ── Cancel ─────────────────────────────────────────────────────────────────
  if (customId === BTN_CANCEL) {
    clearSession(user.id);
    const { components, flags } = buildCancelledPanel();
    await interaction.update({ components, flags });
    return;
  }

  // ── Admin: Approve ─────────────────────────────────────────────────────────
  if (customId.startsWith(BTN_APPROVE_PREFIX)) {
    const applicantId = customId.slice(BTN_APPROVE_PREFIX.length);
    const app = getPendingApplication(applicantId);

    if (!app) {
      await interaction.reply({
        content: "⚠️ Candidatura não encontrada (já avaliada ou bot reiniciado).",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.showModal(buildApproveModal(applicantId));
    return;
  }

  // ── Admin: Reject ──────────────────────────────────────────────────────────
  if (customId.startsWith(BTN_REJECT_PREFIX)) {
    const applicantId = customId.slice(BTN_REJECT_PREFIX.length);
    const app = getPendingApplication(applicantId);

    if (!app) {
      await interaction.reply({
        content: "⚠️ Candidatura não encontrada (já avaliada ou bot reiniciado).",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.showModal(buildRejectModal(applicantId));
    return;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal submit interactions
// ─────────────────────────────────────────────────────────────────────────────
export async function handleModalSubmit(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const { customId, user } = interaction;

  // ── Page 1 submitted ───────────────────────────────────────────────────────
  if (customId === MODAL_PAGE_1_ID) {
    const real_name   = interaction.fields.getTextInputValue("real_name");
    const age         = interaction.fields.getTextInputValue("age");
    const timezone    = interaction.fields.getTextInputValue("timezone");
    const availability = interaction.fields.getTextInputValue("availability");
    setSession(user.id, { page1: { real_name, age, timezone, availability } });

    const { components, flags } = buildStep1DonePanel();
    await interaction.reply({ components, flags });
    return;
  }

  // ── Page 2 submitted ───────────────────────────────────────────────────────
  if (customId === MODAL_PAGE_2_ID) {
    const experience = interaction.fields.getTextInputValue("experience");
    const why_join   = interaction.fields.getTextInputValue("why_join");
    const skills     = interaction.fields.getTextInputValue("skills");
    setSession(user.id, { page2: { experience, why_join, skills } });

    const { components, flags } = buildStep2DonePanel();
    await interaction.reply({ components, flags });
    return;
  }

  // ── Page 3 submitted ───────────────────────────────────────────────────────
  if (customId === MODAL_PAGE_3_ID) {
    const discord_user   = interaction.fields.getTextInputValue("discord_user");
    const server_origin  = interaction.fields.getTextInputValue("server_origin");
    const scenario       = interaction.fields.getTextInputValue("scenario");
    const additional_info = interaction.fields.getTextInputValue("additional_info") ?? "";
    setSession(user.id, { page3: { discord_user, server_origin, scenario, additional_info } });

    const { components, flags } = buildStep3DonePanel();
    await interaction.reply({ components, flags });
    return;
  }

  // ── Admin: Approve modal submitted ─────────────────────────────────────────
  if (customId.startsWith(MODAL_APPROVE_PREFIX)) {
    const applicantId  = customId.slice(MODAL_APPROVE_PREFIX.length);
    const app          = getPendingApplication(applicantId);

    if (!app) {
      await interaction.reply({
        content: "⚠️ Candidatura não encontrada (já avaliada ou bot reiniciado).",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const welcomeMsg = interaction.fields.getTextInputValue("welcome_msg");
    const roleInfo   = interaction.fields.getTextInputValue("role_info");
    const nextSteps  = interaction.fields.getTextInputValue("next_steps");
    const adminUsername = user.tag ?? user.username;

    const deferPromise = interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // Edit original channel message + send DM in parallel
    const editPromise = (async () => {
      const { components, flags } = buildApplicationCardEvaluated(app, "approved", adminUsername);
      await interaction.message?.edit({ components, flags });
    })();

    const dmPromise = (async () => {
      try {
        const client = getDiscordClient();
        const applicantUser = await client.users.fetch(applicantId);
        const { components, flags } = buildOnboardingDM({ welcomeMsg, roleInfo, nextSteps, adminUsername });
        await applicantUser.send({ components, flags });
      } catch (err) {
        logger.warn({ err, applicantId }, "Could not send approval DM (DMs may be disabled)");
      }
    })();

    await deferPromise;
    await Promise.all([editPromise, dmPromise]);

    removePendingApplication(applicantId);
    logger.info({ applicantId, adminUsername }, "Application approved");

    await interaction.editReply({
      content: `✅ Candidatura de **${app.discordUsername}** aprovada! A DM foi enviada ao candidato.`,
    });
    return;
  }

  // ── Admin: Reject modal submitted ──────────────────────────────────────────
  if (customId.startsWith(MODAL_REJECT_PREFIX)) {
    const applicantId = customId.slice(MODAL_REJECT_PREFIX.length);
    const app         = getPendingApplication(applicantId);

    if (!app) {
      await interaction.reply({
        content: "⚠️ Candidatura não encontrada (já avaliada ou bot reiniciado).",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const reason      = interaction.fields.getTextInputValue("reject_reason");
    const feedback    = interaction.fields.getTextInputValue("feedback") ?? "";
    const adminUsername = user.tag ?? user.username;

    const deferPromise = interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const editPromise = (async () => {
      const { components, flags } = buildApplicationCardEvaluated(app, "rejected", adminUsername);
      await interaction.message?.edit({ components, flags });
    })();

    const dmPromise = (async () => {
      try {
        const client = getDiscordClient();
        const applicantUser = await client.users.fetch(applicantId);
        const { components, flags } = buildRejectionDM({ reason, feedback, adminUsername });
        await applicantUser.send({ components, flags });
      } catch (err) {
        logger.warn({ err, applicantId }, "Could not send rejection DM (DMs may be disabled)");
      }
    })();

    await deferPromise;
    await Promise.all([editPromise, dmPromise]);

    removePendingApplication(applicantId);
    logger.info({ applicantId, adminUsername }, "Application rejected");

    await interaction.editReply({
      content: `❌ Candidatura de **${app.discordUsername}** recusada. A DM foi enviada ao candidato.`,
    });
    return;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
async function sendToApplicationChannel(app: PendingApplication): Promise<void> {
  const channelId = process.env["APPLICATION_CHANNEL_ID"];
  if (!channelId) {
    logger.warn("APPLICATION_CHANNEL_ID not set — application not posted to channel");
    return;
  }

  const client  = getDiscordClient();
  const channel = await client.channels.fetch(channelId);

  if (!channel || !channel.isTextBased()) {
    logger.error({ channelId }, "Application channel not found or is not text-based");
    return;
  }

  const { components, flags } = buildApplicationCard(app);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (channel as any).send({ components, flags });
}
