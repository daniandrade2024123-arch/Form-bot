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

  if (customId === BTN_OPEN_FORM) {
    await interaction.showModal(buildPage1Modal());
    return;
  }

  if (customId === BTN_PAGE2) {
    const session = getSession(user.id);
    if (!session?.page1) {
      const { components, flags } = buildErrorPanel(
        "Sessão expirada ou inválida. Por favor, inicie o formulário novamente.",
      );
      await interaction.reply({ components, flags });
      return;
    }
    await interaction.showModal(buildPage2Modal());
    return;
  }

  if (customId === BTN_PAGE3) {
    const session = getSession(user.id);
    if (!session?.page2) {
      const { components, flags } = buildErrorPanel(
        "Sessão expirada ou inválida. Por favor, inicie o formulário novamente.",
      );
      await interaction.reply({ components, flags });
      return;
    }
    await interaction.showModal(buildPage3Modal());
    return;
  }

  if (customId === BTN_SUBMIT) {
    const session = getSession(user.id);
    if (!session?.page1 || !session?.page2 || !session?.page3) {
      const { components, flags } = buildErrorPanel(
        "Sessão expirada ou dados incompletos. Por favor, inicie o formulário novamente.",
      );
      await interaction.reply({ components, flags });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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

  if (customId === BTN_CANCEL) {
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

  if (customId === MODAL_PAGE_1_ID) {
    const real_name = interaction.fields.getTextInputValue("real_name");
    const age = interaction.fields.getTextInputValue("age");
    const timezone = interaction.fields.getTextInputValue("timezone");
    const availability = interaction.fields.getTextInputValue("availability");

    setSession(user.id, { page1: { real_name, age, timezone, availability } });

    const { components, flags } = buildStep1DonePanel();
    await interaction.reply({ components, flags });
    return;
  }

  if (customId === MODAL_PAGE_2_ID) {
    const experience = interaction.fields.getTextInputValue("experience");
    const why_join = interaction.fields.getTextInputValue("why_join");
    const skills = interaction.fields.getTextInputValue("skills");

    setSession(user.id, { page2: { experience, why_join, skills } });

    const { components, flags } = buildStep2DonePanel();
    await interaction.reply({ components, flags });
    return;
  }

  if (customId === MODAL_PAGE_3_ID) {
    const scenario = interaction.fields.getTextInputValue("scenario");
    const additional_info =
      interaction.fields.getTextInputValue("additional_info") ?? "";

    setSession(user.id, { page3: { scenario, additional_info } });

    const { components, flags } = buildStep3DonePanel();
    await interaction.reply({ components, flags });
    return;
  }
}
