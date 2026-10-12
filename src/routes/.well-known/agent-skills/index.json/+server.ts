import { agentSkills } from '$lib/server/discovery';
import { publicJson } from '$lib/server/public-api';
export const GET = async () => publicJson(await agentSkills());
