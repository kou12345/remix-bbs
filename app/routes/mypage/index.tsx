import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/drizzle/config.server";
import { users } from "~/drizzle/schema";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  // sessionを取得する
  const session = await getSession(request.headers.get("cookie"));

  // ログイン中のユーザー情報を取得する
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, session.data.user));
    console.log("result: ", result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export default function MyPageIndex() {
  const user = useLoaderData<typeof loader>();
  console.log(user);
  return (
    <div>
      <h2>マイページ</h2>
      <div>ユーザー名: {user[0].name}</div>
      <hr />
      {/* いいねした投稿を表示する */}
    </div>
  );
}
