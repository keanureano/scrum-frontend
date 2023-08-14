"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const errorNotif = useSearchParams().get("error");

  const onSubmit = async (data: any) => {
    const REGISTER_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`;
    try {
      await axios.post(REGISTER_URL, data);
      signIn("credentials", { ...data, callbackUrl: "/" });
    } catch (error) {
      reset();
      router.push(`/auth/signUp?error=CredentialsSignup`);
    }
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
          width={432}
          height={135}
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
          <label className="block text-neutral-600">Name</label>
          <input
            className="w-full p-2 border-2 rounded-lg border-neutral-300 bg-neutral-200"
            type="text"
            {...register("name", { required: true })}
          />

          <p className={errors.name ? "text-red-900" : "opacity-0"}>
            Name is required
          </p>
        </div>

        <div>
          <label className="block text-neutral-600">Password</label>
          <input
            className="w-full p-2 border-2 rounded-lg border-neutral-300 bg-neutral-200"
            type="password"
            {...register("password", { required: true })}
          />
          <p className={errors.password ? "text-red-900" : "opacity-0"}>
            Password is required
          </p>
        </div>

        <div>
          <label className="block text-neutral-600">Confirm Password</label>
          <input
            className="w-full p-2 border-2 rounded-lg border-neutral-300 bg-neutral-200"
            type="password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          <p className={errors.confirmPassword ? "text-red-900" : "opacity-0"}>
            Passwords do not match
          </p>
        </div>

        <p className={errorNotif ? "text-red-900" : "opacity-0"}>
          Register failed, Email already in use
        </p>

        <div className="flex flex-col items-center gap-4 pt-8">
          <button
            className="w-full p-4 text-lg font-semibold border-2 rounded-lg text-neutral-50 bg-secondary-600 border-secondary-500"
            type="submit"
          >
            Register
          </button>

          <Link
            className="text-secondary-700 hover:underline"
            href="/auth/signIn"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </main>
  );
}
