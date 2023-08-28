import { authOptions } from "@/lib/authOptions";
import axiosServer from "@/lib/axiosServer";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const team = await fetchTeam();

  return (
    <main>
      <h1 className="text-xl ml-6">{team.name}</h1>
      <UserNavList/>
    </main>
  );
}

async function UserNavList() {
  const team = await fetchTeam();
  return (
    <div className="ml-6 p-2 shadow-lg rounded-lg bg-white mr-100">
      <h1 className="mb-2 mt-2 ml-2 text-2xl">Users</h1>
      <div className="grid gap-2 justify-start mb-2 ml-2">
        {team.users.map((user: { id: number; name: string; role: string}) => (
          <button 
            key={user.id}
            className="block w-full hover:bg-blue-500 font-semibold py-2 px-4 rounded-lg hover:text-white text-blue-500 underline"
          >
            {user.name}
          </button>
        ))}
      </div>
    </div>
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
