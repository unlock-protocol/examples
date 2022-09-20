"use strict";
exports.__esModule = true;
exports.config = void 0;
var baseURL = process.env.BASE_URL;
var locksmithURL = process.env.LOCKSMITH_URL || '';
exports.config = {
    id: process.env.DISCORD_WEBHOOK_ID,
    token: process.env.DISCORD_WEBHOOK_TOKEN,
    websubSecret: process.env.WEBSUB_SECRET,
    locksmithURL: locksmithURL,
    baseURL: baseURL,
    leaseSeconds: 86400 * 90
};
