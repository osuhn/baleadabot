import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, ChatInputCommand, Command } from '@sapphire/framework';
import { Type } from '@sapphire/type';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { inspect } from 'util';

@ApplyOptions<Command.Options>({
	description: 'Evals any JavaScript code',
	preconditions: ['OwnerOnly']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('code').setDescription('The code to eval').setRequired(true))
					.addBooleanOption((option) => option.setName('async').setDescription('Whether the code should be executed asynchronously'))
					.addBooleanOption((option) => option.setName('hidden').setDescription('Whether to show hidden properties'))
					.addBooleanOption((option) => option.setName('silent').setDescription('Whether to suppress output'))
					.addIntegerOption((option) => option.setName('depth').setDescription('The maximum depth of the result')),
			{
				guildIds: ['765648185858588674'],
				idHints: ['936691124129661008']
			}
		);
	}

	public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		const code = interaction.options.getString('code', true);
		const { result, success, type } = await this.eval(interaction, code, {
			async: interaction.options.getBoolean('async', false) ?? false,
			depth: interaction.options.getNumber('depth', false) ?? 0,
			showHidden: interaction.options.getBoolean('hidden', false) ?? false
		});

		const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;

		const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

		if (output.length > 2000) {
			return interaction.reply({
				content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
				files: [{ attachment: Buffer.from(output), name: 'output.js' }],
				ephemeral: true
			});
		}

		return interaction.reply({ content: `${output}\n${typeFooter}`, ephemeral: interaction.options.getBoolean('silent', false) ?? false });
	}

	private async eval(
		interaction: Parameters<ChatInputCommand['chatInputRun']>[0],
		code: string,
		flags: { async: boolean; depth: number; showHidden: boolean }
	) {
		if (flags.async) code = `(async () => {\n${code}\n})();`;

		// @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const msg = interaction;

		let success = true;
		let result = null;

		try {
			// eslint-disable-next-line no-eval
			result = eval(code);
		} catch (error) {
			if (error && error instanceof Error && error.stack) {
				this.container.client.logger.error(error);
			}
			result = error;
			success = false;
		}

		const type = new Type(result).toString();
		if (isThenable(result)) result = await result;

		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flags.depth,
				showHidden: flags.showHidden
			});
		}

		return { result, success, type };
	}
}
