"use client";
import axiosClient from "@/lib/axiosClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";

interface Team {
  name: string;
  self: string;
  users: User[];
}

interface User {
  id: number;
  name: string;
  email: string;
  tasksToday: string;
  tasksYesterday: string;
  impediments: string;
}

interface Issue {
  issues: string;
}

export default function HomePageForm({ team }: { team: Team }) {
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  async function submitToDatabase() {
    const formData = getFormData();

    const { data: newScrum } = await axiosClient.post("/scrums", {
      issues: formData.issues[0].issues,
    });

    for (const user of formData.users) {
      await axiosClient.post("/tasks", {
        user: `/api/users/${user.id}`,
        scrum: newScrum._links.self.href,
        tasksToday: user.tasksToday,
        tasksYesterday: user.tasksYesterday,
        impediments: user.impediments,
      });
    }

    clearFormData();
  }

  function getFormData() {
    const users: User[] = [];
    const issues: Issue[] = [];

    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(`${team.name}`))
      .forEach((key) => {
        if (key.startsWith(`${team.name}/users`)) {
          const userData = JSON.parse(sessionStorage.getItem(key) || "{}");
          if (
            userData.tasksToday.trim() ||
            userData.tasksYesterday.trim() ||
            userData.impediments.trim()
          )
            users.push(userData);
        } else if (key.startsWith(`${team.name}/issues`)) {
          const issuesData = JSON.parse(sessionStorage.getItem(key) || "{}");
          issues.push(issuesData);
        }
      });

    const data = {
      users,
      issues,
    };

    return data;
  }

  function clearFormData() {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(`${team.name}`))
      .forEach((key) => sessionStorage.removeItem(key));
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-start">
        <h1>{team.name}</h1>
        {team.users.map((user, index) => (
          <button key={user.id} onClick={() => setSelectedUserIndex(index)}>
            <p className={selectedUserIndex === index ? "underline" : ""}>
              {user.name}
            </p>
          </button>
        ))}
      </div>

      <div className="grow">
        {team.users.map((user, index) => (
          <UserForm
            key={user.id}
            teamName={team.name}
            user={user}
            isHidden={index !== selectedUserIndex}
          />
        ))}

        <IssueForm teamName={team.name} />
      </div>

      <div className="grow">
        <EmailPreview
          getFormData={getFormData}
          submitToDatabase={submitToDatabase}
        />
      </div>
    </div>
  );
}

function UserForm({
  teamName,
  user,
  isHidden,
}: {
  teamName: string;
  user: User;
  isHidden: boolean;
}) {
  const { register, watch, setValue } = useForm({
    values: {
      id: user.id,
      name: user.name,
      email: user.email,
      tasksToday: "",
      tasksYesterday: "",
      impediments: "",
    },
  });

  useFormPersist(`${teamName}/users/${user.email}`, {
    watch,
    setValue,
  });

  return (
    <form className={isHidden ? "hidden" : "flex flex-col"}>
      <h2>{user.name}</h2>
      <input hidden {...register("id", { required: true })} />
      <input hidden {...register("name", { required: true })} />
      <input hidden {...register("email", { required: true })} />
      <label>
        Tasks Today
        <textarea
          className="w-full"
          {...register("tasksToday", { required: true })}
        />
      </label>
      <label>
        Tasks Yesterday
        <textarea
          className="w-full"
          {...register("tasksYesterday", { required: true })}
        />
      </label>
      <label>
        Impediments
        <textarea
          className="w-full"
          {...register("impediments", { required: true })}
        />
      </label>
    </form>
  );
}

function IssueForm({ teamName }: { teamName: string }) {
  const { register, watch, setValue } = useForm({
    values: {
      issues: "",
    },
  });

  useFormPersist(`${teamName}/issues`, {
    watch,
    setValue,
  });

  return (
    <form>
      <label>
        Issues
        <textarea
          className="w-full"
          {...register("issues", { required: true })}
        />
      </label>
    </form>
  );
}

function EmailPreview({
  getFormData,
  submitToDatabase,
}: {
  getFormData: () => { users: User[]; issues: Issue[] };
  submitToDatabase: () => {};
}) {
  const [formData, setFormData] = useState(getFormData());

  function refreshPreview() {
    const newData = getFormData() as any;
    setFormData(newData);
  }

  function generateEmail() {
    if (formData.users.length === 0 || formData.issues.length === 0)
      return null;

    const mailto = formData.users.map((user) => user.email).join(",");

    const subject = `Stand-up meeting ${new Date().toLocaleDateString()}`;

    const body = `${formData.users
      .map((user) => {
        return `- Tasks Today: ${user.tasksToday}\n- Tasks Yesterday: ${user.tasksYesterday}\n- Impediments: ${user.impediments}`;
      })
      .join("\n\n")}\n\nIssues: ${formData.issues[0].issues || "None"}`;

    const name = `${formData.users
      .map((user) => {
        return `${user.name}`;
      })
      }`;

    const yesterday = `${formData.users
      .map((user) => {
        return `-${user.tasksYesterday}`;
      })
      }`;

    const today = `${formData.users
      .map((user) => {
        return `-${user.tasksToday}`;
      })
      }`;

    const impediments = `${formData.users
      .map((user) => {
        return `${user.impediments}`;
      })
      }`;
    const issues = `${formData.users
      .map((user) => {
        return;
      })
      .join("\n\n")}\n\nIssues: ${formData.issues[0].issues || "None"}`;



    return {
      mailto,
      subject,
      name,
      body,
      yesterday,
      today,
      impediments,
      issues,
      href: `mailto:${mailto}?subject=${subject}&body=${encodeURIComponent(
        body
      )}`,
    };
  }

  return (
    <div className="ml-4 flex flex-col h-full justify-between">
      <div>
        <h2>Preview</h2>
        <pre>{generateEmail()?.subject}</pre>
        <table className="table-auto" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Yesterday</th>
              <th>Today</th>
              <th>Impediments</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><div className=" flex justify-center"><pre>{generateEmail()?.name}</pre></div></td>
              <td><div className=" flex justify-center ml-4"><pre>{generateEmail()?.yesterday}</pre></div></td>
              <td><div className=" flex justify-center ml-4"><pre>{generateEmail()?.today}</pre></div></td>
              <td><div className=" flex justify-center ml-4"><pre>{generateEmail()?.impediments}</pre></div></td>
              <td><div className=" flex justify-center ml-4"><pre>{generateEmail()?.issues}</pre></div></td>
            </tr>
          </tbody>
        </table>
      </div>


      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded bg-secondary-600 text-neutral-200"
          onClick={refreshPreview}
        >
          Refresh Preview
        </button>
        <a
          className="p-2 bg-secondary-600 text-neutral-200 rounded"
          href={generateEmail()?.href}
        >
          Send Email
        </a>

        <button
          className="p-2 rounded bg-secondary-600 text-neutral-200"
          onClick={submitToDatabase}
        >
          Save To Database
        </button>
      </div>
    </div>
  );
}