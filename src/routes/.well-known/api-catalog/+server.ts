import { apiCatalog } from '$lib/server/discovery';
import { publicJson } from '$lib/server/public-api';
export const GET = () => publicJson(apiCatalog, 'application/linkset+json');
