import { getSiteSettings } from "@/lib/api/settings";

async function Footer() {
  const settings = await getSiteSettings();
  return (
    <div className="border w-full min-h-[200px] flex ">
      <span className="inline-block m-auto text-lg">©{settings?.name} All rights reserverd</span>
    </div>
  );
}

export default Footer;
