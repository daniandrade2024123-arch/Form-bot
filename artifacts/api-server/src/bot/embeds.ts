import {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";
import {
  BTN_OPEN_FORM,
  BTN_PAGE2,
  BTN_PAGE3,
  BTN_SUBMIT,
  BTN_CANCEL,
  BTN_APPROVE_PREFIX,
  BTN_REJECT_PREFIX,
} from "./modals";
import type { PendingApplication } from "./applications";

const COLOR_BLURPLE = 0x5865f2;
const COLOR_GREEN   = 0x57f287;
const COLOR_YELLOW  = 0xfee75c;
const COLOR_RED     = 0xed4245;
const COLOR_GREY    = 0x4f545c;

const FLAGS_PUBLIC    = MessageFlags.IsComponentsV2;
const FLAGS_EPHEMERAL = MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral;

const THUMB = {
  staff:  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6e1.png",
  check:  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png",
  book:   "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4d6.png",
  party:  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png",
  send:   "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4e8.png",
  cancel: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f5d1.png",
  error:  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/274c.png",
  memo:   "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4cb.png",
  lock:   "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f512.png",
};

function sep(large = false): SeparatorBuilder {
  return new SeparatorBuilder()
    .setDivider(true)
    .setSpacing(large ? SeparatorSpacingSize.Large : SeparatorSpacingSize.Small);
}

function thumb(url: string): ThumbnailBuilder {
  return new ThumbnailBuilder().setURL(url);
}

function text(content: string): TextDisplayBuilder {
  return new TextDisplayBuilder().setContent(content);
}

function trunc(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public welcome panel (slash command reply)
// ─────────────────────────────────────────────────────────────────────────────
export function buildWelcomePanel(): {
  components: ContainerBuilder[];
  flags: number;
} {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(BTN_OPEN_FORM)
      .setLabel("Iniciar Candidatura")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("📝"),
  );

  const container = new ContainerBuilder()
    .setAccentColor(COLOR_BLURPLE)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## 📋 Candidatura à Staff\n-# Formulário oficial de seleção de moderadores"),
        )
        .setThumbnailAccessory(thumb(THUMB.staff)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Quer fazer parte da nossa equipe? Preencha o formulário abaixo e mostre por que você é o candidato ideal!\n\n" +
        "O processo é dividido em **3 etapas** curtas:",
      ),
    )
    .addTextDisplayComponents(
      text(
        "**Etapa 1 —** Dados pessoais e disponibilidade\n" +
        "**Etapa 2 —** Experiência, motivação e habilidades\n" +
        "**Etapa 3 —** Cenário de moderação e informações finais",
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(
        "✅  Responda com sinceridade — isso faz toda a diferença\n" +
        "⏱️  Você tem **15 minutos** para concluir após iniciar\n" +
        "📬  Sua candidatura será avaliada pela administração",
      ),
    )
    .addSeparatorComponents(sep(true))
    .addActionRowComponents(row)
    .addTextDisplayComponents(
      text("-# Staff Application Bot • Todas as respostas são confidenciais"),
    );

  return { components: [container], flags: FLAGS_PUBLIC };
}

// ─────────────────────────────────────────────────────────────────────────────
// Step done panels (ephemeral)
// ─────────────────────────────────────────────────────────────────────────────
export function buildStep1DonePanel(): {
  components: ContainerBuilder[];
  flags: number;
} {
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

  const container = new ContainerBuilder()
    .setAccentColor(COLOR_YELLOW)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## ✅ Etapa 1 concluída!\n-# Progresso: ▰▱▱ 1 de 3"),
        )
        .setThumbnailAccessory(thumb(THUMB.check)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Seus dados pessoais foram salvos com sucesso.\n\n" +
        "A próxima etapa é sobre sua **experiência como moderador**, motivações e habilidades.",
      ),
    )
    .addSeparatorComponents(sep(true))
    .addActionRowComponents(row)
    .addTextDisplayComponents(
      text("-# A sessão expira em 15 minutos. Não feche o Discord antes de concluir."),
    );

  return { components: [container], flags: FLAGS_EPHEMERAL };
}

export function buildStep2DonePanel(): {
  components: ContainerBuilder[];
  flags: number;
} {
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

  const container = new ContainerBuilder()
    .setAccentColor(COLOR_YELLOW)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## ✅ Etapa 2 concluída!\n-# Progresso: ▰▰▱ 2 de 3 — quase lá!"),
        )
        .setThumbnailAccessory(thumb(THUMB.book)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Sua experiência e motivação foram registradas.\n\n" +
        "A última etapa é um **cenário de moderação** e espaço para informações extras. Quase pronto!",
      ),
    )
    .addSeparatorComponents(sep(true))
    .addActionRowComponents(row)
    .addTextDisplayComponents(
      text("-# Última etapa! Suas respostas ainda não foram enviadas."),
    );

  return { components: [container], flags: FLAGS_EPHEMERAL };
}

