import { SiteSettingsI } from "@/types/settings";
import fs from "fs/promises";
import path from "path";

const settingsPath = path.join(process.cwd(), "/settings");

export const getSiteSettings = async () => {
  const siteSettingsPath = path.join(settingsPath, "/site.json");

  try {
    const stringData = (await fs.readFile(siteSettingsPath, "utf-8")) as string;
    return JSON.parse(stringData) as SiteSettingsI;
  } catch (e) {
    console.log(e);
  }
};
