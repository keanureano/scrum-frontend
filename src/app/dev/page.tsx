import api from "@/lib/axiosApi";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function DevPage({
  searchParams,
}: {
  searchParams: {
    q: string;
  };
}) {
  const session = await getServerSession(authOptions);
  const { data } = await api.get(`/${searchParams.q || ""}`);

  return (
    <div className="text-xs p-4">
      <pre>{JSON.stringify(session, null, 1)}</pre>
      <pre>{JSON.stringify(data, null, 1)}</pre>
    </div>
  );
}
