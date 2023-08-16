"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const errorNotif = useSearchParams().get("error");

  const onSubmit = (data: any) => {
    signIn("credentials", { ...data, callbackUrl: "/" });
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <form
        className="max-w-2xl p-8 rounded-lg bg-neutral-50"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Image
          className="mb-16"
          src="/logo.png"
          width={400}
          height={400 / 4}
          alt="logo"
        />

        <div>
          <label className="block text-neutral-600">Email</label>
          <input
            className="w-full p-2 border-2 rounded-lg border-neutral-300 bg-neutral-200"
            type="email"
            {...register("email", { required: true })}
          />
          <p className={errors.email ? "text-red-900" : "opacity-0"}>
            Email is required
          </p>
        </div>

        <div>
          <label className="block text-neutral-600">Password</label>
          <input
            className="w-full p-2 border-2 rounded-lg border-neutral-300 bg-neutral-200"
            type="password"
            {...register("password", { required: true })}
          />

          <p className={errors.email ? "text-red-900" : "opacity-0"}>
            Password is required
          </p>
        </div>

        <p className={errorNotif ? "text-red-900" : "opacity-0"}>
          Login Failed, Incorrect email or password
        </p>

        <div className="flex flex-col items-center gap-4 pt-8">
          <button
            className="w-full p-4 text-lg font-semibold border-2 rounded-lg text-neutral-50 bg-secondary-600 border-secondary-500"
            type="submit"
          >
            Login
          </button>

          <Link
            className="text-secondary-700 hover:underline"
            href="/auth/signUp"
          >
            Don't have an account?
          </Link>
        </div>
      </form>
    </main>
  );
}
