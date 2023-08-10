import api from "@/lib/api";

export default async function Api() {
  const { data } = await api.get("/");

  return (
    <>
      <pre>API Data: {JSON.stringify(data)}</pre>
    </>
  );
}
