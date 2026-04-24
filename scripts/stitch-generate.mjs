#!/usr/bin/env node
/**
 * Stitch screen generation via raw MCP client.
 * Usage: STITCH_API_KEY=... node scripts/stitch-generate.mjs <projectId> <page-name> <prompt-file> [deviceType]
 *
 * deviceType: DESKTOP (default), MOBILE, TABLET
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { join } from "path";

const [,, projectId, pageName, promptFile, deviceType = "DESKTOP"] = process.argv;

if (!projectId || !pageName || !promptFile) {
  console.error("Usage: node scripts/stitch-generate.mjs <projectId> <page-name> <prompt-file> [DESKTOP|MOBILE]");
  process.exit(1);
}

const API_KEY = process.env.STITCH_API_KEY;
if (!API_KEY) { console.error("STITCH_API_KEY env var required"); process.exit(1); }

const prompt = readFileSync(promptFile, "utf-8");
const designsDir = join(process.cwd(), ".stitch", "designs");
mkdirSync(designsDir, { recursive: true });

console.log(`[${pageName}] Connecting to Stitch MCP...`);

const transport = new StreamableHTTPClientTransport(
  new URL("https://stitch.googleapis.com/mcp"),
  { requestInit: { headers: { "X-Goog-Api-Key": API_KEY } } }
);
const client = new Client({ name: "win-stitch", version: "1.0.0" });
await client.connect(transport);

console.log(`[${pageName}] Generating (prompt: ${prompt.length} chars, device: ${deviceType})...`);
console.log(`[${pageName}] This takes 1-3 minutes...`);

try {
  const result = await client.callTool({
    name: "generate_screen_from_text",
    arguments: { projectId, prompt, deviceType }
  }, undefined, { timeout: 300000 });

  const data = result.structuredContent;
  const screen = data?.outputComponents?.[0]?.design?.screens?.[0];

  if (!screen) {
    console.error(`[${pageName}] No screen in response!`);
    console.error("Raw:", JSON.stringify(data, null, 2).slice(0, 500));
    process.exit(1);
  }

  console.log(`[${pageName}] Screen generated: ${screen.id} (${screen.width}x${screen.height})`);

  // Download HTML
  if (screen.htmlCode?.downloadUrl) {
    console.log(`[${pageName}] Downloading HTML...`);
    const htmlResp = await fetch(screen.htmlCode.downloadUrl);
    const html = await htmlResp.text();
    const htmlPath = join(designsDir, `${pageName}.html`);
    writeFileSync(htmlPath, html);
    console.log(`[${pageName}] HTML saved: ${htmlPath} (${html.length} bytes)`);
  }

  // Download screenshot (append =w{width} for full resolution)
  if (screen.screenshot?.downloadUrl) {
    console.log(`[${pageName}] Downloading screenshot...`);
    const imgUrl = `${screen.screenshot.downloadUrl}=w${screen.width}`;
    const imgResp = await fetch(imgUrl);
    const imgBuf = Buffer.from(await imgResp.arrayBuffer());
    const imgPath = join(designsDir, `${pageName}.png`);
    writeFileSync(imgPath, imgBuf);
    console.log(`[${pageName}] Screenshot saved: ${imgPath} (${imgBuf.length} bytes)`);
  }

  // Output metadata
  const meta = {
    page: pageName,
    id: screen.id,
    sourceScreen: screen.name,
    width: parseInt(screen.width),
    height: parseInt(screen.height),
    title: screen.title
  };
  console.log(`[${pageName}] METADATA:${JSON.stringify(meta)}`);

  // Output suggestions from Stitch
  const suggestions = data?.outputComponents?.filter(c => c.suggestion).map(c => c.suggestion);
  if (suggestions?.length) {
    console.log(`[${pageName}] Stitch suggestions:`);
    suggestions.forEach(s => console.log(`  - ${s}`));
  }

  const text = data?.outputComponents?.find(c => c.text)?.text;
  if (text) console.log(`[${pageName}] Stitch: ${text}`);

} catch (err) {
  console.error(`[${pageName}] Failed:`, err.message);
  process.exit(1);
} finally {
  await client.close();
}
