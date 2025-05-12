import { tool } from "ai";
import * as dotenv from "dotenv";
import { z } from "zod";

import { ToolCallingAgent } from "./agent";

dotenv.config();

class MyToolCallingAgent extends ToolCallingAgent {
  get tools() {
    return {
      getCurrentTime: tool({
        description: "Get the current time in a given location",
        parameters: z.object({
          location: z.string(),
        }),
        execute: async () => {
          return `The current time is ${new Date().toLocaleTimeString()}`;
        }
      }),
      getWeather: tool({
        description: "Get the weather in a given location",
        parameters: z.object({
          location: z.string(),
        }),
        execute: async ({ location }) => {
          return `The weather in ${location} is sunny with clear skies`;
        }
      }),
    }
  }
}

const prompt = process.argv[2].trim();
console.log(`Prompt: ${prompt}`);

const agent = new MyToolCallingAgent();
agent.generate(prompt).then(response => {
  console.log(`Response: ${response}`);
}).catch(error => {
  console.error(`Error: ${error}`);
});
