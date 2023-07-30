import { useState } from "react";

import { parseCookies, setCookie, destroyCookie } from "nookies";
import { cookieExists } from "@/lib/cookieExists";

export const useCookies = () => {
  const [cookies, setCookies] = useState(parseCookies());

  const createCookie = (name: string, value: string, options: any = {}) => {
    setCookie(null, name, value, {
      path: "/",
      ...options,
    });
    setCookies({ ...cookies, [name]: value });
  };

  const readCookie = (name: string) => {
    return cookies[name] || null;
  };

  const deleteCookie = (name: string) => {
    destroyCookie(null, name);
    const { [name]: deletedCookie, ...remainingCookies } = cookies;
    setCookies(remainingCookies);
  };

  return {
    createCookie,
    readCookie,
    deleteCookie,
    cookieExists,
  };
};
