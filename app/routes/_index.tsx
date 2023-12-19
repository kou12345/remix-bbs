import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/drizzle/config.server";
import { users } from "~/drizzle/schema";
import { authenticator } from "~/services/auth.server";
import { getSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  return json({ session });
}

export default function Index() {
  // sessionを取得する
  const session = useLoaderData<typeof loader>();
  console.log(session.session.data.user);

  return (
    <div>
      <Form method="post">
        <input type="text" name="userName" required />
        <input type="password" name="password" autoComplete="current-password" required />
        <button>Sign In</button>
      </Form>
      <a href="/signup">Sign Up</a>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const result = await db.select().from(users);
  console.log(result);
  return await authenticator.authenticate("user-login", request, {
    successRedirect: "posts",
    failureRedirect: "/",
  });
}
