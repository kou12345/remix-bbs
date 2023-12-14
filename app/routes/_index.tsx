import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <div>
      <Form method="post">
        <input type="text" name="userName" required />
        <input type="password" name="password" autoComplete="current-password" required />
        <button>Sign In</button>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate("user-login", request, {
    successRedirect: "success",
    failureRedirect: "/",
  });
}
