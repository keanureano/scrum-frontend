import { authOptions } from "@/lib/authOptions";
import axiosServer from "@/lib/axiosServer";
import { getServerSession } from "next-auth";

export default async function DevServer() {
  const session = await getServerSession(authOptions);
  const { data } = await axiosServer.get("/");
  return (
    <div className="overflow-scroll bg-slate-700 text-slate-100">
      <h1 className="text-base font-bold">Server Side Session</h1>
      <pre>{JSON.stringify(session, null, 1)}</pre>
      <h1 className="text-base font-bold">Server Side Fetching</h1>
      <pre>{JSON.stringify(data, null, 1)}</pre>
    </div>
  );
}
