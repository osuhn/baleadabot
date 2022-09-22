import { fetch } from '@sapphire/fetch';
import { envParseString } from '@skyra/env-utilities';
import { cache_token } from 'osu-api-extended/dist/utility/auth.js';

/**
 * It searches for an user by name or id and returns the user's information
 * @param {string} nameOrId - The name or id of the user you want to search for
 * @returns An array of users
 */
export async function searchForAnUser(nameOrId: string): Promise<UsersFound> {
	const result = await fetch<SearchResult>(`https://osu.ppy.sh/home/quick-search?query=${nameOrId}`, {
		headers: {
			Authorization: `Bearer ${cache_token}`,
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
			'x-csrf-token': 'ztTI4lOTDo1ayUiRAAqs7Z8ZcO9F7BD21NP0rw5i',
			cookie: envParseString('OSU_COOKIE'),
			'accept-language': 'en-GB,en;q=0.8'
		}
	});
	if (!result.user) throw new Error('Not found');

	return result.user;
}

interface User {
	avatar_url: string;
	country_code: string;
	default_group: string;
	id: number;
	is_active: boolean;
	is_bot: boolean;
	is_deleted: boolean;
	is_online: boolean;
	is_supporter: boolean;
	last_visit: Date;
	pm_friends_only: boolean;
	profile_colour: null | string;
	username: string;
	country: {
		code: string;
		name: string;
	};
	cover: {
		custom_url: string;
		url: string;
		id: null | number | string;
	};
	group: any[];
	support_level: number;
}
interface UsersFound {
	total: number;
	users: User[];
}

interface SearchResult {
	beatmaps: unknown;
	forum_posts: unknown;
	user: UsersFound;
	wiki_page: unknown;
}
