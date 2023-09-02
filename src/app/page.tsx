import HomePageForm from "@/components/HomePageForm";
import { authOptions } from "@/lib/authOptions";
import axiosServer from "@/lib/axiosServer";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const team = await fetchTeam();

  return (
    <main>
      <HomePageForm team={team} />
    </main>
  );
}

async function fetchTeam() {
  const session = (await getServerSession(authOptions)) as any;
  const userId = session.user.id;

  const teamResponse = await axiosServer.get(`/users/${userId}/team`);
  const usersResponse = await axiosServer.get(
    teamResponse.data._links.users.href
  );

  const activeUsers = usersResponse.data._embedded.users.filter(
    (user: { role: string }) => user.role !== "INACTIVE"
  );

  const team = {
    name: teamResponse.data.name,
    users: activeUsers,
  };

  return team;
}
