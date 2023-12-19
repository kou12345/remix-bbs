import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
}

export default function MyPageIndex() {
  return (
    <div>
      <div>マイページ</div>
    </div>
  );
}
