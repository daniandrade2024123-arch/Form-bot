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
export const BTN_PAGE2 = "btn_staff_page2";
export const BTN_PAGE3 = "btn_staff_page3";
export const BTN_SUBMIT = "btn_staff_submit";
export const BTN_CANCEL = "btn_staff_cancel";

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

  const scenario = new TextInputBuilder()
    .setCustomId("scenario")
    .setLabel("Como você lidaria com um membro infratório?")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      "Ex: Primeiro aviso privado, depois warn público e, se persistir, aplicaria a penalidade adequada...",
    )
    .setRequired(true)
    .setMinLength(30)
    .setMaxLength(800);

  const additionalInfo = new TextInputBuilder()
    .setCustomId("additional_info")
    .setLabel("Informações adicionais (opcional)")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Opcional — qualquer coisa relevante que queira acrescentar.")
    .setRequired(false)
    .setMaxLength(600);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(scenario),
    new ActionRowBuilder<TextInputBuilder>().addComponents(additionalInfo),
  );

  return modal;
}
