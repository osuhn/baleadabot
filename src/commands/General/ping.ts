import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, type ChatInputCommand } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { isMessageInstance } from '#lib/utils';

@ApplyOptions<CommandOptions>({
	description: 'Check the bot latency.',
	chatInputCommand: {
		register: true,
		guildIds: ['659796438896607262', '765648185858588674', '858410190414938143'],
		idHints: ['932433683703541801']
	}
})
export class UserCommand extends Command {
	public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		const msg = await interaction.reply({ content: ' Ping?', ephemeral: true, fetchReply: true });

		// console.log(await Promise.all(this.container.client.application!.commands.cache.map((w) => w.delete())));

		if (isMessageInstance(msg)) {
			const { diff, ping } = this.getPing(msg, interaction);

			return interaction.editReply(`Pong 🏓! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
		}

		return interaction.editReply('Failed to retrieve ping :(');
	}

	private getPing(message: Message, interaction: CommandInteraction) {
		const diff = (message.editedTimestamp || message.createdTimestamp) - interaction.createdTimestamp;
		const ping = Math.round(this.container.client.ws.ping);

		return { diff, ping };
	}
}
