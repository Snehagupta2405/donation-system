import nodemailer from "nodemailer";

let transporter = null;

export function getMailer() {
  if (transporter) return transporter;

  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    transporter = null; // No SMTP configured
  }
  return transporter;
}

export async function sendOTPEmail(to, code) {
  const from = process.env.EMAIL_FROM || "no-reply@example.com";
  const mailer = getMailer();
  const subject = "Your login OTP";
  const text = `Your OTP code is ${code}. It will expire in 10 minutes.`;
  const html = `<p>Your OTP code is <b>${code}</b>. It will expire in 10 minutes.</p>`;

  if (!mailer) {
    console.log(`[DEV] OTP for ${to}: ${code}`);
    return { ok: true, devLogged: true };
  }

  await mailer.sendMail({ from, to, subject, text, html });
  return { ok: true };
}
