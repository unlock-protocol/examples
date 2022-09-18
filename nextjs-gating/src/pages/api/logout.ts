import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import type { User } from "~/types";
import { sessionOptions } from "~/config/session";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json({
    isLoggedIn: false,
    walletAddress: "",
    digest: "",
    signature: "",
    memberships: [],
  });
}
