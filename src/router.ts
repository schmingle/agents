import { tool } from "ai";
import { generateText } from "ai";
import * as dotenv from "dotenv";
import { z } from "zod";

import { Agent } from "./agent";

dotenv.config();

class ComedyWriterAgent extends Agent {
  static agentName = "comedyWriterAgent";

  static agentTool() {
    return {
      [this.agentName]: tool({
        description: "I am a comedy writing agent. Call me if the user wants a comedy story.",
        parameters: z.object({
          length: z.number().default(100).optional().describe("The maximum length of the story in words"),
        }),
        execute: async ({ length }) => {
          console.log(">>> Routing to", this.agentName, "params:", { length });
          return "ROUTED";
        },
      }),
    }
  }

  get system() {
    return "You are an expert writer of comedy stories";
  }
}

class RomanceWriterAgent extends Agent {
  static agentName = "romanceWriterAgent";

  static agentTool() {
    return {
      [this.agentName]: tool({
        description: "I am a romance writing agent. Call me if the user wants a romance story.",
        parameters: z.object({
          length: z.number().default(100).optional().describe("The maximum length of the story in words"),
        }),
        execute: async ({ length }) => {
          console.log(">>> Routing to", this.agentName, "params:", { length });
          return "ROUTED";
        },
      }),
    }
  }

  get system() {
    return "You are an expert writer of romance stories";
  }
}

class GeneralWriterAgent extends Agent {
  static agentName = "generalWriterAgent";

  static agentTool() {
    return {
      [this.agentName]: tool({
        description: "I am a general agent. Call me if no other agent is suitable.",
        parameters: z.object({
          genre: z.string().optional().describe("The genre of the story"),
          length: z.number().default(100).optional().describe("The maximum length of the story in words"),
        }),
        execute: async ({ genre, length }) => {
          console.log(">>> Routing to", this.agentName, "params:", { genre, length });
          return "ROUTED";
        },
      }),
    }
  }

  get system() {
    return "You are an expert writer of any genre.";
  }
}

class RoutingAgent extends Agent {
  agents: Record<string, Agent>;

  constructor() {
    super();
    this.agents = {
      [ComedyWriterAgent.agentName]: new ComedyWriterAgent(),
      [RomanceWriterAgent.agentName]: new RomanceWriterAgent(),
      [GeneralWriterAgent.agentName]: new GeneralWriterAgent(),
    }
  }

  async processMessages(): Promise<string> {
    let limit = 10;
    
    while (limit > 0) {
      const message = this.messages[this.messages.length - 1];

      // Process user message
      if (message.role === "user") {
        const { messages, model, system, tools } = this;
        const result = await generateText({ messages, model, system, tools });
        this.messages.push(...result.response.messages);    
      }
      // Process tool result i.e. agent routing
      else if (message.role === "tool") {
        // Get agent
        const agentName = message.content.find((part) => part.type === "tool-result").toolName || "default";
        const agent = this.agents[agentName];
        if (!agent) throw new Error(`Routed to unknown agent ${agentName}`);

        // Hand over message stream to agent; we filter out routing messages
        const messagesFiltered = this.messages.filter((message) => message.role === "user");
        return agent.generate({ messages: messagesFiltered });
      }
      else {
        throw new Error(`Unexpected message role: ${message.role}`);
      }

      limit--;
    }

    throw new Error("Exhausted attempts to process messages");
  }

  get system() {
    return "You are a routing agent that routes messages to the correct agent. You will only respond with a tool call to the correct agent.";
  }

  get tools() {
    return {
      ...ComedyWriterAgent.agentTool(),
      ...RomanceWriterAgent.agentTool(),
      ...GeneralWriterAgent.agentTool(),
    }
  }
}

const message = process.argv[2].trim();
const agent = new RoutingAgent();
agent.generate({ message }).then(response => {
  console.log(`Message: ${message}`);
  console.log(`Response: ${response}`);
}).catch(error => {
  console.error(`Error: ${error}`);
});
