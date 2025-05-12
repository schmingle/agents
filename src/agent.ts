import { google } from "@ai-sdk/google";
import { CoreMessage, generateText } from "ai";

export abstract class Agent {
  history: CoreMessage[] = [];
  messages: CoreMessage[] = [];

  async generate({ message, messages }: {
    message?: string,
    messages?: CoreMessage[]
  }): Promise<string> {
    if (message) {
      this.messages.push({ role: "user", content: message });
    } else if (messages) {
      this.messages.push(...messages);
    } else {
      throw new Error("No message or messages provided");
    }
    return this.processMessages();
  }

  async processMessages(): Promise<string> {
    if (!this.messages.length) throw new Error("No messages provided");
    
    let limit = 10; // Just in case
    let text = "";

    while (limit > 0) {
      // Process based on last message's role
      const role = this.messages[this.messages.length - 1].role;

      // Process non-assistant messages (i.e. user, tool)
      if (role !== "assistant") {
        const { messages, model, system, tools } = this;
        const result = await generateText({ messages, model, system, tools });
        this.messages.push(...result.response.messages);
        text = result.text;
      }
      // Done if we got an assistant message
      else {
        if (!text) throw new Error("No text generated");
        return text;
      }

      limit--;
    }

    throw new Error("Exhausted attempts to process messages");
  }

  get model() {
    return google("gemini-2.0-flash-lite");
  }

  get system() {
    return undefined;
  }

  get tools() {
    return {};
  }
}