export function buildStep3DonePanel(): {
  components: ContainerBuilder[];
  flags: number;
} {
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

  const container = new ContainerBuilder()
    .setAccentColor(COLOR_GREEN)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## 🎉 Formulário Completo!\n-# Progresso: ▰▰▰ 3 de 3 — pronto para enviar"),
        )
        .setThumbnailAccessory(thumb(THUMB.party)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Você preencheu todas as etapas com sucesso!\n\n" +
        "Revise mentalmente suas respostas e clique em **Enviar Candidatura** para submeter à equipe.\n\n" +
        "⚠️  Após o envio, não será possível editar.",
      ),
    )
    .addSeparatorComponents(sep(true))
    .addActionRowComponents(row)
    .addTextDisplayComponents(
      text("-# Sua candidatura será enviada ao canal da staff para avaliação."),
    );

  return { components: [container], flags: FLAGS_EPHEMERAL };
}

// ─────────────────────────────────────────────────────────────────────────────
// Application card — posted in the staff channel
// ─────────────────────────────────────────────────────────────────────────────
export function buildApplicationCard(app: PendingApplication): {
  components: ContainerBuilder[];
  flags: number;
} {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(BTN_APPROVE_PREFIX + app.discordId)
      .setLabel("Aprovar")
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅"),
    new ButtonBuilder()
      .setCustomId(BTN_REJECT_PREFIX + app.discordId)
      .setLabel("Recusar")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("❌"),
  );

  const timestamp = Math.floor(Date.now() / 1000);

  const container = new ContainerBuilder()
    .setAccentColor(COLOR_BLURPLE)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text(
            `## 📋 Nova Candidatura à Staff\n` +
            `-# ${app.discordUsername}  •  ID: ${app.discordId}  •  <t:${timestamp}:R>`,
          ),
        )
        .setThumbnailAccessory(thumb(THUMB.memo)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        `**👤 Dados Pessoais**\n` +
        `**Nome:** ${app.realName}  •  **Idade:** ${app.age}  •  **Fuso:** ${app.timezone}\n` +
        `**Disponibilidade:** ${app.availability}\n` +
        `**Usuário Discord:** ${app.discordUser}  •  **Servidor de Origem:** ${app.serverOrigin}`,
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(
        `**📚 Experiência**\n${trunc(app.experience, 400)}\n\n` +
        `**💬 Por que quer ser staff?**\n${trunc(app.whyJoin, 400)}\n\n` +
        `**⭐ Habilidades**\n${trunc(app.skills, 300)}`,
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(
        `**⚖️ Cenário de Moderação**\n${trunc(app.scenario, 400)}\n\n` +
        `**📝 Informações Adicionais**\n${app.additionalInfo ? trunc(app.additionalInfo, 300) : "*Nenhuma.*"}`,
      ),
    )
    .addSeparatorComponents(sep(true))
    .addActionRowComponents(row)
    .addTextDisplayComponents(
      text("-# Clique em Aprovar ou Recusar para avaliar esta candidatura."),
    );

  return { components: [container], flags: FLAGS_PUBLIC };
}

