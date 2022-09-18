import { DataTypes, Sequelize, ModelDefined, Model } from "sequelize";
import { config } from "./config";

export const sequelize = new Sequelize(
  config.databaseURL!,
  process.env.ON_HEROKU
    ? {
        ssl: true,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {}
);

export interface User {
  id: string;
  walletAddresses: string[];
}

export const User = sequelize.define<Model<User>>("Users", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  walletAddresses: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
});

export interface Nounce {
  id: string;
  userId?: string;
}

export const Nounce = sequelize.define<Model<Nounce>>("Nounce", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export async function appendWalletAddress(
  userId: string,
  walletAddress: string
) {
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return User.create({
      id: userId,
      walletAddresses: [walletAddress],
    });
  }
  return user.update(
    {
      walletAddresses: [
        ...new Set([...user.toJSON().walletAddresses, walletAddress]),
      ],
    },
    {
      where: {
        id: userId,
      },
    }
  );
}
