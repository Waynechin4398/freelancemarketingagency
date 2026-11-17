// Cloudflare Pages Function → https://wayneomni.com/api/auth
// Starts the GitHub OAuth login for the content portal at /admin/.
// Needs Pages environment variables GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.
export const onRequestGet = async ({ request, env }) => {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response("Content portal login is not configured yet (missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET).", { status: 500 });
  }
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorize.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
  authorize.searchParams.set("scope", url.searchParams.get("scope") || "repo,user");
  authorize.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      "Set-Cookie": `decap_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      "Cache-Control": "no-store",
    },
  });
};
