
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";

const ForgotPasswordPage = async () => {
  const session = await auth();
  if (session?.user && session?.user?.role === 'admin') {
    redirect("/dashboard");
  }

  if (session?.user && session?.user?.role === 'user') {
    redirect("/my-account/dashboard");
  }

  return (
    <>
      <ForgotPasswordForm />
    </>
  );
};
export default ForgotPasswordPage;
