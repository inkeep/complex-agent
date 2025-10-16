import { complexAgent } from "./agents/complex-agent.ts";
import { project } from "@inkeep/agents-sdk";

export const myProject = project({
  id: "complex-example",
  name: "Complex Example",
  description: "Complex example project",
  agents: () => [complexAgent],
  models: {
    base: {
      model: "anthropic/claude-sonnet-4-20250514",
    },
    structuredOutput: {
      model: "anthropic/claude-sonnet-4-20250514",
    },
    summarizer: {
      model: "anthropic/claude-sonnet-4-20250514",
    },
  },
});
