import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { logger } from "../lib/logger";

const commands = [
  new SlashCommandBuilder()
    .setName("staff-form")
    .setDescription("Envia o painel de candidatura à Staff no canal atual")
    .toJSON(),
];

export async function deployCommands(): Promise<void> {
  const token = process.env["DISCORD_TOKEN"];
  const clientId = process.env["DISCORD_CLIENT_ID"];

  if (!token || !clientId) {
    throw new Error("DISCORD_TOKEN or DISCORD_CLIENT_ID not set");
  }

  const rest = new REST({ version: "10" }).setToken(token);

  logger.info("Registering slash commands...");
  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  logger.info("Slash commands registered successfully");
}
