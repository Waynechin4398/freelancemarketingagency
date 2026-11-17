// Cloudflare Pages Function → https://wayneomni.com/api/callback
// Finishes the GitHub OAuth login and hands the token to Decap CMS in the opener window.
const page = (status, content, origin) => {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  return new Response(`<!doctype html><html><head><meta name="robots" content="noindex"></head><body><p>${status === "success" ? "Logged in. You can close this window." : "Login failed. Close this window and try again."}</p><script>
(function () {
  var origin = ${JSON.stringify(origin)};
  var message = ${JSON.stringify(message)};
  function receive(event) {
    if (event.origin !== origin) return;
    window.removeEventListener("message", receive, false);
    window.opener.postMessage(message, origin);
  }
  window.addEventListener("message", receive, false);
  if (window.opener) window.opener.postMessage("authorizing:github", origin);
})();
</script></body></html>`, {
    status: status === "success" ? 200 : 400,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Set-Cookie": "decap_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
};

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = (request.headers.get("Cookie") || "").match(/(?:^|;\s*)decap_oauth_state=([^;]+)/)?.[1];

  if (!code || !state || state !== cookieState) {
    return page("error", { message: "Invalid login state. Please try again." }, origin);
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "wayne-omni-cms" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${origin}/api/callback`,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!result.access_token) {
    return page("error", { message: result.error_description || "GitHub did not return a token." }, origin);
  }
  return page("success", { token: result.access_token, provider: "github" }, origin);
};
