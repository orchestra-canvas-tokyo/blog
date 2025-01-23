import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
  const envVarName = 'CF_PAGES_BRANCH';
  const useCloudflareImages = Object.hasOwn(env, envVarName) && env[envVarName] === 'production';

  return {
    useCloudflareImages
  };
};
