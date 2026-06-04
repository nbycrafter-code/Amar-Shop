
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { LoginForm } from "./components/LoginForm";

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
      <LoginForm />
      <Toaster position="top-right" richColors />
    </>
  );
};
export default LoginPage;
