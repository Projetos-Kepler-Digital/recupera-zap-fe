import type { GetServerSideProps } from "next";

import Head from "next/head";

import { cookieExists } from "@/lib/cookieExists";
import { Profile } from "@/app/dashboard/profile";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userCookie = cookieExists("user.token", context);

  if (!userCookie) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>RecuperaZap | Meu Perfil</title>

        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Profile />
    </>
  );
}
