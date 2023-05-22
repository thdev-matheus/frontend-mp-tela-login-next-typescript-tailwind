"use client";

import Link from "next/link";
import * as C from "@/components";
import { FiUser, FiLock } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema } from "@/schemas/user";
import { IUser, IUserCreateRequest } from "@/types/user";
import { useRouter } from "next/navigation";
import { database } from "@/database";
import { toast, ToastContainer } from "react-toast";

export default function RegisterForm() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<IUserCreateRequest>({
    resolver: zodResolver(userCreateSchema),
  });

  const handleRegister = (data: IUserCreateRequest) => {
    try {
      const userAlreadyExists = database.find(
        (user) => user.email === data.email
      );

      if (userAlreadyExists) {
        throw new Error("Usuário já existe");
      }

      console.log("passou");

      delete data.confirmPassword;

      database.push(data as IUser);

      toast.success("Usuário criado com sucesso!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);

      setTimeout(() => {
        toast.error("Você será redirecionado para a tela de login");
      }, 2000);

      setTimeout(() => {
        router.push("/");
      }, 3500);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="w-4/5 flex flex-col justify-center items-center gap-4"
      >
        <C.Input
          icon={FiUser}
          label="Nome"
          type="text"
          placeholder="Digite o seu nome"
          {...register("name")}
          error={errors.name?.message}
        />
        <C.Input
          icon={FiUser}
          label="E-mail"
          type="text"
          placeholder="Digite o seu e-mail"
          {...register("email")}
          error={errors.email?.message}
        />
        <C.Input
          icon={FiLock}
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          {...register("password")}
          error={errors.password?.message}
        />
        <C.Input
          icon={FiLock}
          label="Confirmação"
          type="password"
          placeholder="Confirme sua senha"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <C.Button type="submit">Cadastrar</C.Button>

        <Link href="/" className="text-[#9CA3AF] text-[8pt] underline">
          Já possuo uma conta
        </Link>
      </form>
      <ToastContainer delay={3000} />
    </>
  );
}
