import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  // You can rotate password here for improved security using an object with index as keys
  password: process.env.SECRET_COOKIE_PASSWORD?.toString()!,
  cookieName: "unlock-next",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
