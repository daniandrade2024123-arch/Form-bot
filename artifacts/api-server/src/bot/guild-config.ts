import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { logger } from "../lib/logger";

interface GuildConfig {
  applicationChannelId: string;
}

const CONFIG_PATH = path.join(process.cwd(), "guild-configs.json");

const configs = new Map<string, GuildConfig>();

export function loadGuildConfigs(): void {
  if (!existsSync(CONFIG_PATH)) return;
  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    const data = JSON.parse(raw) as Record<string, GuildConfig>;
    for (const [guildId, cfg] of Object.entries(data)) {
      configs.set(guildId, cfg);
    }
    logger.info({ guilds: configs.size }, "Guild configs loaded");
  } catch (err) {
    logger.error({ err }, "Failed to load guild configs");
  }
}

function saveGuildConfigs(): void {
  try {
    const data: Record<string, GuildConfig> = {};
    for (const [guildId, cfg] of configs.entries()) {
      data[guildId] = cfg;
    }
    writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    logger.error({ err }, "Failed to save guild configs");
  }
}

export function setApplicationChannel(guildId: string, channelId: string): void {
  configs.set(guildId, { applicationChannelId: channelId });
  saveGuildConfigs();
}

export function getApplicationChannelId(guildId: string): string | undefined {
  return configs.get(guildId)?.applicationChannelId;
}
