import fs from "node:fs/promises";
import path from "node:path";

const base = "https://www.vidyawadi.org";
const outDir = path.join(process.cwd(), "public", "uploads", "about");

const assets = [
  {
    url: `${base}/uploads/about-messages/1766389601754-managementbanner.jpg`,
    file: "management-banner.jpg",
  },
  {
    url: `${base}/api/uploads/messages/president/1786124662159-images.jpg`,
    file: "president-message.jpg",
  },
  {
    url: `${base}/images/jain_meals.png`,
    file: "ceo-message.png",
  },
  {
    url: `${base}/111rrrdd.png`,
    file: "management-group.png",
  },
];

await fs.mkdir(outDir, { recursive: true });

for (const asset of assets) {
  const res = await fetch(asset.url);
  if (!res.ok) {
    console.log("FAILED", asset.url, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const target = path.join(outDir, asset.file);
  await fs.writeFile(target, buf);
  console.log("saved", target, buf.length);
}

const messages = await fetch(`${base}/api/messages`).then((r) => r.json());
console.log(JSON.stringify(messages, null, 2));
