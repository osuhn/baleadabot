import { BaleadaCommand, CommandParameteres } from '#lib/structure/commands/BaleadaCommand';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<BaleadaCommand.Options>({
	aliases: ['o'],
	detailedDescription: 'commands/osu:osuExtended.extendedHelp'
})
export class OsuCommand extends BaleadaCommand {
	public override handle(...[message, args]: CommandParameteres) {
		return message.reply(args.t('commands/osu:osuUserNotFound'));
	}
}
