import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { AuthorizationError } from "remix-auth";
import { db } from "~/drizzle/config.server";
import { users } from "~/drizzle/schema";

export async function signup(userName: string, password: string): Promise<number> {
  // userNameが既に存在する場合はエラーを返す
  try {
    // ユーザーが既に存在するかどうかを確認
    const existingUserResult = await db.select().from(users).where(eq(users.name, userName));
    console.log("selectの結果: ", existingUserResult);

    if (existingUserResult.length > 0) {
      console.log("ユーザーが既に存在します");
      throw new AuthorizationError("ユーザーが既に存在します");
    }

    //パスワードのハッシュ化
    const saltRounds = 10; // ソルトの複雑さを設定
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ユーザー情報をDBに保存
    const createUserResult = await db
      .insert(users)
      .values({
        name: userName,
        password_hash: hashedPassword,
      })
      .returning({ id: users.id });

    console.log("insertの結果: ", createUserResult);

    return createUserResult[0].id;
  } catch (error) {
    console.error(error);
    throw new AuthorizationError("ユーザーの登録に失敗しました");
  }
}
