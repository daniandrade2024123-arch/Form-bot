import nodemailer from "nodemailer";
import { logger } from "../lib/logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env["EMAIL_USER"],
    pass: process.env["EMAIL_PASS"],
  },
});

export interface StaffApplication {
  discordUsername: string;
  discordId: string;
  realName: string;
  age: string;
  timezone: string;
  experience: string;
  whyJoin: string;
  availability: string;
  skills: string;
  additionalInfo: string;
}

export async function sendApplicationEmail(
  application: StaffApplication,
): Promise<void> {
  const to = process.env["EMAIL_TO"];
  const from = process.env["EMAIL_USER"];

  if (!to || !from) {
    throw new Error("EMAIL_TO or EMAIL_USER environment variables not set");
  }

  const submittedAt = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "full",
    timeStyle: "short",
  });

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 32px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
    .header { background: #5865F2; color: #fff; padding: 28px 32px; }
    .header h1 { margin: 0; font-size: 22px; }
    .header p { margin: 6px 0 0; opacity: 0.85; font-size: 14px; }
    .body { padding: 28px 32px; }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 12px; font-weight: bold; color: #5865F2; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .field p { margin: 0; font-size: 15px; color: #333; background: #f9f9f9; border-left: 3px solid #5865F2; padding: 10px 14px; border-radius: 4px; white-space: pre-wrap; }
    .divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }
    .footer { background: #f4f4f4; padding: 16px 32px; font-size: 12px; color: #999; text-align: center; }
    .badge { display: inline-block; background: #5865F2; color: #fff; border-radius: 999px; font-size: 12px; padding: 2px 10px; margin-left: 8px; vertical-align: middle; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Nova Candidatura à Staff</h1>
      <p>Recebida em ${submittedAt}</p>
    </div>
    <div class="body">
      <div class="field">
        <label>Usuário Discord</label>
        <p>${escapeHtml(application.discordUsername)} <span class="badge">ID: ${escapeHtml(application.discordId)}</span></p>
      </div>
      <div class="field">
        <label>Nome Real</label>
        <p>${escapeHtml(application.realName)}</p>
      </div>
      <div class="field">
        <label>Idade</label>
        <p>${escapeHtml(application.age)}</p>
      </div>
      <div class="field">
        <label>Fuso Horário</label>
        <p>${escapeHtml(application.timezone)}</p>
      </div>
      <hr class="divider" />
      <div class="field">
        <label>Experiência Anterior</label>
        <p>${escapeHtml(application.experience)}</p>
      </div>
      <div class="field">
        <label>Por que quer ser Staff?</label>
        <p>${escapeHtml(application.whyJoin)}</p>
      </div>
      <div class="field">
        <label>Disponibilidade de Horas por Semana</label>
        <p>${escapeHtml(application.availability)}</p>
      </div>
      <div class="field">
        <label>Habilidades / Qualidades</label>
        <p>${escapeHtml(application.skills)}</p>
      </div>
      <div class="field">
        <label>Informações Adicionais</label>
        <p>${escapeHtml(application.additionalInfo) || "<em style='color:#aaa'>Nenhuma informação adicional.</em>"}</p>
      </div>
    </div>
    <div class="footer">
      Este email foi gerado automaticamente pelo bot de candidaturas do servidor Discord.
    </div>
  </div>
</body>
</html>
  `.trim();

  await transporter.sendMail({
    from: `"Bot Staff Discord" <${from}>`,
    to,
    subject: `[Staff Application] Nova candidatura de ${application.discordUsername}`,
    html,
  });

  logger.info(
    { discordId: application.discordId, username: application.discordUsername },
    "Staff application email sent",
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
