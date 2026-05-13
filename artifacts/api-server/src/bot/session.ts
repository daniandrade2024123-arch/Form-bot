export interface FormSession {
  page1?: {
    real_name: string;
    age: string;
    timezone: string;
    availability: string;
  };
  page2?: {
    experience: string;
    why_join: string;
    skills: string;
  };
  page3?: {
    discord_user: string;
    server_origin: string;
    scenario: string;
    additional_info: string;
  };
  expiresAt: number;
}

const SESSION_TTL_MS = 15 * 60 * 1000;

const sessions = new Map<string, FormSession>();

export function getSession(userId: string): FormSession | undefined {
  const session = sessions.get(userId);
  if (!session) return undefined;
  if (Date.now() > session.expiresAt) {
    sessions.delete(userId);
    return undefined;
  }
  return session;
}

export function setSession(userId: string, data: Partial<FormSession>): void {
  const existing = sessions.get(userId) ?? { expiresAt: 0 };
  sessions.set(userId, {
    ...existing,
    ...data,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
}

export function clearSession(userId: string): void {
  sessions.delete(userId);
}

export function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [userId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(userId);
    }
  }
}
