import axios from "axios";

import type { User } from "@/database/types/User";

type Return = {
  userId: string;
  user: User | null;
};

export const recover = async ({
  email,
}: Pick<User, "email">): Promise<Return> => {
  const {
    data: { userId, user },
  } = await axios.post("/api/rest/user/get-user-by-email", {
    email,
  });

  return { userId, user };
};
