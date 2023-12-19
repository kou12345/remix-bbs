import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { login } from "./login.server";
import { sessionStorage } from "./session.server";
import { signup } from "./signup.server";

export const authenticator = new Authenticator<string>(sessionStorage);

// ログイン
authenticator.use(
  new FormStrategy(async ({ form }) => {
    try {
      const userName = form.get("userName");
      const password = form.get("password");
      const userId = await login(String(userName), String(password));
      console.log("ログイン成功");
      return String(userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }),
  "user-login"
);

// サインアップ
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const userName = form.get("userName") as string;
    const password = form.get("password") as string;
    console.log(userName, password);

    const userId = await signup(userName, password);
    return String(userId);
  }),
  "user-signup"
);
