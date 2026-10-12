// POST /api/lead — the wayneomni.com project brief form.
//
// 1. Validate + spam checks (origin, honeypot, optional Turnstile, D1 rate limits)
// 2. Store the lead in D1
// 3. Respond to the browser straight away
// 4. In the background: AI triage → alert email to Wayne (with draft reply) → copy to the lead
//
// Bindings / settings (Pages project → Settings → Variables and Secrets / Bindings):
//   DB                 D1 database (wayne-omni-leads)                       required
//   AI                 Workers AI binding                                   optional (free AI)
//   RESEND_API_KEY     secret — Resend API key                              required for email
//   TURNSTILE_SECRET   secret — Turnstile secret key                        optional
//   ANTHROPIC_API_KEY  secret — use Claude instead of Workers AI            optional
//   SEND_LEAD_COPY     "false" to stop sending the copy to the lead         optional
//   NOTIFY_TO, ALERT_FROM, COPY_FROM, REPLY_TO, AI_MODEL, ANTHROPIC_MODEL   optional overrides

import { triageLead } from "./triage.js";
import { buildLeadAlert, buildLeadCopy, sendWithResend } from "./email.js";

export const SITE = {
  bookingUrl: "https://calendly.com/waynegtcfx/30min",
  whatsappUrl: "https://wa.me/601123394398?text=Hi%20Wayne%2C%20I%20found%20Wayne%20Omni%20and%20would%20like%20to%20discuss%20a%20project.",
  ssmNumber: "202303064098 (CT0118753-P)",
};

const DEFAULTS = {
  NOTIFY_TO: "waynegtcfx@gmail.com",
  ALERT_FROM: "Wayne Omni Leads <leads@wayneomni.com>",
  COPY_FROM: "Wayne from Wayne Omni <wayne@wayneomni.com>",
  REPLY_TO: "waynegtcfx@gmail.com",
};

const LIMITS = { name: 120, email: 254, company: 160, website: 300, brief: 1600, page: 200 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

const setting = (env, key) => (typeof env[key] === "string" && env[key].trim()) || DEFAULTS[key];

function isAllowedOrigin(origin, requestUrl) {
  if (!origin) return true; // same-origin form posts from some browsers omit Origin
  try {
    const { hostname, protocol } = new URL(origin);
    if (origin === new URL(requestUrl).origin) return true;
    if (hostname === "wayneomni.com" || hostname === "www.wayneomni.com") return protocol === "https:";
    if (hostname === "wayne-omni.pages.dev" || hostname.endsWith(".wayne-omni.pages.dev")) return protocol === "https:";
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

const wantsJson = (request) =>
  (request.headers.get("accept") || "").includes("application/json") ||
  (request.headers.get("content-type") || "").includes("application/json");

function reply(request, status, payload) {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  }
  // No-JavaScript fallback: plain form post → redirect to a thank-you page or show the error.
  if (payload.ok) return Response.redirect(new URL("/contact/thanks/", request.url).toString(), 303);
  const message = String(payload.error || "Something went wrong.").replace(/[<>&]/g, "");
  return new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Brief not sent · Wayne Omni</title><body style="font-family:system-ui,sans-serif;max-width:560px;margin:12vh auto;padding:0 20px;line-height:1.6"><h1>That didn't go through.</h1><p>${message}</p><p><a href="/contact/#audit">Go back to the form</a> or email <a href="mailto:waynegtcfx@gmail.com">waynegtcfx@gmail.com</a>.</p></body>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } },
  );
}

async function readBody(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const data = await request.json();
    return data && typeof data === "object" ? data : {};
  }
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    return Object.fromEntries((await request.formData()).entries());
  }
  return {};
}

const clean = (value, max) =>
  String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/[​-‍﻿]/g, "")
    .trim()
    .slice(0, max);

function normaliseWebsite(value) {
  if (!value) return "";
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    if (!url.hostname.includes(".")) return "";
    return url.toString().slice(0, LIMITS.website);
  } catch {
    return "";
  }
}

export function validateLead(body) {
  const lead = {
    name: clean(body.name, LIMITS.name).replace(/\s+/g, " "),
    email: clean(body.email, LIMITS.email).toLowerCase(),
    company: clean(body.company, LIMITS.company).replace(/\s+/g, " "),
    website: normaliseWebsite(clean(body.website, LIMITS.website)),
    brief: clean(body.brief, LIMITS.brief).replace(/\r\n/g, "\n").replace(/\n{4,}/g, "\n\n\n"),
    source_page: clean(body.page, LIMITS.page) || "/contact/",
  };
  const consent = body.consent === true || body.consent === "on" || body.consent === "true" || body.consent === "yes";
  const errors = {};
  if (lead.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(lead.email)) errors.email = "Please enter a valid email address.";
  if (lead.brief.length < 15) errors.brief = "Tell me a little more about the project (a sentence or two is fine).";
  if (!consent) errors.consent = "Please confirm I can use these details to reply to you.";
  if (/https?:\/\//i.test(lead.name) || /https?:\/\//i.test(lead.company)) errors.name = errors.name || "Please enter your name without links.";
  return { lead, consent, errors };
}

async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true; // not configured yet
  if (!token) return false;
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const outcome = await response.json();
    return Boolean(outcome.success);
  } catch (error) {
    console.error("turnstile verify failed", error);
    return false;
  }
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const isoMinusMinutes = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

async function countSince(db, column, value, minutes, extra = "", extraBinds = []) {
  const row = await db
    .prepare(`SELECT COUNT(*) AS n FROM leads WHERE ${column} = ?1 AND created_at > ?2 ${extra}`)
    .bind(value, isoMinusMinutes(minutes), ...extraBinds)
    .first();
  return Number(row?.n || 0);
}

