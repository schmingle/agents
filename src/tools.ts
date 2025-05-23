import { tool } from "ai";
import dedent from "dedent";
import * as dotenv from "dotenv";
import { z } from "zod";

import { Agent } from "./agent";

dotenv.config();

class ToolCallingAgent extends Agent {
  get tools() {
    return {
      getNews: tool({
        description: "Get the news in a given location",
        parameters: z.object({
          location: z.string().describe("The location to get the news for"),
        }),
        execute: async ({ location }) => {
          console.log(">>> Called tool getNews");
          return dedent`
            Here is the latest local news in ${location}:
            - Mayor Johnson announced he is running for re-election.
            - ${location} Zoo is having a new exhibit opening this weekend.
            - Tourism is at an all-time high in ${location}.
          `;
        }
      }),
      getWeather: tool({
        description: "Get the weather in a given location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          console.log(">>> Called tool getWeather");
          return `The weather in ${location} is sunny with clear skies`;
        }
      }),
    }
  }
}

const message = process.argv[2].trim();
const agent = new ToolCallingAgent();
agent.generate({ message }).then(response => {
  console.log(`Message: ${message}`);
  console.log(`Response: ${response}`);
}).catch(error => {
  console.error(`Error: ${error}`);
});
