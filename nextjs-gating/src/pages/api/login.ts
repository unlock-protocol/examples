import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { Membership, User } from "~/types";
import { getValidMemberships, hasMembership } from "~/utils";
import { paywallConfig } from "~/config/unlock";
import { ethers } from "ethers";
import { baseURL } from "~/config/site";
import crypto from "crypto";
import { sessionOptions } from "~/config/session";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(request: NextApiRequest, response: NextApiResponse) {
  try {
    const signature = request.query.signature as string;
    const digest = request.query.digest as string;

    if (!signature) {
      const messageToSign = `I authorize to login: ${crypto
        .randomBytes(32)
        .toString("hex")}`;

      return redirectToPurchase(messageToSign, request, response);
    } else {
      const address = ethers.utils.verifyMessage(digest, signature);
      const memberships = await getValidMemberships(address);
      const hasAccess = !!memberships.length;

      if (!hasAccess) {
        return response
          .status(401)
          .send(
            "You do not have a valid membership. You can purchase one by reloading this page and checking out a membership this time."
          );
      }

      const user: User = {
        walletAddress: address,
        isLoggedIn: true,
        digest,
        signature,
        memberships,
      };

      request.session.user = user;
      await request.session.save();
      response.redirect(baseURL);
    }
  } catch (error) {
    response.status(500).json({ message: (error as Error).message });
  }
}

function redirectToPurchase(
  digest: string,
  request: NextApiRequest,
  response: NextApiResponse
) {
  const redirectBack = new URL(request.url!, baseURL);
  redirectBack.searchParams.append("digest", digest);
  const redirectUrl = new URL("https://app.unlock-protocol.com/checkout");
  paywallConfig.messageToSign = digest;
  redirectUrl.searchParams.append(
    "paywallConfig",
    JSON.stringify(paywallConfig)
  );
  redirectUrl.searchParams.append("redirectUri", redirectBack.toString());
  response.redirect(redirectUrl.toString());
}