export async function processLead(lead, env, { isPreview }) {
  const { triage, provider, error: aiError } = await triageLead(lead, env, SITE);

  const alert = buildLeadAlert({ lead, triage, provider, aiError, isPreview });
  const notify = await sendWithResend(env, {
    from: setting(env, "ALERT_FROM"),
    to: setting(env, "NOTIFY_TO"),
    replyTo: lead.email,
    subject: alert.subject,
    html: alert.html,
    text: alert.text,
    idempotencyKey: `lead-alert-${lead.id}`,
  });

  let copyStatus = "skipped: disabled";
  if (String(env.SEND_LEAD_COPY ?? "true").toLowerCase() !== "false") {
    // At most one copy per address per 24h, so the form can't be used to spam someone.
    const recentCopies = await countSince(env.DB, "email", lead.email, 24 * 60, "AND copy_status LIKE 'sent%' AND id != ?3", [lead.id])
      .catch(() => 0);
    if (recentCopies > 0) {
      copyStatus = "skipped: copy already sent in last 24h";
    } else {
      const copy = buildLeadCopy({ lead, site: SITE });
      const sent = await sendWithResend(env, {
        from: setting(env, "COPY_FROM"),
        to: lead.email,
        replyTo: setting(env, "REPLY_TO"),
        subject: copy.subject,
        html: copy.html,
        text: copy.text,
        idempotencyKey: `lead-copy-${lead.id}`,
      });
      copyStatus = sent.status;
    }
  }

  await env.DB.prepare(
    "UPDATE leads SET ai_summary = ?1, ai_priority = ?2, ai_draft = ?3, notify_status = ?4, copy_status = ?5 WHERE id = ?6",
  )
    .bind(
      triage ? JSON.stringify({ provider, summary: triage.summary, services: triage.services, reason: triage.priority_reason, questions: triage.questions }) : aiError || null,
      triage?.priority || null,
      triage ? `${triage.reply_subject}\n\n${triage.reply_body}` : null,
      notify.status,
      copyStatus,
      lead.id,
    )
    .run()
    .catch((error) => console.error("lead update failed", error));

  return { triage, notify, copyStatus };
}

export async function handleLeadRequest(request, env, waitUntil) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
  }
  if (!isAllowedOrigin(request.headers.get("origin"), request.url)) {
    return reply(request, 403, { ok: false, error: "This form can only be sent from wayneomni.com." });
  }
  if (!env.DB) {
    console.error("DB binding missing");
    return reply(request, 503, { ok: false, error: "The form is being set up. Please email or WhatsApp instead." });
  }

  let body;
  try {
    body = await readBody(request);
  } catch {
    return reply(request, 400, { ok: false, error: "Couldn't read the form. Please try again." });
  }

  // Honeypot: real people never see this field. Pretend success so bots learn nothing.
  if (clean(body.fax, 200)) return reply(request, 200, { ok: true });

  const { lead, consent, errors } = validateLead(body);
  if (Object.keys(errors).length) {
    return reply(request, 422, { ok: false, error: Object.values(errors)[0], fields: errors });
  }

  const ip = request.headers.get("cf-connecting-ip") || "";
  const tokenOk = await verifyTurnstile(env, clean(body["cf-turnstile-response"] ?? body.turnstile, 4096), ip);
  if (!tokenOk) {
    return reply(request, 400, { ok: false, error: "The spam check didn't pass. Please refresh the page and try again." });
  }

  const ipHash = ip ? (await sha256Hex(`${env.IP_SALT || "wayne-omni-leads"}:${ip}`)).slice(0, 32) : null;
  try {
    if (ipHash && (await countSince(env.DB, "ip_hash", ipHash, 60)) >= 5) {
      return reply(request, 429, { ok: false, error: "That's a lot of briefs in a short time. Please try again later or WhatsApp me." });
    }
    if ((await countSince(env.DB, "email", lead.email, 10)) >= 2) {
      return reply(request, 429, { ok: false, error: "I've already got your brief — I'll be in touch soon." });
    }
  } catch (error) {
    console.error("rate limit check failed", error);
  }

  const host = new URL(request.url).hostname;
  const record = {
    ...lead,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    country: request.cf?.country || request.headers.get("cf-ipcountry") || null,
  };

  try {
    await env.DB.prepare(
      `INSERT INTO leads (id, created_at, name, email, company, website, brief, consent, source_page, country, ip_hash, user_agent)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)`,
    )
      .bind(
        record.id, record.created_at, record.name, record.email, record.company || null, record.website || null,
        record.brief, consent ? 1 : 0, `${host}${record.source_page}`.slice(0, 250), record.country, ipHash,
        clean(request.headers.get("user-agent"), 300) || null,
      )
      .run();
  } catch (error) {
    console.error("lead insert failed", error);
    return reply(request, 500, { ok: false, error: "Couldn't save your brief just now. Please try again, or email or WhatsApp me." });
  }

  const isPreview = host !== "wayneomni.com" && host !== "www.wayneomni.com";
  const work = processLead(record, env, { isPreview }).catch((error) => console.error("lead processing failed", error));
  if (waitUntil) waitUntil(work);
  else await work;

  const copyEnabled = String(env.SEND_LEAD_COPY ?? "true").toLowerCase() !== "false" && Boolean(env.RESEND_API_KEY);
  return reply(request, 200, { ok: true, id: record.id, copy: copyEnabled });
}
