import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret: string | undefined = process.env.SESSION_SECRET;
if (sessionSecret === undefined) {
  throw new Error("SESSION_SECRET environment variable must be set");
}

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session",
    sameSite: "lax", // this helps with CSRF
    path: "/", // すべてのルートでクッキーが機能するように、これを追加することを忘れないでください。
    httpOnly: true, // セキュリティ上の理由から、このクッキーはhttpのみにしてください。
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});
