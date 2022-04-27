export interface OsuUser {
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
	profile_colour: null;
	username: string;
	cover_url: string;
	discord: string;
	has_supported: boolean;
	interests: null;
	join_date: Date;
	kudosu: Kudosu;
	location: string;
	max_blocks: number;
	max_friends: number;
	occupation: null;
	playmode: string;
	playstyle: string[];
	post_count: number;
	profile_order: string[];
	title: null;
	title_url: null;
	twitter: string;
	website: string;
	country: Country;
	cover: Cover;
	account_history: any[];
	active_tournament_banner: null;
	badges: any[];
	beatmap_playcounts_count: number;
	comments_count: number;
	favourite_beatmapset_count: number;
	follower_count: number;
	graveyard_beatmapset_count: number;
	groups: any[];
	guest_beatmapset_count: number;
	loved_beatmapset_count: number;
	mapping_follower_count: number;
	monthly_playcounts: Count[];
	page: Page;
	pending_beatmapset_count: number;
	previous_usernames: any[];
	ranked_beatmapset_count: number;
	replays_watched_counts: Count[];
	scores_best_count: number;
	scores_first_count: number;
	scores_pinned_count: number;
	scores_recent_count: number;
	statistics: Statistics;
	support_level: number;
	user_achievements: UserAchievement[];
	rankHistory: RankHistory;
	rank_history: RankHistory;
	ranked_and_approved_beatmapset_count: number;
	unranked_beatmapset_count: number;
}

export interface Country {
	code: string;
	name: string;
}

export interface Cover {
	custom_url: string;
	url: string;
	id: null;
}

export interface Kudosu {
	total: number;
	available: number;
}

export interface Count {
	start_date: Date;
	count: number;
}

export interface Page {
	html: string;
	raw: string;
}

export interface RankHistory {
	mode: string;
	data: number[];
}

export interface Statistics {
	level: Level;
	global_rank: number;
	pp: number;
	ranked_score: number;
	hit_accuracy: number;
	play_count: number;
	play_time: number;
	total_score: number;
	total_hits: number;
	maximum_combo: number;
	replays_watched_by_others: number;
	is_ranked: boolean;
	grade_counts: GradeCounts;
	country_rank: number;
	rank: Rank;
}

export interface GradeCounts {
	ss: number;
	ssh: number;
	s: number;
	sh: number;
	a: number;
}

export interface Level {
	current: number;
	progress: number;
}

export interface Rank {
	country: number;
}

export interface UserAchievement {
	achieved_at: Date;
	achievement_id: number;
}
