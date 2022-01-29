import { ApplyOptions } from '@sapphire/decorators';
import type { CommandInteraction, Message } from 'discord.js';
import { isInteractionInstance, isMessageInstance } from '#lib/utils';
import { BaleadaCommand, CommandParameteres } from '#lib/structure/commands/BaleadaCommand';

@ApplyOptions<BaleadaCommand.Options>({
	description: 'Check the bot latency.',
	chatInputCommand: {
		register: true,
		guildIds: ['765648185858588674'],
		idHints: ['936691124595208293']
	}
})
export class UserCommand extends BaleadaCommand {
	public override async handle(...[interaction, args]: CommandParameteres) {
		const msg = await interaction.reply({ content: 'Ping?', ephemeral: true, fetchReply: true });
		const isInteraction = isInteractionInstance(interaction);

		if (isMessageInstance(msg)) {
			const { diff, ping } = this.getPing(msg, interaction);
			const content = args.t('commands/general:pingPong', {
				diff,
				ping
			});

			return isInteraction ? interaction.editReply(content) : msg.edit(content);
		}
		const failedContent = args.t('command/general:pingFailed');

		return isInteraction ? interaction.editReply(failedContent) : interaction.edit(failedContent);
	}

	private getPing(message: Message, interaction: CommandInteraction | Message) {
		const diff = (message.editedTimestamp || message.createdTimestamp) - interaction.createdTimestamp;
		const ping = Math.round(this.container.client.ws.ping);

		return { diff, ping };
	}
}
