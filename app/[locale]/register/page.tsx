
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { RegisterForm } from "./components/RegisterForm";

const RegisterPage = async () => {
  const session = await auth();
  if (session?.user && session?.user?.role === 'admin') {
    redirect("/dashboard");
  }

  if (session?.user && session?.user?.role === 'user') {
    redirect("/my-account/dashboard");
  }

  return (
    <>
      <RegisterForm />
      <Toaster position="top-right" richColors />
    </>
  );
};
export default RegisterPage;
