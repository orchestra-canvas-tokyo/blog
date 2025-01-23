import { env } from '$env/dynamic/private';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
  const envVarName = 'CF_PAGES_BRANCH';
  const useCloudflareImages = Object.hasOwn(env, envVarName) && env[envVarName] === 'production';

  return {
    useCloudflareImages
  };
};
