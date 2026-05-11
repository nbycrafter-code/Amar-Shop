
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
import { SimpleLoginForm } from "./_components/LoginForm";

const LoginPage = async () => {
  // const session = await auth();
  // if (session?.user) {
  //   redirect("/dashboard");
  // }

  return (
    <>
      <SimpleLoginForm />
    </>
  );
};
export default LoginPage;
