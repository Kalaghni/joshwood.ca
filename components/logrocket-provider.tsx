"use client";

import { useEffect } from "react";
import LogRocket from "logrocket";
import type {AdminUser} from "@/lib/auth";
import useCurrentUser from "@/hooks/use-current-user";

const LOGROCKET_APP_ID = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!;

export default () => {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
      LogRocket.init(LOGROCKET_APP_ID);
    }
  }, []);

  return null;
}

export function LogRocketIdentify() {

  const {user} = useCurrentUser();

  async function identify() {

    if (!user) return;

    LogRocket.identify(user._id, {
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  useEffect(() => {
    void identify();
  }, [user]);

  return (
      <></>
  )
}
