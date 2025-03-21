"use client";

import { Box } from "@/core/components/box";
import { Button } from "@/core/components/button";
import { Column, Row } from "@/core/components/layout";
import { Stepper } from "@/core/components/stepper";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function ConnectCalendarScreen() {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasPermissionError = !!searchParams.get("error");
  const isSgnedIn = session.status === "authenticated";

  return (
    <Column className="max-w-[540px] mt-24 m-auto  h-screen ">
      <Column className="mx-6">
        <h1 className="text-2xl font-bold">Conecte sua agenda!</h1>
        <p className="text-gray-200">
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </p>

        <div className="my-6">
          <Stepper currentStep={2} maxSteps={4} />
        </div>
      </Column>
      <Box className="flex flex-col gap-4">
        <Box>
          <Row className="items-center justify-between">
            <span>Google Agenda</span>
            {isSgnedIn ? (
              <Button variant="disabled" disabled sizes="sm">
                Conectado <CheckCircle size={20} />
              </Button>
            ) : (
              <Button
                variant="outline"
                sizes="sm"
                onClick={() => signIn("google")}
              >
                Conectar <ArrowRight size={20} />
              </Button>
            )}
          </Row>
        </Box>
        {hasPermissionError && (
          <p className="text-xs text-red-400">
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar
          </p>
        )}
        <Button
          disabled={!isSgnedIn}
          variant="primary"
          type="submit"
          sizes="md"
          onClick={() => router.push("/register/time-intervals")}
        >
          Proximo passo <ArrowRight size={20} />
        </Button>
      </Box>
    </Column>
  );
}
