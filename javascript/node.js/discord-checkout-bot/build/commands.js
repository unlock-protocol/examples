"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const builders_1 = require("@discordjs/builders");
exports.commands = [
    new builders_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),
    new builders_1.SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock ability to send messages in discord"),
].map((command) => command.toJSON());
