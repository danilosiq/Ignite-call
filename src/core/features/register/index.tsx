"use client";

import { Box } from "@/core/components/box";
import { Button } from "@/core/components/button";
import { InputText } from "@/core/components/input-text";
import { Column } from "@/core/components/layout";
import { Stepper } from "@/core/components/stepper";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "@phosphor-icons/react";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterValidationSchema = z.object({
  username: z
    .string()
    .min(1, "campo obrigatório")
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usario apenas pode ter letras e hifens",
    })
    .transform((username) => username.toLowerCase()),

  name: z
    .string()
    .min(1, "campo obrigatório")
    .transform((username) => username.toLowerCase()),
});

type RegisterValidationType = z.infer<typeof RegisterValidationSchema>;

export function RegisterScreen() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<RegisterValidationType>({
    resolver: zodResolver(RegisterValidationSchema),
  });

  async function HandleRegister(data: RegisterValidationType) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message);
        return
      }
      console.log(err);
    }
  }

  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  useEffect(() => {
    if (username) {
      setValue("username", String(username));
    }
  }, [username, setValue]);

  return (
    <Column className="max-w-[540px] mt-24 m-auto  h-screen ">
      <Column className="mx-6">
        <h1 className="text-2xl font-bold">Bem vindo ao Ignite call!</h1>
        <p className="text-gray-200">
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </p>

        <div className="my-6">
          <Stepper currentStep={1} maxSteps={4} />
        </div>
      </Column>
      <form onSubmit={handleSubmit(HandleRegister)}>
        <Box className="flex flex-col gap-4">
          <Column>
            <p className="mb-2">Nome de usuario</p>
            <InputText
              placeholder="usuario"
              {...register("username")}
              prefix="cal.com/"
            />
            {errors.username && (
              <p className="text-xs text-red-400">{errors.username.message}</p>
            )}
          </Column>

          <Column>
            <p className="mb-2">Nome completo</p>
            <InputText placeholder="nome completo" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </Column>
          <Button variant="primary" type="submit" sizes="md">
            Proximo passo <ArrowRight size={20} />
          </Button>
        </Box>
      </form>
    </Column>
  );
}
