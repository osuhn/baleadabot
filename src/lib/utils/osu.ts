import { fetch } from '@sapphire/fetch';
import { envParseString } from '@skyra/env-utilities';
import { cache_token } from 'osu-api-extended/dist/utility/auth.js';

export async function searchForAnUser(nameOrId: string): Promise<UsersFound> {
	const result = await fetch<SearchResult>(`https://osu.ppy.sh/home/quick-search?query=${nameOrId}`, {
		headers: {
			Authorization: `Bearer ${cache_token}`,
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
			'x-csrf-token': 'ztTI4lOTDo1ayUiRAAqs7Z8ZcO9F7BD21NP0rw5i',
			cookie: envParseString('OSU_COOKIE'),
			'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8'
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
