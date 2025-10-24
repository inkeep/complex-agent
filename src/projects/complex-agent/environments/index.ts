import { createEnvironmentSettings } from '@inkeep/agents-sdk';
import { development } from './development.env';
import { production } from './production.env';

export const envSettings = createEnvironmentSettings({
  development,
  production,
});