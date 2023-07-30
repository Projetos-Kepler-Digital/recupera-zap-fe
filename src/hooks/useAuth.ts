import { useContext } from "react";

import { AuthContext, AuthContextModel } from "@/auth/AuthProvider";

export const useAuth = (): AuthContextModel => {
  return useContext(AuthContext);
};
