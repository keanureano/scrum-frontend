import api from "@/lib/axiosApi";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function DevPage() {
  const session = await getServerSession(authOptions);
  const { data } = await api.get("/");

  return (
    <div className="text-xs">
      <pre>{JSON.stringify(session, null, 1)}</pre>
      <pre>{JSON.stringify(data, null, 1)}</pre>
    </div>
  );
}
