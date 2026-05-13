import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export const MODAL_PAGE_1_ID = "staff_form_page1";
export const MODAL_PAGE_2_ID = "staff_form_page2";
export const MODAL_PAGE_3_ID = "staff_form_page3";

export const BTN_OPEN_FORM = "btn_open_staff_form";
export const BTN_PAGE2    = "btn_staff_page2";
export const BTN_PAGE3    = "btn_staff_page3";
export const BTN_SUBMIT   = "btn_staff_submit";
export const BTN_CANCEL   = "btn_staff_cancel";

export const BTN_APPROVE_PREFIX   = "btn_approve_";
export const BTN_REJECT_PREFIX    = "btn_reject_";
export const MODAL_APPROVE_PREFIX = "modal_approve_";
export const MODAL_REJECT_PREFIX  = "modal_reject_";

export function buildPage1Modal(): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(MODAL_PAGE_1_ID)
    .setTitle("Candidatura à Staff — Parte 1/3");

  const realName = new TextInputBuilder()
    .setCustomId("real_name")
    .setLabel("Seu nome real (primeiro nome)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Ex: João")
    .setRequired(true)
    .setMaxLength(50);

  const age = new TextInputBuilder()
    .setCustomId("age")
    .setLabel("Qual é a sua idade?")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Ex: 20")
    .setRequired(true)
    .setMaxLength(3);

  const timezone = new TextInputBuilder()
    .setCustomId("timezone")
    .setLabel("Qual é o seu fuso horário / país?")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Ex: Brasília (BRT / UTC-3)")
    .setRequired(true)
    .setMaxLength(80);

  const availability = new TextInputBuilder()
    .setCustomId("availability")
    .setLabel("Horas disponíveis por semana?")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Ex: 10 horas por semana, principalmente à noite")
    .setRequired(true)
    .setMaxLength(120);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(realName),
    new ActionRowBuilder<TextInputBuilder>().addComponents(age),
    new ActionRowBuilder<TextInputBuilder>().addComponents(timezone),
    new ActionRowBuilder<TextInputBuilder>().addComponents(availability),
  );

  return modal;
}

export function buildPage2Modal(): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(MODAL_PAGE_2_ID)
    .setTitle("Candidatura à Staff — Parte 2/3");

  const experience = new TextInputBuilder()
    .setCustomId("experience")
    .setLabel("Você tem experiência como staff? Descreva.")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: Fui moderador no servidor X por 6 meses, gerenciando tickets e resolvendo conflitos...",
    )
    .setRequired(true)
    .setMinLength(30)
    .setMaxLength(1000);

  const whyJoin = new TextInputBuilder()
    .setCustomId("why_join")
    .setLabel("Por que você quer ser staff neste servidor?")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: Quero contribuir com a comunidade, ajudar os membros e manter um ambiente saudável...",
    )
    .setRequired(true)
    .setMinLength(50)
    .setMaxLength(1000);

  const skills = new TextInputBuilder()
    .setCustomId("skills")
    .setLabel("Habilidades e qualidades para a função")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: Comunicativo, paciente, experiente com moderação, conheço as regras do servidor...",
    )
    .setRequired(true)
    .setMinLength(30)
    .setMaxLength(800);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(experience),
    new ActionRowBuilder<TextInputBuilder>().addComponents(whyJoin),
    new ActionRowBuilder<TextInputBuilder>().addComponents(skills),
  );

  return modal;
}

export function buildPage3Modal(): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(MODAL_PAGE_3_ID)
    .setTitle("Candidatura à Staff — Parte 3/3");

  const discordUser = new TextInputBuilder()
    .setCustomId("discord_user")
    .setLabel("Seu usuário do Discord (@nome)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Ex: @joao ou joao#1234")
    .setRequired(true)
    .setMaxLength(60);

  const serverOrigin = new TextInputBuilder()
    .setCustomId("server_origin")
    .setLabel("De qual servidor você veio?")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Ex: Servidor de Jogos BR, comunidade do Twitch...")
    .setRequired(true)
    .setMaxLength(120);

  const scenario = new TextInputBuilder()
    .setCustomId("scenario")
    .setLabel("Como você lidaria com um membro infratório?")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: Primeiro aviso privado, depois warn público e, se persistir, aplicaria a penalidade adequada...",
    )
    .setRequired(true)
    .setMinLength(30)
    .setMaxLength(600);

  const additionalInfo = new TextInputBuilder()
    .setCustomId("additional_info")
    .setLabel("Informações adicionais (opcional)")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Opcional — qualquer coisa relevante que queira acrescentar.")
    .setRequired(false)
    .setMaxLength(400);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(discordUser),
    new ActionRowBuilder<TextInputBuilder>().addComponents(serverOrigin),
    new ActionRowBuilder<TextInputBuilder>().addComponents(scenario),
    new ActionRowBuilder<TextInputBuilder>().addComponents(additionalInfo),
  );

  return modal;
}

export function buildApproveModal(applicantId: string): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(MODAL_APPROVE_PREFIX + applicantId)
    .setTitle("Aprovar Candidatura");

  const welcomeMsg = new TextInputBuilder()
    .setCustomId("welcome_msg")
    .setLabel("Mensagem de boas-vindas ao novo staff")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: Olá! Estamos muito felizes em ter você na equipe. Você vai fazer um ótimo trabalho!",
    )
    .setRequired(true)
    .setMinLength(20)
    .setMaxLength(800);

  const roleInfo = new TextInputBuilder()
    .setCustomId("role_info")
    .setLabel("Cargo / função que receberá")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Ex: Moderador Júnior")
    .setRequired(true)
    .setMaxLength(80);

  const nextSteps = new TextInputBuilder()
    .setCustomId("next_steps")
    .setLabel("Próximos passos / canais de acesso")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: Acesse o canal #staff-lounge, leia o manual de moderação e fale com um Admin...",
    )
    .setRequired(true)
    .setMaxLength(600);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(welcomeMsg),
    new ActionRowBuilder<TextInputBuilder>().addComponents(roleInfo),
    new ActionRowBuilder<TextInputBuilder>().addComponents(nextSteps),
  );

  return modal;
}

export function buildRejectModal(applicantId: string): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(MODAL_REJECT_PREFIX + applicantId)
    .setTitle("Recusar Candidatura");

  const reason = new TextInputBuilder()
    .setCustomId("reject_reason")
    .setLabel("Motivo da recusa")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: No momento não temos vagas disponíveis para o seu perfil de experiência...",
    )
    .setRequired(true)
    .setMinLength(20)
    .setMaxLength(800);

  const feedback = new TextInputBuilder()
    .setCustomId("feedback")
    .setLabel("Feedback construtivo (opcional)")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: Continue desenvolvendo suas habilidades de moderação e tente novamente no futuro!",
    )
    .setRequired(false)
    .setMaxLength(500);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(reason),
    new ActionRowBuilder<TextInputBuilder>().addComponents(feedback),
  );

  return modal;
}
