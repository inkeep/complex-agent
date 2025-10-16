import { z } from "zod";
import {
  subAgent,
  agent,
  agentMcp,
  dataComponent,
  functionTool,
} from "@inkeep/agents-sdk";
import { contextConfig, fetchDefinition, headers } from "@inkeep/agents-core";
import { weatherMcpTool } from "../tools/weather-mcp.ts";
import { artifactComponent } from "@inkeep/agents-sdk";
import { preview } from "@inkeep/agents-core";

const calculateBMI = functionTool({
  name: "calculate-bmi",
  description: "Calculate BMI and health category",
  inputSchema: {
    type: "object",
    properties: {
      weight: { type: "number", description: "Weight in kilograms" },
      height: { type: "number", description: "Height in meters" },
    },
    required: ["weight", "height"],
  },
  execute: async ({ weight, height }) => {
    const bmi = weight / (height * height);
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 30) category = "Obese";

    return { bmi: Math.round(bmi * 10) / 10, category };
  },
});

export const citation = artifactComponent({
  id: "citation",
  name: "Citation",
  description: "Structured factual information extracted from search results",
  props: z.object({
    title: preview(z.string().describe("Title of the source document")),
    url: preview(z.string().describe("URL of the source document")),
    record_type: preview(
      z.string().describe("Type of record (documentation, blog, guide, etc.)")
    ),
    content: z
      .array(
        z.object({
          type: z
            .string()
            .describe("Type of content (text, image, video, etc.)"),
          text: z.string().describe("The actual text content"),
        })
      )
      .describe(
        "Array of structured content blocks extracted from the document"
      ),
  }),
});

export const taskList = dataComponent({
  id: "task-list",
  name: "TaskList",
  description: "Display user tasks with status",
  props: z.object({
    tasks: z
      .array(
        z.object({
          id: z.string().describe("Unique task identifier"),
          title: z.string().describe("Task title"),
          completed: z.boolean().describe("Whether the task is completed"),
          priority: z.enum(["low", "medium", "high"]).describe("Task priority"),
        })
      )
      .describe("Array of user tasks"),
    totalCount: z.number().describe("Total number of tasks"),
    completedCount: z.number().describe("Number of completed tasks"),
  }),
});

// 1. Define a schema for headers validation. All header keys are converted to lowercase.
// In this example all incoming headers will be validated to make sure they include user_id and api_key.
const personalAgentHeaders = headers({
  schema: z.object({
    user_id: z.string(),
    api_key: z.string(),
  }),
});

// 2. Create the fetcher with
const userFetcher = fetchDefinition({
  id: "user-info",
  name: "User Information",
  trigger: "initialization", // Fetch only once when a conversation is started with the Agent. When set to "invocation", the fetch will be executed every time a request is made to the Agent.
  fetchConfig: {
    url: `https://api.example.com/users/${personalAgentHeaders.toTemplate(
      "user_id"
    )}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${personalAgentHeaders.toTemplate("api_key")}`,
    },
    transform: "user", // Extract user from response, for example if the response is { "user": { "name": "John Doe", "email": "john.doe@example.com" } }, the transform will return the user object
  },
  responseSchema: z.object({
    name: z.string(),
    email: z.string(),
  }), // Used to validate the result of the transformed api response.
  defaultValue: "Unable to fetch user information",
});

// 3. Configure context
const personalAgentContext = contextConfig({
  headers: personalAgentHeaders,
  contextVariables: {
    user: userFetcher,
  },
});

// 4. Create and use the Sub Agent
const personalAssistant = subAgent({
  id: "personal-assistant",
  name: "Personal Assistant",
  description: "A personalized AI assistant",
  prompt: `Hello ${personalAgentContext.toTemplate(
    "user.name"
  )}! I'm your personal assistant.`,
  canUse: () => [
    calculateBMI,
    agentMcp({
      server: weatherMcpTool,
      selectedTools: ["get_weather_forecast"],
    }),
  ],
  canDelegateTo: () => [coordinatesAgent],
  dataComponents: () => [taskList],
  artifactComponents: () => [citation],
});

const coordinatesAgent = subAgent({
  id: "coordinates-agent",
  name: "Coordinates Agent",
  description: "A agent that gets the coordinates of a given location",
  prompt:
    "You are a helpful assistant that gets the coordinates of a given location",
  canUse: () => [
    agentMcp({
      server: weatherMcpTool,
      selectedTools: ["get_coordinates"],
    }),
  ],
});

// Initialize the Agent
export const complexAgent = agent({
  id: "personal-agent",
  name: "Personal Assistant Agent",
  defaultSubAgent: personalAssistant,
  subAgents: () => [personalAssistant, coordinatesAgent],
  contextConfig: personalAgentContext,
});
