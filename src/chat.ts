import { CoreMessage,streamText } from "ai";
import * as dotenv from "dotenv";

import { Agent } from "./agent";

dotenv.config();

export class ChatAgent extends Agent {
  constructor(private threadId: string) {
    super();
    console.log(">>> Creating ChatAgent for thread", this.threadId);
  }

  async stream({ message, onChunk }: { message: string, onChunk: (chunk: string) => void }) {
    // Load history and add user message
    this.messages.push(...(await this.getHistory()));
    this.messages.push({ role: "user", content: message });

    // Stream response
    const { messages, model, instructions: system } = this;
    const { textStream } = streamText({ model, system, messages });
    for await (const chunk of textStream) {
      onChunk(chunk);
    }
  }

  async getHistory(): Promise<CoreMessage[]> {
    // TODO: Actually grab this from a database or something
    return [{
      role: "user",
      content: "Hello, how are you?",
    }, {
      role: "assistant",
      content: "I'm good, thank you! How can I help you today?",
    }, {
      role: "user",
      content: "First, a bit about myself: I like cats, I wake up super early, and my favorite cuisines are Vietnamese and Mexican.",
    }, {
      role: "assistant",
      content: "Got it. I'll make sure to personalize my responses to your preferences.",
    }];
  }

  get instructions() {
    return "You are a helpful assistant";
  }
}

const message = process.argv[2].trim();
const agent = new ChatAgent("abc-123");
console.log(`Message: ${message}`);
console.log("Response:");
agent.stream({ message, onChunk: (chunk) => {
  process.stdout.write(chunk);
}});
