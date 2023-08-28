import { authOptions } from "@/lib/authOptions";
import axiosServer from "@/lib/axiosServer";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const team = await fetchTeam();

  return (
    <main>
      <h1 className="text-xl">{team.name}</h1>
      <UserNavList/>
    </main>
  );
}

async function UserNavList() {
  const team = await fetchTeam();
  return (
    <>
      <div className="grid justify-items-start" >
      <h1>Users: </h1>
      {team.users.map((user: { id: number; name: string; role: string}) => (
        <button 
        key={user.id}
        className=" hover:bg-blue-700 font-semibold py-2 px-4 rounded text-blue-500"
        >
          {user.name}
        </button>
      ))}
      </div>
    </>
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
