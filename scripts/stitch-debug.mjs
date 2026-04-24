#!/usr/bin/env node
/**
 * Debug: raw MCP call to Stitch generate_screen_from_text
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const API_KEY = process.env.STITCH_API_KEY;
if (!API_KEY) { console.error("STITCH_API_KEY required"); process.exit(1); }

const transport = new StreamableHTTPClientTransport(
  new URL("https://stitch.googleapis.com/mcp"),
  { requestInit: { headers: { "X-Goog-Api-Key": API_KEY } } }
);

const client = new Client({ name: "stitch-debug", version: "1.0.0" });
await client.connect(transport);
console.log("Connected to Stitch MCP");

// First try a simple list to confirm connection
const listResult = await client.callTool({
  name: "list_screens",
  arguments: { projectId: "1479160621695124909" }
}, undefined, { timeout: 30000 });
console.log("list_screens result:", JSON.stringify(listResult, null, 2));

// Now try generate with full raw output
console.log("\nCalling generate_screen_from_text...");
try {
  const genResult = await client.callTool({
    name: "generate_screen_from_text",
    arguments: {
      projectId: "1479160621695124909",
      prompt: "Simple landing page for coaching institute WIN. Gold (#B8960C) CTA on cream (#F5F0E8) background. Headline: Welkom bij WIN. Four feature cards below.",
      deviceType: "DESKTOP"
    }
  }, undefined, { timeout: 300000 });

  console.log("\nRaw generate result:");
  console.log(JSON.stringify(genResult, null, 2));
} catch (err) {
  console.error("\nGenerate error:", err.message);
  console.error("Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
}

await client.close();
