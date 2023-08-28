import { authOptions } from "@/lib/authOptions";
import axiosServer from "@/lib/axiosServer";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const team = await fetchTeam();

  return (
    <main>
      <h1 className="text-xl">{team.name}</h1>
      <ul>
        {team.users.map((user: { id: number; name: string }) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
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

  const team = {
    name: teamResponse.data.name,
    users: usersResponse.data._embedded.users,
  };

  return team;
}
