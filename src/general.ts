import * as dotenv from "dotenv";

import { Agent } from "./agent";

dotenv.config();

export class GeneralAgent extends Agent {
  get system() {
    return "You are a helpful assistant";
  }
}

const message = process.argv[2].trim();
const agent = new GeneralAgent();
agent.generate({ message }).then(response => {
  console.log(`Message: ${message}`);
  console.log(`Response: ${response}`);
}).catch(error => {
  console.error(`Error: ${error}`);
});
