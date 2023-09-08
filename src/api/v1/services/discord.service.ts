import { Client, GatewayIntentBits, Events } from 'discord.js';

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.on(Events.ClientReady, () => {
	console.log(`Discord bot: [READY]`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

export default client;
