import DevClient from "@/app/dev/DevClient";
import DevServer from "@/app/dev/DevServer";

export default async function DevPage() {
  return (
    <div className="grid grid-cols-2 text-xs">
      <DevServer />
      <DevClient />
    </div>
  );
}
