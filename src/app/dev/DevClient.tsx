"use client";
import axiosClient from "@/lib/axiosClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DevClient() {
  const session = useSession();
  const [data, setData] = useState();

  async function fetchData() {
    const response = await axiosClient.get("/");
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-scroll bg-slate-700 text-slate-100">
      <h1 className="text-base font-bold">Client Side Session</h1>
      <pre>{JSON.stringify(session.data, null, 1)}</pre>
      <h1 className="text-base font-bold">Client Side Fetching</h1>
      <pre>{JSON.stringify(data, null, 1)}</pre>
    </div>
  );
}
