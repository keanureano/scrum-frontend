"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Image from "next/image";

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
    <div className="flex justify-center p-20 bg-neutral-300 h-screen">
       
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-72 w-72 flex-col items-center rounded-lg bg-white">
      <div>
      <Image src="/logo.png" width={166} height={50} alt="logo" />
        <input type="email"className="border solid bg-stone-300 rounded-md p-1.5 mb-4 "placeholder="Enter Email"{...register("email", { required: true })} />
        {errors.email && <p>Email is required</p>}
      </div>
      
      <div>
        <input type="password"className="border solid bg-stone-300 rounded-md p-1.5"placeholder="Enter Password" {...register("password", { required: true })} />
        {errors.password && <p>Password is required</p>}
      </div>
   
      <button type="submit" className="text-white rounded-lg border-2 w-52 border-solid border-secondary-500 bg-blue-500 p-2 mt-6">Login</button>
    
      <Link href="/auth/signUp" className="mt-2">Don't have an account?</Link>
      </div>
    </form>
    </div>
  );
}
