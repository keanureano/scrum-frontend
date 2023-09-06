"use client";
import axiosClient from "@/lib/axiosClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { BsDatabaseFillAdd } from 'react-icons/bs'
import { AiOutlineMail } from 'react-icons/ai'
import { FiRefreshCcw } from 'react-icons/fi'

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
    <div className="flex ml-4">
      <div className="flex flex-col items-start mt-4 ml-2 p-4 bg-white text-blue-500">
        <b className="text-black mb-2">Users</b>
        <h1>{team.name}</h1>
        {team.users.map((user, index) => (
          <button key={user.id} onClick={() => setSelectedUserIndex(index)}>
            <p className={`transition-all ${selectedUserIndex === index ? "underline" : ""} active:hover:bg-blue-500 active:hover:text-white active:rounded-md`}>
              {user.name}
            </p>
          </button>
        ))}
      </div>


      <div className="grow">
        <div className="flex m-4 p-4 flex-col gap-8 flex-1 rounded-md border border-neutral-300 bg-neutral-50">
          {team.users.map((user, index) => (
            <UserForm
              key={user.id}
              teamName={team.name}
              user={user}
              isHidden={index !== selectedUserIndex}
            />
          ))}
        </div>
        <div className="flex m-4 p-4 flex-col gap-8 flex-1 rounded-md border border-neutral-300 bg-neutral-50">
          <IssueForm teamName={team.name} />
        </div>
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
      <h1 className="mb-2 font-bold">{user.name}</h1>
      <input hidden {...register("id", { required: true })} />
      <input hidden {...register("name", { required: true })} />
      <input hidden {...register("email", { required: true })} />
      <label>
        <h4 className="text-neutral-700 font-poppins text-14 font-semibold">
          Tasks Today
        </h4>
        <textarea
          className="w-full h-36 rounded-md border border-neutral-300 bg-neutral-200 p-4"
          {...register("tasksToday", { required: true })}
        />
      </label>
      <label>
        Tasks Yesterday
        <textarea
          className="w-full h-36 rounded-md border border-neutral-300 bg-neutral-200 p-4"
          {...register("tasksYesterday", { required: true })}
        />
      </label>
      <label>
        Impediments
        <textarea
          className="w-full h-36 rounded-md border border-neutral-300 bg-neutral-200 p-4"
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
          className="w-full h-36 rounded-md border border-neutral-300 bg-neutral-200 p-4"
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
        return `  ${user.name}\n- Tasks Today: ${user.tasksToday}\n- Tasks Yesterday: ${user.tasksYesterday}\n- Impediments: ${user.impediments}`;
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
        return `-${user.impediments}`;
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
    <div className="flex flex-col h-full justify-between bg-white mt-4">
      <div>
        <b><h2 className="mb-4 mt-2 ml-2">Preview</h2></b>



        <div className="ml-4 mb-2 font-semibold">
          <pre>{generateEmail()?.name}</pre>
        </div>


        <div className="ml-4">
          <pre>{generateEmail()?.yesterday}</pre>
        </div>


        <div className="ml-4">
          <pre>{generateEmail()?.today}</pre>
        </div>

        <div className="ml-4">
          <pre>{generateEmail()?.impediments}</pre>
        </div>

        <pre className="ml-4">{generateEmail()?.issues}</pre>
      </div>


      <div className="flex justify-center gap-3 mb-4">
        <button
          className="p-2 rounded bg-secondary-600 text-neutral-200 flex items-center"
          onClick={refreshPreview}
        >
          <span className="mr-2">Refresh Preview</span>
          <FiRefreshCcw />
        </button>
        <a
          className="p-2 rounded bg-secondary-600 text-neutral-200 flex items-center"
          href={generateEmail()?.href}
        >
          <span className="mr-2">Send Email</span>
          <AiOutlineMail />
        </a>

        <button
          className="p-2 rounded bg-secondary-600 text-neutral-200 flex items-center"
          onClick={submitToDatabase}
        >
          <span className="mr-2">Save To Database</span>
          <BsDatabaseFillAdd />
        </button>
      </div>
    </div>
  );
}
