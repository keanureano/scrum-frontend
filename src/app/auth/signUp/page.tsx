"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input type="email" {...register("email", { required: true })} />
        {errors.email && <p>Email is required</p>}
      </div>

      <div>
        <label>Name</label>
        <input type="text" {...register("name", { required: true })} />
        {errors.name && <p>Name is required</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <p>Password is required</p>}
      </div>

      <button type="submit">Register</button>

      <Link href="/auth/signIn">Already have an account?</Link>
    </form>
  );
}
