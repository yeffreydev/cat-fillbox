import { getSiteSettings } from "@/lib/api/settings";
import View from "./View";

export default async function CartPage() {
  const settings = await getSiteSettings();
  if (!settings) return;
  return <View settings={settings} />;
}
