"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    signIn("credentials", { ...data, callbackUrl: "/" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input type="email" {...register("email", { required: true })} />
        {errors.email && <p>Email is required</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <p>Password is required</p>}
      </div>

      <button type="submit">Login</button>

      <Link href="/auth/signUp">Don't have an account?</Link>
    </form>
  );
}
