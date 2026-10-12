import spec from '$lib/server/openapi.json';
import { publicJson } from '$lib/server/public-api';
export const GET = () => publicJson(spec, 'application/vnd.oai.openapi+json');
