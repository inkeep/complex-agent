import { customerSupport } from "./agents/customer-support.js";
import { project } from "@inkeep/agents-sdk";
import { knowledgeBaseMcpTool } from "./tools/knowledge-base-mcp.js";
import { zendeskMcpTool } from "./tools/zendesk-mcp.js";
import { stripeMcpTool } from "./tools/stripe-mcp.js";
import { hubspotMcpTool } from "./tools/hubspot-mcp.js";

export const myProject = project({
  id: "customer-support",
  name: "Customer Support",
  description: "Customer support template",
  agents: () => [customerSupport],
  tools: () => [knowledgeBaseMcpTool, zendeskMcpTool, stripeMcpTool, hubspotMcpTool],
  models: {
    'base': {
      'model': 'anthropic/claude-sonnet-4-5'
    },
    'structuredOutput': {
      'model': 'anthropic/claude-sonnet-4-5'
    },
    'summarizer': {
      'model': 'anthropic/claude-sonnet-4-5'
    }
  }
});

