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
} from "./modals";

const COLOR_BLURPLE = 0x5865f2;
const COLOR_GREEN   = 0x57f287;
const COLOR_YELLOW  = 0xfee75c;
const COLOR_RED     = 0xed4245;

const FLAGS_PUBLIC   = MessageFlags.IsComponentsV2;
const FLAGS_EPHEMERAL = MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral;

const THUMB = {
  staff:   "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6e1.png",
  check:   "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png",
  book:    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4d6.png",
  party:   "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png",
  mail:    "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4e8.png",
  cancel:  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f5d1.png",
  error:   "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/274c.png",
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
        "📧  Suas respostas são enviadas direto para a administração",
      ),
    )
    .addSeparatorComponents(sep(true))
    .addActionRowComponents(row)
    .addTextDisplayComponents(
      text("-# Staff Application Bot • Todas as respostas são confidenciais"),
    );

  return { components: [container], flags: FLAGS_PUBLIC };
}

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
          text("## ✅ Etapa 1 concluída!\n-# Progresso: ▰▰▱ 1 de 3"),
        )
        .setThumbnailAccessory(thumb(THUMB.check)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Ótimo! Seus dados pessoais foram salvos com sucesso.\n\n" +
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
          text("## ✅ Etapa 2 concluída!\n-# Progresso: ▰▰▰ 2 de 3 — quase lá!"),
        )
        .setThumbnailAccessory(thumb(THUMB.book)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Excelente! Sua experiência e motivação foram registradas.\n\n" +
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
        "Revise mentalmente suas respostas e clique em **Enviar Candidatura** para submeter à equipe de administração.\n\n" +
        "⚠️  Após o envio, não será possível editar.",
      ),
    )
    .addSeparatorComponents(sep(true))
    .addActionRowComponents(row)
    .addTextDisplayComponents(
      text("-# Suas respostas serão enviadas por email para a staff."),
    );

  return { components: [container], flags: FLAGS_EPHEMERAL };
}

export function buildSuccessPanel(): {
  components: ContainerBuilder[];
  flags: number;
} {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR_GREEN)
    .addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          text("## 📨 Candidatura Enviada!\n-# Obrigado por se candidatar à Staff"),
        )
        .setThumbnailAccessory(thumb(THUMB.mail)),
    )
    .addSeparatorComponents(sep(true))
    .addTextDisplayComponents(
      text(
        "Sua candidatura foi entregue à equipe de administração com sucesso! 🎉\n\n" +
        "Aguarde o contato da staff — normalmente respondemos em até **72 horas**.\n\n" +
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
    .addTextDisplayComponents(
      text("-# Staff Application Bot"),
    );

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
    .addTextDisplayComponents(
      text("-# Staff Application Bot"),
    );

  return { components: [container], flags: FLAGS_EPHEMERAL };
}
