import { mcpTool } from "@inkeep/agents-sdk";

export const hubspotMcpTool = mcpTool({
  id: 'hubspot-mcp',
  name: 'HubSpot',
  serverUrl: 'https://hubspot-mcp.vercel.app/mcp',
});

