import { SlashCommandBuilder } from "@discordjs/builders";

export const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock ability to send messages in discord"),
].map((command) => command.toJSON());
