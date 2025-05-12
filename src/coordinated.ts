import { tool } from "ai";
import dedent from "dedent";
import * as dotenv from "dotenv";
import { z } from "zod";

import { Agent } from "./agent";

dotenv.config();

class CoreIntentAgent extends Agent {
  static agentName = "coreIntentAgent";

  static agentTool() {
    return {
      [this.agentName]: tool({
        description: "I am an agent that can analyze a user's query and determine the core intent.",
        parameters: z.object({
          query: z.string().describe("The user's original query"),
        }),
        execute: async ({ query }) => {
          console.log(`>>> ${this.agentName}: Query: ${query}`);
          const message = dedent`
            Rephrase the following user query to represent the absolute core question or underlying intent. Be concise and clear. Output only the rephrased question. The user query:
            
            ${query}
          `;
          const agent = new this();
          const response = await agent.generate({ message });
          console.log(`>>> ${this.agentName} Response: ${response}`);
          return response;
        },
      }),
    }
  }

  get system() {
    return "You are an expert at determining the core intent of a user's query.";
  }
}

class IdealAnswerAgent extends Agent {
  static agentName = "idealAnswerAgent";

  static agentTool() {
    return {
      [this.agentName]: tool({
        description: "I am an agent that can analyze a user's query and core intent to determine what the ideal answer would look like.",
        parameters: z.object({
          query: z.string().describe("The user's original query"),
          intent: z.string().describe("The core intent of the user's query"),
        }),
        execute: async ({ query, intent }) => {
          console.log(`>>> ${this.agentName}: Query: ${query}`);
          console.log(`>>> ${this.agentName}: Intent: ${intent}`);
          const message = dedent`
            Based on the following user query and its core intent, describe the key characteristics of a comprehensive and high-quality answer.

            Consider aspects like:
            - Topics to cover
            - Desired format (e.g., list, paragraph, step-by-step)
            - Depth of explanation
            - Actionability or practicality
            - Any specific constraints or goals implied by the question.

            Output only the description of these characteristics.

            [User query]
            ${query}

            [Core intent]
            ${intent}
          `;
          const agent = new this();
          const response = await agent.generate({ message });
          console.log(`>>> ${this.agentName} Response: ${response}`);
          return response;
        },
      }),
    }
  }

  get system() {
    return "You are an expert at determining the core intent of a user's query.";
  }
}

class AnswerEvaluatorAgent extends Agent {
  static agentName = "answerEvaluatorAgent";

  static agentTool() {
    return {
      [this.agentName]: tool({
        description: "I am an agent that can analyze several answers to a user's query and its core intent to determine the best answer.",
        parameters: z.object({
          query: z.string().describe("The user's original query"),
          intent: z.string().describe("The core intent of the user's query"),
          answers: z.array(z.string()).describe("The set of candidate answers to the user's query and its core intent"),
        }),
        execute: async ({ query, intent, answers }) => {
          console.log(`>>> ${this.agentName}: Query: ${query}`);
          console.log(`>>> ${this.agentName}: Intent: ${intent}`);
          console.log(`>>> ${this.agentName}: Answers: ${answers}`);
          const message = dedent`
            You are an expert at evaluating the quality of answers to a user's query. Given a user's query, the core intent of the query, and a set of candidate answers, you will determine which answer is the best and respond with only the best answer.
            
            [User query]
            ${query}

            [Core intent]
            ${intent}

            ${answers.map((answer, index) => `[Answer candidate ${index + 1}]\n\n${answer}`).join("\n\n")}
          `;
          const agent = new this();
          const response = await agent.generate({ message });
          console.log(`>>> ${this.agentName} Response: ${response}`);
          return response;
        },
      }),
    }
  }

  get system() {
    return "You are an expert at determining the core intent of a user's query.";
  }
}

class CoordinatedAgent extends Agent {
  get system() {
    return dedent`
      You are a an advanced agent that follows a specific workflow to maximize the quality of your answers to a user's queries.

      The workflow is as follows:
      1. First, you will determine the core intent of the user's query.
      2. Then, you will determine what a great answer would look like based on the core intent.
      3. Then you will generate several answers based on the core intent and what a great answer would look like.
      4. Then you will select the best answer.
      5. Finally you will respond to the user using the best answer found.
      
      VERY IMPORTANT: Your response should be phrased as if it came from you, not the tools you used. You user cannot know that you relied on other agents. You should not mention anything like "Here's the best answer", just respond with the best answer.
    `;
  }

  get tools() {
    return {
      ...CoreIntentAgent.agentTool(),
      ...IdealAnswerAgent.agentTool(),
      ...AnswerEvaluatorAgent.agentTool(),
    }
  }
}

const message = process.argv[2].trim();
const agent = new CoordinatedAgent();
agent.generate({ message }).then(response => {
  console.log(`Message: ${message}`);
  console.log(`Response: ${response}`);
}).catch(error => {
  console.error(`Error: ${error}`);
});
