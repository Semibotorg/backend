/* eslint-disable unicorn/filename-case */
import { checkIfUserHasAdministrator } from '../api/v1/DiscordAPI/checkIfUserHasAdministrator';

export async function checkUserPermission(guild_id, discord_user_id) {
	const memberPermission = await checkIfUserHasAdministrator(guild_id, discord_user_id);
	return memberPermission;
}
