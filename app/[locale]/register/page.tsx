
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { RegisterForm } from "./components/RegisterForm";

const RegisterPage = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <RegisterForm />
      <Toaster position="top-right" richColors />
    </>
  );
};
export default RegisterPage;
