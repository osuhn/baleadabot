import { CommandInteraction, Message } from 'discord.js';
import type { APIMessage } from 'discord-api-types';

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function isMessageInstance(message: APIMessage | CommandInteraction | Message): message is Message<true> {
	return message instanceof Message;
}
