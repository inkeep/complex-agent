import { mcpTool } from "@inkeep/agents-sdk";

export const stripeMcpTool = mcpTool({
  id: 'stripe-mcp',
  name: 'Stripe',
  serverUrl: 'https://stripe-mcp-hazel.vercel.app/mcp',
});

