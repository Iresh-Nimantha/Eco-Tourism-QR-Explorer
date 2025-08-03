import LoginForm from "@/app/admin/loginComponents/LoginForm";
import Head from "next/head";
export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Eco Tourism</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <div>
        <LoginForm />;
      </div>
    </>
  );
}
