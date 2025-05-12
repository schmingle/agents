import { generateText } from "ai";
import * as dotenv from "dotenv";

import { Agent } from "./agent";

dotenv.config();

class GeneralAgent extends Agent {
  async run(prompt: string): Promise<string> {
    const { model, system } = this;
    const response = await generateText({
      prompt,
      model,
      system,
    });
    return response.text;	
  }

  get system() {
    return "You are a helpful assistant";
  }
}

const prompt = process.argv[2].trim();
console.log(`Prompt: ${prompt}`);

const agent = new GeneralAgent();
agent.run(prompt).then(response => {
  console.log(`Response: ${response}`);
}).catch(error => {
  console.error(`Error: ${error}`);
});
