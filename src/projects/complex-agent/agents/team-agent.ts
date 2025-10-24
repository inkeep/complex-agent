import { agent, subAgent } from "@inkeep/agents-sdk";

export const teamAgentSubAgent = subAgent({
  id: "team-agent-sub-agent",
  name: "Team Agent",
  description: "A helpful assistant that can use the external agent",
  prompt: "You are a helpful assistant that can use the external agent",
});


export const teamAgent = agent({
    id: "team-agent",
    name: "Team Agent",
    defaultSubAgent: teamAgentSubAgent,
    subAgents: () => [teamAgentSubAgent],
  });