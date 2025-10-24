import { mcpTool } from "@inkeep/agents-sdk";
import { envSettings } from "../environments";

export const stripeMcpTool = mcpTool({
  id: 'stripe-mcp',
  name: 'Stripe',
  serverUrl: 'https://stripe-mcp-hazel.vercel.app/mcp',
  credential: envSettings.getEnvironmentSetting('stripe_api_key'),
});