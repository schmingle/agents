import { google } from "@ai-sdk/google";
import { CoreMessage, generateText } from "ai";

export abstract class Agent {
  history: CoreMessage[] = [];
  messages: CoreMessage[] = [];

  abstract generate(prompt: string): Promise<string>;

  get model() {
    return google("gemini-2.0-flash-001");
  }

  get system() {
    return undefined;
  }

  get tools() {
    return {};
  }
}

export abstract class ToolCallingAgent extends Agent {
  async generate(prompt: string): Promise<string> {
    this.messages.push({ role: "user", content: prompt });
    return this.processMessages();
  }

  async processMessages(): Promise<string> {
    let limit = 10;
    
    while (limit > 0) {
      // Process user and tool messages
      const { messages, model, system, tools } = this;
      const result = await generateText({ messages, model, system, tools });
      this.messages.push(...result.response.messages);

      // Done if we got an assistant message
      const message = this.messages[this.messages.length - 1];
      if (message.role === "assistant") return result.text;

      limit--;
    }

    throw new Error("Exhausted attempts to process messages");
  }
}
