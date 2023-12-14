import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { login } from "./login.server";
import { sessionStorage } from "./session.server";

export const authenticator = new Authenticator<string>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const userName = form.get("userName");
    const password = form.get("password");
    const userId = await login(String(userName), String(password));
    return userId;
  }),
  "user-login"
);
