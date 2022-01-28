import { BaleadaCommand } from '#lib/structure/commands/BaleadaCommand';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<BaleadaCommand.Options>({
	aliases: ['o'],
	detailedDescription: 'commands/osu:osuExtended.extendedHelp'
})
export class OsuCommand extends BaleadaCommand {
	public override messageRun(message: Message, args: Args) {
		return message.reply(args.t('commands/osu:osuUserNotFound'));
	}
}
