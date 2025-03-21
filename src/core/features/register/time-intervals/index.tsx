"use client";
import { Box } from "@/core/components/box";
import { Button } from "@/core/components/button";
import { Checkbox } from "@/core/components/checkbox";
import { InputText } from "@/core/components/input-text";
import { Column, Row } from "@/core/components/layout";
import { Stepper } from "@/core/components/stepper";
import { api } from "@/lib/axios";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Selecione pelo menos um dia da semana",
    })
    .transform((intervals) =>
      intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        };
      })
    )
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        );
      },
      {
        message:
          "O horario de termino deve ser pelo menos uma hora a mais que o horario de começo",
      }
    ),
});

type timeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type timeIntervalsFormOutPut = z.output<typeof timeIntervalsFormSchema>;

export function TimeIntervalsScreen() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<timeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const intervals = watch("intervals");

  const weekDays = getWeekDays();
  const router = useRouter()

  async function handleSetTimeIntervals(data: any) {
    const {intervals} = data as timeIntervalsFormOutPut;
    await api.post("/users/time-intervals", {intervals});
    router.push('/register/update-profile')
  }
  
  return (
    <Column className="max-w-[540px] mt-24 m-auto  h-screen ">
      <Column className="mx-6">
        <h1 className="text-2xl font-bold">Conecte sua agenda!</h1>
        <p className="text-gray-200">
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </p>

        <div className="my-6">
          <Stepper currentStep={3} maxSteps={4} />
        </div>
      </Column>
      <form action="" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <Box className="flex flex-col gap-4 ">
          <Column className=" border rounded-md divide-y-2 divide-gray-600  border-gray-600">
            {fields.map((weekday, index) => (
              <Row
                key={weekday.id}
                className="h-[72px]  justify-between px-4 items-center"
              >
                <Row className="gap-3">
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={(cheked) => {
                          field.onChange(cheked === true);
                        }}
                      />
                    )}
                  />

                  <p>{weekDays[weekday.weekDay]}</p>
                </Row>
                <Row className="gap-2">
                  <InputText
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <InputText
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </Row>
              </Row>
            ))}
          </Column>
          {errors.intervals && (
            <p className="text-red-400 text-sm">
              {errors.intervals.root?.message || errors.intervals.message}
            </p>
          )}
          <Button variant="primary" type="submit" sizes="md">
            Proximo passo <ArrowRight size={20} />
          </Button>
        </Box>
      </form>
    </Column>
  );
}
