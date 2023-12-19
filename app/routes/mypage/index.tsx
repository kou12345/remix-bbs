import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/drizzle/config.server";
import { likes, posts, users } from "~/drizzle/schema";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";

/*
? ここでいいねした投稿一覧を取得するのはどうなんだろうか？
*/

type Post = {
  id: number | null;
  content: string | null;
  userName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  // sessionを取得する
  const session = await getSession(request.headers.get("cookie"));

  // ログイン中のユーザー情報を取得する
  try {
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, session.data.user));
    console.log("userResult: ", userResult);

    // いいねした投稿を取得する
    const postsResult = await db
      .select({
        id: posts.id,
        content: posts.content,
        userName: users.name,
        createdAt: posts.created_at,
        updatedAt: posts.updated_at,
      })
      .from(likes)
      .leftJoin(posts, eq(likes.post_id, posts.id))
      .leftJoin(users, eq(posts.user_id, users.id))
      .where(eq(likes.user_id, session.data.user));
    console.log("postsResult: ", postsResult);

    const postData = postsResult.map((post: Post) => {
      return {
        id: post.id as number,
        content: post.content as string,
        userName: post.userName as string,
        createdAt: post.createdAt as string,
        updatedAt: post.updatedAt as string,
      };
    });
    return json({
      user: userResult,
      posts: postData,
    });
  } catch (error) {
    console.log(error);
  }
}

export default function MyPageIndex() {
  const { user, posts } = useLoaderData<typeof loader>();
  console.log(user);
  return (
    <div>
      <h2>マイページ</h2>
      <div>ユーザー名: {user[0].name}</div>
      <hr />
      <h3>いいねした投稿</h3>
      {/* いいねした投稿を表示する */}
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <div>{post.content}</div>
              <div>{post.userName}</div>
              <div>{post.createdAt}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
