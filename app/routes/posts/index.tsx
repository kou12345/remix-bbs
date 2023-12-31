import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/drizzle/config.server";
import { likes, posts, users } from "~/drizzle/schema";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";

type Post = {
  id: number;
  content: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
};

type result = {
  posts: {
    id: number;
    user_id: number;
    created_at: string | null;
    updated_at: string | null;
    content: string;
  };
  users: {
    id: number;
    name: string;
    password_hash: string;
    created_at: string | null;
    updated_at: string | null;
  } | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  try {
    const result = await db.select().from(posts).leftJoin(users, eq(posts.user_id, users.id));
    console.log("result: ", result);

    const postData: Post[] = result.map((post: result) => {
      return {
        id: post.posts.id,
        content: post.posts.content,
        userName: post.users?.name as string,
        createdAt: post.posts.created_at as string,
        updatedAt: post.posts.updated_at as string,
      };
    });
    console.log("postData: ", postData);
    return json(postData);
  } catch (error) {
    console.log(error);
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  console.log("session: ", session.data);
  const formData = await request.formData();
  const actionType = String(formData.get("actionType"));

  switch (actionType) {
    case "create":
      const content = String(formData.get("content"));
      console.log(content);

      try {
        const result = await db.insert(posts).values({
          content: content,
          user_id: session.data.user,
        });

        console.log(result);

        return json({ message: "success" });
      } catch (error) {
        console.log(error);
      }
      return null;
    case "delete":
      const postId = Number(formData.get("postId"));
      console.log(postId);

      try {
        const result = await db.delete(posts).where(eq(posts.id, postId));
        console.log(result);

        return json({ message: "success" });
      } catch (error) {
        console.log(error);
      }
      return null;
    case "like":
      const likePostId = Number(formData.get("postId"));
      console.log(likePostId);

      try {
        const result = await db.insert(likes).values({
          post_id: likePostId,
          user_id: session.data.user,
        });
        console.log(result);

        return json({ message: "success" });
      } catch (error) {
        console.log(error);
      }
      return null;

    default:
      return null;
  }
}

export default function PostsIndex() {
  const posts: Post[] = useLoaderData<typeof loader>();
  console.log("posts: ", posts);
  return (
    <div>
      <div>投稿一覧</div>
      <Form method="post">
        <input type="text" name="content" required />
        <input type="hidden" name="actionType" value="create" />
        <button type="submit">投稿</button>
      </Form>
      <hr />

      <ul>
        {posts.map((post: Post) => (
          <li key={post.id}>
            <p>{post.content}</p>
            <p>投稿者： {post.userName}</p>
            <p>投稿日時： {post.createdAt}</p>
            <div>
              {/* 削除ボタン */}
              <Form method="post">
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="actionType" value="delete" />
                <button type="submit">Delete</button>
              </Form>
              {/* いいねボタン */}
              <Form method="post">
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="actionType" value="like" />
                <button type="submit">Like</button>
              </Form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
