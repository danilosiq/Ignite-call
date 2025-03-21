import { Box } from "@/core/components/box";
import { Button } from "@/core/components/button";
import { Column, Row } from "@/core/components/layout";
import { TextArea } from "@/core/components/text-area";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarBlank, Check, Clock } from "@phosphor-icons/react";
import { format, formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ConfirmSchedulingSchema = z.object({
  date: z.date(),
  name: z.string(),
  email: z.string(),
  observations: z.string(),
  user_id: z.string(),
});

type ConfirmSchedulingType = z.infer<typeof ConfirmSchedulingSchema>;

interface ConfirmSchedulingProps {
  selectedDate: Date;
  onGoBack: () => void;
  userData: User;
}

export function ConfirmScheduling({
  selectedDate,
  onGoBack,
  userData,
}: ConfirmSchedulingProps) {
  const { register, handleSubmit } = useForm<ConfirmSchedulingType>({
    resolver: zodResolver(ConfirmSchedulingSchema),
    defaultValues: {
      name: userData.name,
      date: selectedDate,
      email: userData.email,
      user_id: userData.id,
    },
  });

  function handleConfirmScheduling(schedule: ConfirmSchedulingType) {
    api.post("/users/schedule", { schedule });
    onGoBack();
    toast(
      `Data marcada para ${formatDate(
        schedule.date,
        "d 'de' 'MMMM' 'de'yyyy",
        { locale: ptBR }
      )}, confira seu google agenda!`,
      {
        icon: <Check />,
        style: {
          background: "green",
          color: "white",
        },
      }
    );
  }

  return (
    <div className="w-[540px] mx-auto">
      <form onSubmit={handleSubmit(handleConfirmScheduling)}>
        <Box>
          <Row className="gap-4 border-b border-gray-600 mb-6 pb-6">
            <Row className="gap-2 items-center">
              <CalendarBlank size={20} color="#A9A9B2" />{" "}
              <p>
                {format(selectedDate, "d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </Row>
            <Row className="gap-2 items-center">
              <Clock size={20} color="#A9A9B2" />

              <p className="text-base">{selectedDate?.getHours()}:00 h</p>
            </Row>
          </Row>

          <Column className="gap-6">
            <Column className="gap-2">
              <p>Seu nome</p>
              <Row className="bg-gray-900 p-2 rounded-md">
                <span className="text-gray-200">cal.com/</span>
                <span>{userData.username}</span>
              </Row>
            </Column>

            <Column className="gap-2">
              <p>Endereço de e-mail</p>
              <Row className="bg-gray-900 p-2 rounded-md">
                <span>{userData.email}</span>
              </Row>
            </Column>

            <Column className="gap-2">
              <p>Observações</p>
              <Row className="bg-gray-900 p-2 rounded-md">
                <TextArea {...register("observations")} />
              </Row>
            </Column>
          </Column>

          <Row className="mt-6 justify-end">
            <Button sizes="md" variant="ghost" onClick={onGoBack}>
              Confirmar
            </Button>
            <Button sizes="md" variant="primary">
              Confirmar
            </Button>
          </Row>
        </Box>
      </form>
    </div>
  );
}
