
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

const LoginPage = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <ResetPasswordForm />
    </>
  );
};
export default LoginPage;
