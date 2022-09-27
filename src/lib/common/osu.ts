import type { OsuCommand } from '#lib/structures/OsuCommand';
import { Canvas, loadImage } from 'canvas-constructor/skia';
import { v2 } from 'osu-api-extended';

export async function generateUserCard(userId: string, mode: OsuCommand.OsuModes): Promise<Buffer> {
	const canvas = new Canvas(1200, 624);
	const user = await v2.user.get(userId, mode);

	// TODO: Add more stuff here
	const [backgroundImage, avatarImage, _modeImage, _countryImage] = await Promise.all([
		loadImage('assets/backgrounds/defaultBackground.png'),
		loadImage(user.avatar_url),
		loadImage(`assets/modes/${mode}.png`),
		loadImage(getFlag(user.country_code))
	]);

	canvas //
		.createRoundedClip(0, 0, canvas.width, canvas.height, 45)
		.setColor('#5865f2')
		.setShadowColor('rgba(0,0,0,0.5)')
		.setShadowBlur(40)
		.fill();

	canvas //
		.printRoundedImage(backgroundImage, 0, 0, canvas.width, canvas.height + 71, 45)
		.setShadowBlur(0);

	const avatarScale = Math.max(200 / avatarImage.width, 280 / avatarImage.height);
	canvas //
		.printRoundedImage(
			avatarImage,
			170 + 14 - (avatarImage.width / 2) * avatarScale,
			170 + 25 - (avatarImage.height / 2) * avatarScale,
			avatarImage.width * avatarScale,
			avatarImage.height * avatarScale,
			47
		);

	return canvas.png();
}

export function getFlag(flag: string): string {
	return `https://raw.githubusercontent.com/ppy/osu-resources/master/osu.Game.Resources/Textures/Flags/${flag}.png`;
}
