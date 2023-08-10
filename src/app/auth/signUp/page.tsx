"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Image from "next/image";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex justify-center p-20 bg-neutral-300 h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-96 w-80 flex-col items-center rounded-lg bg-white">
        <Image src="/logo.png" width={166} height={50} alt="logo" />
          <div>
            <label className="p-7">Email</label>
            <input type="email" className="border solid bg-stone-300 rounded-md p-1.5 mb-4 " {...register("email", { required: true })} />
            {errors.email && <p className="text-red-700 ml-32">*Email is required</p>}
          </div>

          <div>
            <label className="p-7">Name</label>
            <input type="text" className="border solid bg-stone-300 rounded-md p-1.5 mb-4 " {...register("name", { required: true })} />
            {errors.name && <p className="text-red-700 ml-32">*Name is required</p>}
          </div>

          <div>
            <label className="p-4">Password</label>
            <input type="password" className="border solid bg-stone-300 rounded-md p-1.5 mb-4 " {...register("password", { required: true })} />
            {errors.password && <p className="text-red-700 ml-32">*Password is required</p>}
          </div>

          <button className="text-white rounded-lg border-2 w-52 border-solid border-secondary-500 bg-blue-500 p-2 mt-6" type="submit">Register</button>

          <Link href="/auth/signIn">Already have an account?</Link>
        </div>
      </form>

    </div>

  );
}
