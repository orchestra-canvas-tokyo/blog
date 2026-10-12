import { getPostCount } from '$lib/posts';
import { publicJson } from '$lib/server/public-api';

export const GET = () => publicJson({ status: 'ok', publishedPosts: getPostCount() });
