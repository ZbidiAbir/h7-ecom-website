"use client";
import Footer from "./Footer";
import { useSession } from "next-auth/react";

const FooterWrapper = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div>
      <Footer isAdmin={isAdmin} />
    </div>
  );
};
export default FooterWrapper;
