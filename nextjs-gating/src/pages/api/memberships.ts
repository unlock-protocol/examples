import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { MembershipMetadata } from "~/types";
import { sessionOptions } from "~/config/session";
import { fetchJson } from "~/utils";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<{
    memberships: MembershipMetadata[];
  }>
) {
  if (req.session.user) {
    const memberships = await Promise.all(
      req.session.user.memberships!.map(
        async ({ network, id, lockAddress }) => {
          const metadata: Object = await fetchJson(
            `https://locksmith.unlock-protocol.com/api/key/${network}/${lockAddress}/${id}`
          );

          return {
            id,
            network,
            lockAddress,
            ...metadata,
          } as MembershipMetadata;
        }
      )
    );
    res.json({
      memberships,
    });
  } else {
    res.json({
      memberships: [],
    });
  }
}
