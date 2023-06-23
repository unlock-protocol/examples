"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendWalletAddress = exports.Nounce = exports.User = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
exports.sequelize = new sequelize_1.Sequelize(config_1.config.databaseURL, process.env.ON_HEROKU
    ? {
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
    : {});
exports.User = exports.sequelize.define("Users", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    walletAddresses: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
    },
});
exports.Nounce = exports.sequelize.define("Nounce", {
    id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
});
async function appendWalletAddress(userId, walletAddress) {
    const user = await exports.User.findOne({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return exports.User.create({
            id: userId,
            walletAddresses: [walletAddress],
        });
    }
    return user.update({
        walletAddresses: [
            ...new Set([...user.toJSON().walletAddresses, walletAddress]),
        ],
    }, {
        where: {
            id: userId,
        },
    });
}
exports.appendWalletAddress = appendWalletAddress;