// ─────────────────────────────────────────────────────────────────────────────
// Evaluated card — replaces the original card in the channel
// ─────────────────────────────────────────────────────────────────────────────
export function buildApplicationCardEvaluated(
  app: PendingApplication,
  status: "approved" | "rejected",
  adminUsername: string,
): { components: ContainerBuilder[]; flags: number } {
  const isApproved = status === "approved";
  const color = isApproved ? COLOR_GREEN : COLOR_GREY;
  const badge = isApproved ? "✅ APROVADO" : "❌ RECUSADO";
  const timestamp = Math.floor(Date.now() / 1000);

  const container = new ContainerBuilder()
    .setAccentColor(color)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text(
            `## ${badge}\n` +
            `-# ${app.discordUsername}  •  ID: ${app.discordId}  •  Avaliado por ${adminUsername}  •  <t:${timestamp}:R>`,
          ),
        )
        .setThumbnailAccessory(thumb(isApproved ? THUMB.check : THUMB.lock)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        `**👤 Dados Pessoais**\n` +
        `**Nome:** ${app.realName}  •  **Idade:** ${app.age}  •  **Fuso:** ${app.timezone}\n` +
        `**Disponibilidade:** ${app.availability}\n` +
        `**Usuário Discord:** ${app.discordUser}  •  **Servidor de Origem:** ${app.serverOrigin}`,
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(
        `**📚 Experiência**\n${trunc(app.experience, 400)}\n\n` +
        `**💬 Por que quer ser staff?**\n${trunc(app.whyJoin, 400)}\n\n` +
        `**⭐ Habilidades**\n${trunc(app.skills, 300)}`,
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(
        `**⚖️ Cenário de Moderação**\n${trunc(app.scenario, 400)}\n\n` +
        `**📝 Informações Adicionais**\n${app.additionalInfo ? trunc(app.additionalInfo, 300) : "*Nenhuma.*"}`,
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(`-# Candidatura ${isApproved ? "aprovada" : "recusada"} • Staff Application Bot`),
    );

  return { components: [container], flags: FLAGS_PUBLIC };
}

// ─────────────────────────────────────────────────────────────────────────────
// DM panels sent to the applicant
// ─────────────────────────────────────────────────────────────────────────────
export function buildOnboardingDM(data: {
  welcomeMsg: string;
  roleInfo: string;
  nextSteps: string;
  adminUsername: string;
}): { components: ContainerBuilder[]; flags: number } {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR_GREEN)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## 🎉 Candidatura Aprovada!\n-# Bem-vindo(a) à equipe de Staff"),
        )
        .setThumbnailAccessory(thumb(THUMB.party)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(text(data.welcomeMsg))
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(
        `**📌 Cargo que você receberá:** ${data.roleInfo}\n\n` +
        `**🗂️ Próximos passos:**\n${data.nextSteps}`,
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(`-# Aprovado por ${data.adminUsername} • Staff Application Bot`),
    );

  return { components: [container], flags: FLAGS_PUBLIC };
}

export function buildRejectionDM(data: {
  reason: string;
  feedback: string;
  adminUsername: string;
}): { components: ContainerBuilder[]; flags: number } {
  const feedbackBlock = data.feedback
    ? `\n\n**💡 Feedback da equipe:**\n${data.feedback}`
    : "";

  const container = new ContainerBuilder()
    .setAccentColor(COLOR_RED)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## ❌ Candidatura Não Aprovada\n-# Agradecemos seu interesse"),
        )
        .setThumbnailAccessory(thumb(THUMB.error)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        `Infelizmente sua candidatura não foi aprovada neste momento.\n\n` +
        `**Motivo:** ${data.reason}` +
        feedbackBlock,
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(
        "Não desanime! Continue participando da comunidade e você poderá tentar novamente no futuro. 💙",
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text(`-# Avaliado por ${data.adminUsername} • Staff Application Bot`),
    );

  return { components: [container], flags: FLAGS_PUBLIC };
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic state panels
// ─────────────────────────────────────────────────────────────────────────────
export function buildSuccessPanel(): {
  components: ContainerBuilder[];
  flags: number;
} {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR_GREEN)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## 📬 Candidatura Enviada!\n-# Obrigado por se candidatar à Staff"),
        )
        .setThumbnailAccessory(thumb(THUMB.send)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Sua candidatura foi entregue à equipe de administração com sucesso! 🎉\n\n" +
        "Aguarde a avaliação da staff — você receberá uma **mensagem direta** com a decisão.\n\n" +
        "Obrigado por querer fazer parte da nossa equipe! 💙",
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(
      text("-# Staff Application Bot • Candidatura registrada com sucesso"),
    );

  return { components: [container], flags: FLAGS_EPHEMERAL };
}

export function buildErrorPanel(message: string): {
  components: ContainerBuilder[];
  flags: number;
} {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR_RED)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## ❌ Ocorreu um Erro\n-# Tente novamente ou inicie o formulário do zero"),
        )
        .setThumbnailAccessory(thumb(THUMB.error)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(text(message))
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(text("-# Staff Application Bot"));

  return { components: [container], flags: FLAGS_EPHEMERAL };
}

export function buildCancelledPanel(): {
  components: ContainerBuilder[];
  flags: number;
} {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR_RED)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## 🗑️ Candidatura Cancelada\n-# Seus dados foram apagados"),
        )
        .setThumbnailAccessory(thumb(THUMB.cancel)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Sua candidatura foi cancelada e todos os dados foram removidos.\n\n" +
        "Se quiser tentar novamente, clique no botão **Iniciar Candidatura** no canal.",
      ),
    )
    .addSeparatorComponents(sep())
    .addTextDisplayComponents(text("-# Staff Application Bot"));

  return { components: [container], flags: FLAGS_EPHEMERAL };
}
