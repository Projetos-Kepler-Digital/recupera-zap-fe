import type { GetServerSidePropsContext } from "next";

import { parseCookies } from "nookies";

export const cookieExists = (
  name: string,
  context?: GetServerSidePropsContext
) => {
  const cookies = parseCookies(context);

  return cookies[name] !== undefined;
};
