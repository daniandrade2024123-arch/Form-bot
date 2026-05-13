import {
  Client,
  GatewayIntentBits,
  Events,
  type ButtonInteraction,
  type ModalSubmitInteraction,
  type ChatInputCommandInteraction,
} from "discord.js";
import { logger } from "../lib/logger";
import { handleButton, handleModalSubmit } from "./handlers";
import { deployCommands } from "./deploy-commands";
import { buildWelcomePanel } from "./embeds";
import { cleanupExpiredSessions } from "./session";
import {
  BTN_OPEN_FORM,
  BTN_PAGE2,
  BTN_PAGE3,
  BTN_SUBMIT,
  BTN_CANCEL,
  MODAL_PAGE_1_ID,
  MODAL_PAGE_2_ID,
  MODAL_PAGE_3_ID,
} from "./modals";

const BUTTON_IDS = new Set([
  BTN_OPEN_FORM,
  BTN_PAGE2,
  BTN_PAGE3,
  BTN_SUBMIT,
  BTN_CANCEL,
]);

const MODAL_IDS = new Set([
  MODAL_PAGE_1_ID,
  MODAL_PAGE_2_ID,
  MODAL_PAGE_3_ID,
]);

export function createDiscordClient(): Client {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once(Events.ClientReady, async (readyClient) => {
    logger.info({ tag: readyClient.user.tag }, "Discord bot is online");
    try {
      await deployCommands();
    } catch (err) {
      logger.error({ err }, "Failed to deploy slash commands");
    }

    setInterval(cleanupExpiredSessions, 5 * 60 * 1000);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        await handleSlashCommand(interaction as ChatInputCommandInteraction);
        return;
      }

      if (
        interaction.isButton() &&
        BUTTON_IDS.has(interaction.customId)
      ) {
        await handleButton(interaction as ButtonInteraction);
        return;
      }

      if (
        interaction.isModalSubmit() &&
        MODAL_IDS.has(interaction.customId)
      ) {
        await handleModalSubmit(interaction as ModalSubmitInteraction);
        return;
      }
    } catch (err) {
      logger.error({ err }, "Unhandled interaction error");
    }
  });

  return client;
}

async function handleSlashCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  if (interaction.commandName !== "staff-form") return;

  const { components, flags } = buildWelcomePanel();
  await interaction.reply({ components, flags });
}

export async function startDiscordBot(): Promise<void> {
  const token = process.env["DISCORD_TOKEN"];
  if (!token) {
    throw new Error("DISCORD_TOKEN environment variable is not set");
  }

  const client = createDiscordClient();
  await client.login(token);
}
