export interface PendingApplication {
  discordUsername: string;
  discordId: string;
  realName: string;
  age: string;
  timezone: string;
  availability: string;
  experience: string;
  whyJoin: string;
  skills: string;
  discordUser: string;
  serverOrigin: string;
  scenario: string;
  additionalInfo: string;
}

const pending = new Map<string, PendingApplication>();

export function storePendingApplication(
  userId: string,
  data: PendingApplication,
): void {
  pending.set(userId, data);
}

export function getPendingApplication(
  userId: string,
): PendingApplication | undefined {
  return pending.get(userId);
}

export function removePendingApplication(userId: string): void {
  pending.delete(userId);
}
