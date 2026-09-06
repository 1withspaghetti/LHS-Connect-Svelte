import type { IListValue } from '$lib/types/basicTypes';

/**
 * Represents a club on the club page.
 */
export interface IClub extends IListValue {
	name: string;
	dayAndTime: string;
	location: string;
	advisor: string;
	instagram?: string; // No '@' symbol, just the username
	desc?: string;
}

/**
 * Represents the data for the club page, with a list of clubs below it, whats returned by the API.
 */
export interface ClubListData {
	clubs: IClub[];
}
