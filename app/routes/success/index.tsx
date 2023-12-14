import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
}

export default function SuccessIndex() {
  return (
    <div>
      <div>ログインに成功しました</div>
      <div>
        <form action="/logout" method="post">
          <button type="submit">Sign Out</button>
        </form>
      </div>
    </div>
  );
}
