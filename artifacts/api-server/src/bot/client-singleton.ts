import type { Client } from "discord.js";

let _client: Client | null = null;

export function setDiscordClient(client: Client): void {
  _client = client;
}

export function getDiscordClient(): Client {
  if (!_client) throw new Error("Discord client not initialised yet");
  return _client;
}
