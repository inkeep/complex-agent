import { registerEnvironmentSettings } from '@inkeep/agents-sdk';
import { CredentialStoreType } from '@inkeep/agents-core';

// How credentials are referenced depends on how the credential was created, in this case this credential was created as an environment variable
export const production = registerEnvironmentSettings({
  credentials: {
    'stripe_api_key': {
      id: 'stripe-api-key',
      name: 'Stripe API Key',
      type: CredentialStoreType.memory,
      credentialStoreId: 'memory-default',
      retrievalParams: {
        key: 'STRIPE_API_KEY_PROD',
      },
    }
  },
});