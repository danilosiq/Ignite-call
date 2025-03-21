"use client";

import HomeImage from "@/core/assets/images/homeImage.png";
import { Box } from "@/core/components/box";
import { Button } from "@/core/components/button";
import { InputText } from "@/core/components/input-text";
import { Column, Row } from "@/core/components/layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const HomeScreenSchema = z.object({
  username: z
    .string()
    .min(3, "Preencha o campo com pelo menos 3 caracteres")
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usario apenas pode ter letras e hifens",
    })
    .transform((username) => username.toLowerCase()),
});

type HomeScreenSchemaType = z.infer<typeof HomeScreenSchema>;

export function HomeScreen() {
    const router = useRouter()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<HomeScreenSchemaType>({
    resolver: zodResolver(HomeScreenSchema),
  });

  async function handleValidation(data: HomeScreenSchemaType) {
    const {username} = data
    await router.push(`/register?username=${username}`)
  }

  return (
    <Row className="h-screen  overflow-hidden pl-[120px] justify-center gap-28 m-auto pt-48">
      <Column className="max-w-[480px]">
        <h1 className="font-extrabold text-[64px] mb-2">
          Agendamento Descomplicado
        </h1>
        <p className="font-normal text-xl text-gray-200 mb-6">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre
        </p>
        <Box>
          <form onSubmit={handleSubmit(handleValidation)}>
            <Row className="gap-2">
              <InputText
                prefix="ignite.com/"
                placeholder="usuario"
                {...register("username")}
                disabled={isSubmitting}
              />
              <Button disabled={isSubmitting} variant="primary" type="submit" sizes="md">
                Registrar <ArrowRight size={15} />
              </Button>
            </Row>
          </form>
        </Box>
        <p className="text-red-400">{errors.username && errors.username.message}</p>
      </Column>

      <div className="flex w-[827px] h-[442px] relative">
        <Image
          src={HomeImage}
          alt=""
          width={827}
          height={442}
          className="object-cover object-left"
        />
      </div>
    </Row>
  );
}
