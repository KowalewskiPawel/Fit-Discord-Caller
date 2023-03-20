import { Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from "dotenv";

dotenv.config();

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const token = process.env.DISCORD_TOKEN;
const discordChannel = process.env.DISCORD_CHANNEL as string;

client.once(Events.ClientReady, current => {
	console.log(`Ready! Logged in as ${current.user.tag}`);
});

export const sendDiscordMessage = async (activity: number, steps: number) => {
    try {
    const channel = await client.channels.fetch(discordChannel);
    
    /* @ts-ignore */
    await channel?.send(`Gratulacje Paweł! Twój wynik dzisiaj to ${activity} aktywnych minut, ${steps} kroków.`);
    } catch(err) {
        console.error(err);
    }
};