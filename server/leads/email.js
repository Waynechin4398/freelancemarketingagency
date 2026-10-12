// Email templates + delivery for website leads.
// Delivery uses Resend's HTTP API (free plan: 3,000 emails/month, 100/day) so it works from
// Pages Functions without touching wayneomni.com's existing mail (MX) setup.

const INK = "#111111";
const PAPER = "#f2f1ec";
const LIME = "#d4ff3a";
const MUTED = "#5d5d58";

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const nl2br = (value) => escapeHtml(value).replace(/\r?\n/g, "<br>");

export function formatMyt(iso) {
  try {
    return new Intl.DateTimeFormat("en-MY", {
      timeZone: "Asia/Kuala_Lumpur", dateStyle: "medium", timeStyle: "short",
    }).format(new Date(iso)) + " MYT";
  } catch {
    return iso;
  }
}

function shell({ preheader, body }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:${PAPER};">
<span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:2px solid ${INK};border-radius:20px;font-family:Arial,Helvetica,sans-serif;color:${INK};">
<tr><td style="padding:18px 24px;border-bottom:2px solid ${INK};font-weight:800;letter-spacing:.04em;font-size:15px;">WAYNE <span style="display:inline-block;width:12px;height:12px;border:2px solid ${INK};border-radius:50%;background:${LIME};vertical-align:-1px"></span>MNI</td></tr>
<tr><td style="padding:24px;font-size:15px;line-height:1.55;">${body}</td></tr>
</table></td></tr></table></body></html>`;
}

function detailRows(lead) {
  const rows = [
    ["Name", escapeHtml(lead.name)],
    ["Email", `<a href="mailto:${escapeHtml(lead.email)}" style="color:${INK}">${escapeHtml(lead.email)}</a>`],
    ["Company", escapeHtml(lead.company || "—")],
    ["Website", lead.website ? `<a href="${escapeHtml(lead.website)}" style="color:${INK}">${escapeHtml(lead.website)}</a>` : "—"],
  ];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:0 0 16px;">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 0;color:${MUTED};width:96px;vertical-align:top;font-family:'Courier New',monospace;font-size:12px;text-transform:uppercase;">${k}</td><td style="padding:6px 0;vertical-align:top;">${v}</td></tr>`)
    .join("")}</table>
<div style="padding:14px 16px;background:${PAPER};border-radius:12px;font-size:14px;">${nl2br(lead.brief)}</div>`;
}

const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };

// ---- Alert to Wayne -----------------------------------------------------------------

export function buildLeadAlert({ lead, triage, provider, aiError, isPreview }) {
  const firstName = lead.name.split(/\s+/)[0];
  const priority = triage?.priority;
  const tag = [isPreview ? "[Preview]" : "", priority === "high" ? "[High]" : ""].filter(Boolean).join(" ");
  const subject = `${tag ? `${tag} ` : ""}New lead: ${lead.name}${lead.company ? ` — ${lead.company}` : ""}`;

  let aiHtml = "";
  let aiText = "";
  if (triage) {
    const mailto = `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(triage.reply_subject || `Re: your project brief`)}&body=${encodeURIComponent(triage.reply_body)}`;
    aiHtml = `
