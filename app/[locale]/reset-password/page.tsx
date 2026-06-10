
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

const LoginPage = async () => {
  const session = await auth();
  if (session?.user && session?.user?.role === 'admin') {
    redirect("/dashboard");
  }

  if (session?.user && session?.user?.role === 'user') {
    redirect("/my-account/dashboard");
  }

  return (
    <>
      <ResetPasswordForm />
    </>
  );
};
export default LoginPage;
