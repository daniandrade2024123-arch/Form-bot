import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ColorResolvable,
} from "discord.js";
import {
  BTN_OPEN_FORM,
  BTN_PAGE2,
  BTN_PAGE3,
  BTN_SUBMIT,
  BTN_CANCEL,
} from "./modals";

const DISCORD_BLURPLE = 0x5865f2 as ColorResolvable;
const SUCCESS_GREEN = 0x57f287 as ColorResolvable;
const WARNING_YELLOW = 0xfee75c as ColorResolvable;
const DANGER_RED = 0xed4245 as ColorResolvable;

export function buildWelcomeEmbed(): {
  embed: EmbedBuilder;
  row: ActionRowBuilder<ButtonBuilder>;
} {
  const embed = new EmbedBuilder()
    .setColor(DISCORD_BLURPLE)
    .setTitle("📋 Candidatura à Staff")
    .setDescription(
      "Quer fazer parte da nossa equipe de staff? Preencha o formulário abaixo!\n\n" +
        "O processo é dividido em **3 etapas** com perguntas sobre seu perfil, experiência e postura como moderador.\n\n" +
        "✅ Responda com sinceridade — isso aumenta suas chances!\n" +
        "⏱️ Você tem **15 minutos** para concluir após iniciar.\n" +
        "📧 Suas respostas serão enviadas para a equipe de administração.",
    )
    .setFooter({ text: "Formulário de Candidatura • Staff Application Bot" })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(BTN_OPEN_FORM)
      .setLabel("Iniciar Candidatura")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("📝"),
  );

  return { embed, row };
}

export function buildStep1DoneEmbed(): {
  embed: EmbedBuilder;
  row: ActionRowBuilder<ButtonBuilder>;
} {
  const embed = new EmbedBuilder()
    .setColor(WARNING_YELLOW)
    .setTitle("✅ Etapa 1 concluída!")
    .setDescription(
      "Ótimo! Suas informações pessoais foram salvas.\n\n" +
        "Clique em **Continuar** para preencher a **Etapa 2/3** — sobre sua experiência e motivações.",
    )
    .setFooter({ text: "Etapa 1 de 3 concluída" });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(BTN_PAGE2)
      .setLabel("Continuar → Etapa 2")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("➡️"),
    new ButtonBuilder()
      .setCustomId(BTN_CANCEL)
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("🗑️"),
  );

  return { embed, row };
}

export function buildStep2DoneEmbed(): {
  embed: EmbedBuilder;
  row: ActionRowBuilder<ButtonBuilder>;
} {
  const embed = new EmbedBuilder()
    .setColor(WARNING_YELLOW)
    .setTitle("✅ Etapa 2 concluída!")
    .setDescription(
      "Excelente! Suas respostas foram salvas.\n\n" +
        "Clique em **Continuar** para a **Etapa 3/3** — última parte da candidatura.",
    )
    .setFooter({ text: "Etapa 2 de 3 concluída" });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(BTN_PAGE3)
      .setLabel("Continuar → Etapa 3")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("➡️"),
    new ButtonBuilder()
      .setCustomId(BTN_CANCEL)
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("🗑️"),
  );

  return { embed, row };
}

export function buildStep3DoneEmbed(): {
  embed: EmbedBuilder;
  row: ActionRowBuilder<ButtonBuilder>;
} {
  const embed = new EmbedBuilder()
    .setColor(SUCCESS_GREEN)
    .setTitle("🎉 Formulário Completo!")
    .setDescription(
      "Você preencheu todas as etapas!\n\n" +
        "Revise suas respostas e clique em **Enviar Candidatura** para submeter à equipe de administração.\n\n" +
        "⚠️ Após o envio, não será possível editar.",
    )
    .setFooter({ text: "Pronto para enviar!" });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(BTN_SUBMIT)
      .setLabel("Enviar Candidatura")
      .setStyle(ButtonStyle.Success)
      .setEmoji("📨"),
    new ButtonBuilder()
      .setCustomId(BTN_CANCEL)
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("🗑️"),
  );

  return { embed, row };
}

export function buildSuccessEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(SUCCESS_GREEN)
    .setTitle("📨 Candidatura Enviada com Sucesso!")
    .setDescription(
      "Sua candidatura foi enviada para a equipe de administração! 🎉\n\n" +
        "Aguarde o contato da staff — normalmente respondemos em até **72 horas**.\n\n" +
        "Obrigado por querer fazer parte da nossa equipe! 💙",
    )
    .setFooter({ text: "Staff Application Bot" })
    .setTimestamp();
}

export function buildErrorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(DANGER_RED)
    .setTitle("❌ Erro")
    .setDescription(message)
    .setFooter({ text: "Staff Application Bot" });
}

export function buildCancelledEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(DANGER_RED)
    .setTitle("🗑️ Candidatura Cancelada")
    .setDescription(
      "Sua candidatura foi cancelada e os dados foram apagados.\n\nSe quiser tentar novamente, clique no botão **Iniciar Candidatura** no canal.",
    )
    .setFooter({ text: "Staff Application Bot" });
}
