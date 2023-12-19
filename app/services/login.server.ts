import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { AuthorizationError } from "remix-auth";
import { db } from "~/drizzle/config.server";
import { users } from "~/drizzle/schema";

export async function login(userName: string, password: string): Promise<number> {
  try {
    // ユーザーが既に存在するかどうかを確認
    const existingUserResult = await db.select().from(users).where(eq(users.name, userName));
    console.log("selectの結果: ", existingUserResult);

    if (existingUserResult.length === 0) {
      console.log("ユーザーが存在しません");
      throw new AuthorizationError("ユーザーが存在しません");
    }

    // パスワードの照合
    const user = existingUserResult[0];
    const passwordHash = user.password_hash;
    const isPasswordMatch = await bcrypt.compare(password, passwordHash);

    if (!isPasswordMatch) {
      console.log("パスワードが一致しません");
      throw new AuthorizationError("パスワードが一致しません");
    }

    return user.id;
  } catch (error) {
    console.error(error);
    throw new AuthorizationError("ログインに失敗しました");
  }
}
