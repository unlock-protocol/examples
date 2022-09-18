# Unlock with Next

This is an example using Unlock to tokengate application using NFTs both server and client side.

## Developing

### Configuration

To get started, you need to fill in the configuration files inside `config/` folder.

1. `unlock.ts` holds configuration for paywall checkout and networks.

Check out the schema and tutorial on the unlock docs [paywall page](https://docs.unlock-protocol.com/unlock/developers/paywall/configuring-checkout#the-paywallconfig-object)

You will need to provide network provider and the address of the unlock contract for each network you support on your locks. See the selection of networks in the [smart contracts docs page](https://docs.unlock-protocol.com/unlock/developers/smart-contracts#production-networks)

2. `session.ts` holds configuration for how session will be created and managed.

3. Set the following environment variables. You can put them all inside `.env.local` file in development. Nextjs will load them automatically.

   - `NEXT_PUBLIC_BASE_URL` - the base url of your site. For example, if your site is deployed to https://example.com/my-site, then the base url is `https://example.com`. If you are in development mode, it is set to http://localhost:3000 by default.

   - `SECRET_COOKIE_PASSWORD` - the secret password used to sign & encrypt cookies.

### Client Side Locking

You can lock content on the client side by using the `useUser` hook.

```tsx
import { NextPage } from "next";
import { useUser } from "~/hooks/useUser";

const Page: NextPage = () => {
  const { user } = useUser();

  return (
    <div>
      {user?.isLoggedIn ? `Hello, ${user.walletAddress}` : `You need to login`}
    </div>
  );
};

export default Page;
```

### Server Side Locking

#### Lock a page

To lock a page generated server side, you can use the `withIronSessionSsr` middleware in the page file to pass different server side props based on whether the user is logged in or not.

```tsx
import { withIronSessionSsr } from "iron-session/next";
import { NextPage } from "next";

interface Props {
  data: {
    values: number[],
  } | null;
}

const Page: NextPage<Props> = ({ data }) => {
  if (!data) {
    return <div> You don&apos;t have access </div>;
  }
  return (
    <div>
      data.values.map((value) => <div>{value}</div>)
    </div>
  );
};

export default Page

export const getServerSideProps =
  withIronSessionSsr <
  Props >
  ((ctx) => {
    const user = ctx.req.session.user;
    return user?.isLoggedIn
      ? {
          props: {
            data: {
              values: [1, 2, 3],
            },
          },
        }
      : {
          props: {
            data: null,
          },
        };
  },
  sessionOptions);
```

#### Lock an API endpoint

To lock an API endpoint server side, you can use the `withIronSessionApiRoute` middleware in the API file to return different responses based on whether the user is logged in or not.

```typescript
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "~/config/session";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<{ locked: boolean }>
) {
  if (req.session.user?.isLoggedIn) {
    res.json({
      locked: false,
    });
  } else {
    res.json({
      locked: true,
    });
  }
}
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/user](http://localhost:3000/api/user). This endpoint can be edited in `pages/api/user.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
