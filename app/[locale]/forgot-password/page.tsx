
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";

const ForgotPasswordPage = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <ForgotPasswordForm />
    </>
  );
};
export default ForgotPasswordPage;
