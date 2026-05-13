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
  MODAL_PAGE_1_ID,
  MODAL_PAGE_2_ID,
  MODAL_PAGE_3_ID,
  buildPage1Modal,
  buildPage2Modal,
  buildPage3Modal,
} from "./modals";
import {
  buildStep1DonePanel,
  buildStep2DonePanel,
  buildStep3DonePanel,
  buildSuccessPanel,
  buildErrorPanel,
  buildCancelledPanel,
} from "./embeds";
import { getSession, setSession, clearSession } from "./session";
import { sendApplicationEmail } from "./mailer";

export async function handleButton(
  interaction: ButtonInteraction,
): Promise<void> {
  const { customId, user } = interaction;

  // ── Open form (show modal) ──────────────────────────────────────────────────
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
    // Start the defer IMMEDIATELY — in parallel with session lookup so we
    // use as much of the 3-second window as possible.
    const deferPromise = interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    // Sync work while the HTTP round-trip is in flight
    const session = getSession(user.id);

    await deferPromise;

    if (!session?.page1 || !session?.page2 || !session?.page3) {
      const { components } = buildErrorPanel(
        "Sessão expirada ou dados incompletos. Por favor, inicie o formulário novamente usando o botão no canal.",
      );
      await interaction.editReply({ components });
      return;
    }

    try {
      await sendApplicationEmail({
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
      });

      clearSession(user.id);

      const { components } = buildSuccessPanel();
      await interaction.editReply({ components });
    } catch (err) {
      logger.error({ err, userId: user.id }, "Failed to send staff application email");
      const { components } = buildErrorPanel(
        "Ocorreu um erro ao enviar sua candidatura. Por favor, tente novamente mais tarde.",
      );
      await interaction.editReply({ components });
    }
    return;
  }

  // ── Cancel ─────────────────────────────────────────────────────────────────
  if (customId === BTN_CANCEL) {
    // Start the update immediately
    clearSession(user.id);
    const { components, flags } = buildCancelledPanel();
    await interaction.update({ components, flags });
    return;
  }
}

export async function handleModalSubmit(
  interaction: ModalSubmitInteraction,
): Promise<void> {
  const { customId, user } = interaction;

  // ── Page 1 submitted ───────────────────────────────────────────────────────
  if (customId === MODAL_PAGE_1_ID) {
    // Parse fields (sync) then reply immediately
    const real_name = interaction.fields.getTextInputValue("real_name");
    const age = interaction.fields.getTextInputValue("age");
    const timezone = interaction.fields.getTextInputValue("timezone");
    const availability = interaction.fields.getTextInputValue("availability");
    setSession(user.id, { page1: { real_name, age, timezone, availability } });

    const { components, flags } = buildStep1DonePanel();
    await interaction.reply({ components, flags });
    return;
  }

  // ── Page 2 submitted ───────────────────────────────────────────────────────
  if (customId === MODAL_PAGE_2_ID) {
    const experience = interaction.fields.getTextInputValue("experience");
    const why_join = interaction.fields.getTextInputValue("why_join");
    const skills = interaction.fields.getTextInputValue("skills");
    setSession(user.id, { page2: { experience, why_join, skills } });

    const { components, flags } = buildStep2DonePanel();
    await interaction.reply({ components, flags });
    return;
  }

  // ── Page 3 submitted ───────────────────────────────────────────────────────
  if (customId === MODAL_PAGE_3_ID) {
    const discord_user = interaction.fields.getTextInputValue("discord_user");
    const server_origin = interaction.fields.getTextInputValue("server_origin");
    const scenario = interaction.fields.getTextInputValue("scenario");
    const additional_info =
      interaction.fields.getTextInputValue("additional_info") ?? "";
    setSession(user.id, { page3: { discord_user, server_origin, scenario, additional_info } });

    const { components, flags } = buildStep3DonePanel();
    await interaction.reply({ components, flags });
    return;
  }
}
