import { tool } from "ai";
import dedent from "dedent";
import * as dotenv from "dotenv";
import { z } from "zod";

import { Agent } from "./agent";

dotenv.config();

class MyToolCallingAgent extends Agent {
  get tools() {
    return {
      getNews: tool({
        description: "Get the news in a given location",
        parameters: z.object({
          location: z.string(),
        }),
        execute: async ({ location }) => {
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
          location: z.string(),
        }),
        execute: async ({ location }) => {
          return `The weather in ${location} is sunny with clear skies`;
        }
      }),
    }
  }
}

const message = process.argv[2].trim();
console.log(`Message: ${message}`);

const agent = new MyToolCallingAgent();
agent.generate({ message }).then(response => {
  console.log(`Response: ${response}`);
}).catch(error => {
  console.error(`Error: ${error}`);
});
