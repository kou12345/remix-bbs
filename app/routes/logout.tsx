import { Outlet } from "@remix-run/react";

export const LogoutRoute = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
