import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/drizzle/config.server";
import { users } from "~/drizzle/schema";
import { authenticator } from "~/services/auth.server";

export default function Index() {
  return (
    <div>
      <div>Sign Up</div>

      <Form method="post">
        <input type="text" name="userName" required />
        <input type="password" name="password" autoComplete="current-password" required />
        <button>Sign Up</button>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const result = await db.select().from(users);
  console.log(result);
  return await authenticator.authenticate("user-signup", request, {
    successRedirect: "success",
    failureRedirect: "/",
  });
}
