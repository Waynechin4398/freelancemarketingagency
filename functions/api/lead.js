// Cloudflare Pages Function → https://wayneomni.com/api/lead
// All logic lives in /server/leads so it can be tested outside Pages.
import { handleLeadRequest } from "../../server/leads/handler.js";

export const onRequest = (context) =>
  handleLeadRequest(context.request, context.env, context.waitUntil.bind(context));
