"use client";
import axiosClient from "@/lib/axiosClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FiRefreshCcw } from "react-icons/fi";

interface Team {
  name: string;
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

    if (issues.length === 0) {
      issues.push({ issues: "" });
    }

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
    <div className="flex gap-4 p-4">
      <div className="flex flex-col items-start p-4 border rounded-md border-neutral-300 bg-neutral-50">
        <p className="mb-2 font-bold">{team.name}</p>
        {team.users.map((user, index) => (
          <button key={user.id} onClick={() => setSelectedUserIndex(index)}>
            <p
              className={`text-blue-500 decoration-2 transition-all ${
                selectedUserIndex === index ? "underline" : ""
              } active:hover:bg-blue-500 active:hover:text-white active:rounded-md`}
            >
              {user.name}
            </p>
          </button>
        ))}
      </div>

      <div className="grow">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col flex-1 gap-8 p-4 border rounded-md border-neutral-300 bg-neutral-50">
            {team.users.map((user, index) => (
              <UserForm
                key={user.id}
                teamName={team.name}
                user={user}
                isHidden={index !== selectedUserIndex}
              />
            ))}
          </div>
          <div className="flex flex-col flex-1 p-4 border rounded-md border-neutral-300 bg-neutral-50">
            <IssueForm teamName={team.name} />
          </div>
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
    <form className={`flex flex-col ${isHidden ? "hidden" : ""}`}>
      <h1 className="mb-2 font-bold">{user.name}</h1>
      <input hidden {...register("id", { required: true })} />
      <input hidden {...register("name", { required: true })} />
      <input hidden {...register("email", { required: true })} />
      <label>
        <h4 className="font-semibold text-neutral-700 font-poppins text-14">
          Tasks Today
        </h4>
        <textarea
          className="w-full p-4 border rounded-md h-36 border-neutral-300 bg-neutral-200"
          {...register("tasksToday", { required: true })}
        />
      </label>
      <label>
        Tasks Yesterday
        <textarea
          className="w-full p-4 border rounded-md h-36 border-neutral-300 bg-neutral-200"
          {...register("tasksYesterday", { required: true })}
        />
      </label>
      <label>
        Impediments
        <textarea
          className="w-full p-4 border rounded-md h-36 border-neutral-300 bg-neutral-200"
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
          className="w-full p-4 border rounded-md h-36 border-neutral-300 bg-neutral-200"
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

    const body = `Hi team,\n\n${formData.users
      .map((user) => {
        return `Name: ${user.name}\n- Tasks Today: ${user.tasksToday}\n- Tasks Yesterday: ${user.tasksYesterday}\n- Impediments: ${user.impediments}`;
      })
      .join("\n\n")}\n\nIssues: ${formData.issues[0].issues || "None"}`;

    return {
      mailto,
      subject,
      body,
      href: `mailto:${mailto}?subject=${subject}&body=${encodeURIComponent(
        body
      )}`,
    };
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-16 p-4 border rounded-md border-neutral-300 bg-neutral-50">
        <div>
          <h2 className="my-2 font-bold">Preview</h2>

          <div className="border rounded-md bg-neutral-100 border-neutral-200 p-4 font-medium">
            <pre className="mb-4 font-sans font-semibold">
              {generateEmail()?.subject}
            </pre>
            <pre className="font-sans">{generateEmail()?.body}</pre>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          className="flex items-center p-2 rounded-lg bg-secondary-600 text-neutral-200"
          onClick={refreshPreview}
        >
          <span className="mr-2">Refresh Preview</span>
          <FiRefreshCcw />
        </button>
        <a
          className="flex items-center p-2 rounded-lg bg-secondary-600 text-neutral-200"
          href={generateEmail()?.href}
        >
          <span className="mr-2">Send Email</span>
          <AiOutlineMail />
        </a>

        <button
          className="flex items-center p-2 rounded-lg bg-secondary-600 text-neutral-200"
          onClick={submitToDatabase}
        >
          <span className="mr-2">Save To Database</span>
          <BsDatabaseFillAdd />
        </button>
      </div>
    </div>
  );
}