<h2 style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;margin:28px 0 10px;font-family:'Courier New',monospace;">AI read · ${escapeHtml(provider || "")}</h2>
<div style="border:2px solid ${INK};border-radius:14px;padding:16px;">
<p style="margin:0 0 10px;">${nl2br(triage.summary)}</p>
<p style="margin:0 0 6px;font-size:14px;"><strong>Priority:</strong> ${PRIORITY_LABEL[priority] || "Medium"} — ${escapeHtml(triage.priority_reason)}</p>
${triage.services.length ? `<p style="margin:0 0 6px;font-size:14px;"><strong>Fits:</strong> ${triage.services.map(escapeHtml).join(", ")}</p>` : ""}
${triage.questions.length ? `<p style="margin:10px 0 4px;font-size:14px;"><strong>Ask on the call:</strong></p><ul style="margin:0;padding-left:20px;font-size:14px;">${triage.questions.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ul>` : ""}
</div>
<h2 style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;margin:28px 0 10px;font-family:'Courier New',monospace;">Draft reply (review before sending)</h2>
<div style="border:2px dashed ${INK};border-radius:14px;padding:16px;font-size:14px;">
<p style="margin:0 0 10px;"><strong>Subject:</strong> ${escapeHtml(triage.reply_subject)}</p>
<p style="margin:0;">${nl2br(triage.reply_body)}</p>
</div>
<p style="margin:18px 0 0;"><a href="${escapeHtml(mailto)}" style="display:inline-block;background:${LIME};color:${INK};border:2px solid ${INK};border-radius:999px;padding:11px 20px;font-weight:700;text-decoration:none;">Reply with this draft ↗</a></p>
<p style="margin:10px 0 0;font-size:12px;color:${MUTED};">Or just hit Reply — this email's reply-to is ${escapeHtml(lead.email)}. Nothing has been sent to ${escapeHtml(firstName)} by AI.</p>`;
    aiText = [
      `\nAI READ (${provider || ""})`,
      triage.summary,
      `Priority: ${priority} — ${triage.priority_reason}`,
      triage.services.length ? `Fits: ${triage.services.join(", ")}` : null,
      ...(triage.questions.length ? ["Ask on the call:", ...triage.questions.map((q) => `- ${q}`)] : []),
      "\nDRAFT REPLY (review before sending)",
      `Subject: ${triage.reply_subject}`,
      triage.reply_body,
    ].filter((line) => line !== null).join("\n");
  } else {
    aiHtml = `<p style="margin:24px 0 0;font-size:13px;color:${MUTED};">AI summary unavailable for this lead${aiError ? ` (${escapeHtml(aiError)})` : ""}. Hit Reply to answer ${escapeHtml(firstName)} directly.</p>`;
  }

  const meta = `<p style="margin:28px 0 0;font-size:11px;color:${MUTED};font-family:'Courier New',monospace;">${escapeHtml(formatMyt(lead.created_at))} · ${escapeHtml(lead.source_page || "/contact")}${lead.country ? ` · ${escapeHtml(lead.country)}` : ""} · ID ${escapeHtml(lead.id)}</p>`;

  const html = shell({
    preheader: triage?.summary || `${lead.name} sent a project brief.`,
    body: `<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-family:'Courier New',monospace;color:${MUTED};">New project brief${isPreview ? " · preview site" : ""}</p>
<h1 style="margin:0 0 18px;font-size:24px;line-height:1.15;">${escapeHtml(lead.name)}${lead.company ? ` <span style="color:${MUTED};font-weight:400">· ${escapeHtml(lead.company)}</span>` : ""}</h1>
${detailRows(lead)}${aiHtml}${meta}`,
  });

  const text = [
    `New project brief${isPreview ? " (preview site)" : ""}`,
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company || "—"}`,
    `Website: ${lead.website || "—"}`,
    "",
    lead.brief,
    aiText,
    "",
    `${formatMyt(lead.created_at)} · ${lead.source_page || "/contact"} · ID ${lead.id}`,
  ].join("\n");

  return { subject, html, text };
}

// ---- Copy for the lead (fixed template, never AI-written) -----------------------------

export function buildLeadCopy({ lead, site }) {
  const firstName = lead.name.split(/\s+/)[0];
  const subject = `Got your brief, ${firstName} — Wayne Omni`;
  const html = shell({
    preheader: "Thanks for the brief — here's a copy of what you sent.",
    body: `<h1 style="margin:0 0 14px;font-size:24px;line-height:1.15;">Thanks, ${escapeHtml(firstName)}. Brief received.</h1>
<p style="margin:0 0 14px;">I read every brief myself and will reply personally within one business day. Here's a copy of what you sent for your records.</p>
${detailRows(lead)}
<p style="margin:22px 0 10px;">Want to move faster?</p>
<p style="margin:0 0 6px;">
<a href="${escapeHtml(site.bookingUrl)}" style="display:inline-block;background:${LIME};color:${INK};border:2px solid ${INK};border-radius:999px;padding:11px 20px;font-weight:700;text-decoration:none;margin:0 6px 8px 0;">Book a 30-min call ↗</a>
<a href="${escapeHtml(site.whatsappUrl)}" style="display:inline-block;background:#ffffff;color:${INK};border:2px solid ${INK};border-radius:999px;padding:11px 20px;font-weight:700;text-decoration:none;margin:0 0 8px;">WhatsApp me ↗</a>
</p>
<p style="margin:16px 0 0;">Talk soon,<br>Wayne<br><span style="color:${MUTED};font-size:13px;">Wayne Omni · wayneomni.com</span></p>
<p style="margin:26px 0 0;font-size:11px;color:${MUTED};line-height:1.5;">You're receiving this one-off copy because this address was entered in the project brief form at wayneomni.com/contact. If that wasn't you, you can ignore this email — you won't hear from us again. Wayne Omnipotent (SSM ${escapeHtml(site.ssmNumber)}).</p>`,
  });
  const text = [
    `Thanks, ${firstName}. Brief received.`,
    "",
    "I read every brief myself and will reply personally within one business day. Here's a copy of what you sent:",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company || "—"}`,
    `Website: ${lead.website || "—"}`,
    "",
    lead.brief,
    "",
    `Book a 30-min call: ${site.bookingUrl}`,
    `WhatsApp: ${site.whatsappUrl}`,
    "",
    "Talk soon,",
    "Wayne",
    "Wayne Omni · wayneomni.com",
    "",
    "You're receiving this one-off copy because this address was entered in the project brief form at wayneomni.com/contact. If that wasn't you, please ignore this email.",
  ].join("\n");
  return { subject, html, text };
}

// ---- Delivery -------------------------------------------------------------------------

export async function sendWithResend(env, { from, to, replyTo, subject, html, text, idempotencyKey }) {
  if (!env.RESEND_API_KEY) return { ok: false, status: "skipped: RESEND_API_KEY not set" };
  const response = await fetch(`${env.RESEND_API_BASE || "https://api.resend.com"}/emails`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
      ...(idempotencyKey ? { "idempotency-key": idempotencyKey } : {}),
    },
    body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, html, text }),
  });
  const body = await response.text();
  if (!response.ok) {
    console.error("resend send failed", response.status, body.slice(0, 300));
    return { ok: false, status: `error ${response.status}: ${body.slice(0, 200)}` };
  }
  let id = "";
  try { id = JSON.parse(body).id || ""; } catch { /* ignore */ }
  return { ok: true, status: `sent ${id}`.trim() };
}
