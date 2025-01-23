import { env } from '$env/dynamic/private';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
  const envVarName = 'CF_PAGES';
  const useCloudflareImages = Object.hasOwn(env, envVarName) && env[envVarName] === '1';

  return {
    useCloudflareImages
  };
};
