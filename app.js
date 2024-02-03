import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";
import { WebBrowser } from "langchain/tools/webbrowser";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { DynamicTool } from "@langchain/core/tools";
import "dotenv/config";

const run = async () => {
    const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" }); // Using GPT-3.5
    const embeddings = new OpenAIEmbeddings();

    // Array of Tools (SerpAPI: Web Searching, WebBrowser: Scrapes and Parses Website HTML, Calculator: Calculates)
    const tools = [
        new SerpAPI(process.env.SERPAPI_API_KEY, {
            location: "Austin,Texas,United States",
            hl: "en",
            gl: "us"
        }),
        new Calculator(),
        new WebBrowser({ model, embeddings }),

        // Custom Tool
        new DynamicTool({
            name: "Log an Input", // Custom Tool Name
            description: "call this with a string input to log something it to the console.", // Custom Tool Description *NOTE* If your function takes an input, then specifically tell it what to input and in what order they are to be put in.
            func: async (input) => {  // Function that the tool uses
                console.log("#")
                console.log("#")
                console.log("#")
                console.log(input)
                console.log("#")
                console.log("#")
                console.log("#")
            },
          })
    ];

    // Sets up the tools, model, and agent paramaters for execution
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "zero-shot-react-description",
        verbose: true
    });

    //   Task
    const input = `Log "hello world" to the console.`;

    //   Executing the agent with the Task as the Input
    const result = await executor.invoke({ input });

    let fullResult = JSON.stringify(result); // {"output":"The word of the day on Merriam Webster is \"acquisitive\" and the top result on Google for that word is the dictionary definition of \"acquisitive\"."}
    let justAnswer = JSON.stringify(result.output); // "The word of the day on Merriam Webster is \"acquisitive\" and the top result on Google for that word is the dictionary definition."

    console.log(`Output: ${justAnswer}`);
};

// Running Agent
run();
