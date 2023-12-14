import { Outlet } from "@remix-run/react";

export const SuccessRoute = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
