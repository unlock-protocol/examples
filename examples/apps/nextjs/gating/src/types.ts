export interface User {
  walletAddress: string;
  digest?: string;
  signature?: string;
  isLoggedIn: boolean;
  memberships?: Membership[];
}

export interface Attribute {
  trait_type: string;
  value: string | number;
  display_type: string;
}
export interface Membership {
  id: number;
  network: number;
  lockAddress: string;
}

export interface MembershipMetadata {
  id: number;
  name: string;
  description: string;
  image: string;
  network: number;
  owner: string;
  lockAddress: string;
  attributes: Attribute[];
  expiration: number;
}

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
