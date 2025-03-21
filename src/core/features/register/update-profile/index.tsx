"use client";
import { Box } from "@/core/components/box";
import { Button } from "@/core/components/button";
import { Column, Row } from "@/core/components/layout";
import { Stepper } from "@/core/components/stepper";
import { TextArea } from "@/core/components/text-area";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, User } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateProfileSchema = z.object({
  bio: z.string(),
});

type updateProfileType = z.infer<typeof updateProfileSchema>;

export function UpdateProfileScreen() {
  const session = useSession();
  const router = useRouter()

  const { handleSubmit, register } = useForm<updateProfileType>({
    resolver: zodResolver(updateProfileSchema),
  });

  async function handleUpdateProfile(data: updateProfileType) {
    await api.put("/users/profile", { bio: data.bio });
    router.push('/schedule')
  }


  return (
    <Column className="max-w-[540px] mt-24 m-auto  h-screen ">
      <Column className="mx-6">
        <h1 className="text-2xl font-bold">Defina sua disponibilidade</h1>
        <p className="text-gray-200">
          Por último, uma breve descrição e uma foto e perfil
        </p>

        <div className="my-6">
          <Stepper currentStep={4} maxSteps={4} />
        </div>
      </Column>
      <form action="" onSubmit={handleSubmit(handleUpdateProfile)}>
        <Box className="flex flex-col gap-4 ">
          <p>Foto de perfil</p>
          <Row className="items-center gap-4">
            {session.data ? (
              <Image
                alt=""
                src={session.data?.user.avatar_url}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center rounded-full border border-gray-400">
                <User size={20}/>
              </div>
            )}
           
          </Row>
          <Column className="gap-1">
            <p>Sobre você</p>
            <TextArea className="min-h-[120px]" {...register("bio")} />
            <p className="text-gray-200">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal
            </p>
          </Column>
          <Button variant="primary" sizes="md" type='submit'>
            Finalizar <ArrowRight size={20} />
          </Button>
        </Box>
      </form>
    </Column>
  );
}
