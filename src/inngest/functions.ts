import { Sandbox } from "@e2b/code-interpreter";
import { createAgent, openai } from "@inngest/agent-kit";

import { inngest } from "./client";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    if (!event.data?.value) {
      throw new Error("Missing 'value' in event data.");
    }
    
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-test11");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer. Your wite readable, maintainable code. You write simple NExt.js & React snippets",
      model: openai({
        model: "mistralai/mistral-7b-instruct",
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseUrl: "https://openrouter.ai/api/v1", // obrigatório para usar OpenRouter
      }),
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });


    
    return { output, sandboxUrl };
  },
);


// import { createAgent, openai } from "@inngest/agent-kit"

// import { inngest } from "./client";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event }) => {
//     const codeAgent = createAgent({
//       name: "code-agent",
//       system: "You are an expert nextjs expert. You write readable code.",
//       model: openai({ model: "gpt-4o" }),
//     });

//     const { output } = await codeAgent.run(
//       `Summarize the following text: ${event.data.value}` 
//     );

//     return { output };
//   },
// );


// import { inngest } from "./client";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event }) => {
//     const prompt = event.data.value ?? "Something to summarize";

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "mistralai/mistral-7b-instruct",
//         messages: [
//           {
//             role: "system",
//             content: "You are an expert summarizer. You summarize everything in exactly 2 words.",
//           },
//           {
//             role: "user",
//             content: `Summarize the following: ${prompt}`,
//           },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const errorBody = await response.text();
//       console.error("Erro do modelo:", {
//         status: response.status,
//         body: errorBody,
//       });
//       throw new Error(`Erro ${response.status}: ${errorBody}`);
//     }


//     const data = await response.json();
//     const output = data.choices?.[0]?.message?.content ?? "No response";

//     return { output };
//   }
// );
