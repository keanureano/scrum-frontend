"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { watch } from "fs";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const REGISTER_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`;
    try {
      await axios.post(REGISTER_URL, data);
      signIn("credentials", { ...data, callbackUrl: "/" });
    } catch (error) {
      router.push(`/auth/signUp?error=CredentialsSignup`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Image src="/logo.png" width={166} height={50} alt="logo" />

      <div>
        <label>Email</label>
        <input type="email" {...register("email", { required: true })} />
        {errors.email && <p>*Email is required</p>}
      </div>

      <div>
        <label>Name</label>
        <input type="text" {...register("name", { required: true })} />
        {errors.name && <p>*Name is required</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <p>*Password is required</p>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: true,
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && <p>*Confirm Password is required</p>}
        {errors.confirmPassword?.type === "validate" && (
          <p>*Passwords do not match</p>
        )}
      </div>

      <button type="submit">Register</button>

      <Link href="/auth/signIn">Already have an account?</Link>
    </form>
  );
}
