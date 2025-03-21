import { getWeekDays } from "@/utils/get-week-days";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isBefore,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import chunk from "lodash/chunk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetAvailability } from "../hooks/get-availability";
import { useGetBlockedDates } from "../hooks/get-blocked-dates";
import { Box } from "./box";
import { Button } from "./button";
import { Column, Row } from "./layout";
interface CalendarProps {
  username: string;
  onSelectDate: (selectedDate: Date) => void;
}

export function Calendar({ username,onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const weekDays = getWeekDays();
  const today = new Date();
  const [days, setDays] = useState<any[]>([]);
  const { blockedTimes, isLoadingBlockdTimes } = useGetBlockedDates(
    username,
    currentDate
  );
  const { availabilityTimes, isLoadingAbailability } = useGetAvailability(
    username,
    currentDate
  );



  const handleMonthNavigation = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = direction === "next" ? addMonths(prevDate, 1) : subMonths(prevDate, 1);
      return prevDate.getTime() !== newDate.getTime() ? newDate : prevDate;
    });
  }, []);

  useEffect(() => {
    const firstDayOfMonth = getDay(startOfMonth(currentDate));
    const daysInMonth = getDaysInMonth(currentDate);

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptySpaces = Array.from({ length: firstDayOfMonth }, () => null);

    setDays([...emptySpaces, ...daysArray]);
  }, [currentDate]);

  function handleSelectDate(day: number) {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      selectedHour
    );
    selectedDate.setDate(day);

    if (
      !isBefore(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
        today
      ) &&
      !blockedTimes.includes(selectedDate.getDay())
    ) {
      setCurrentDate(selectedDate);
      console.log(currentDate);
    }
  }

  function handleSelectHour(hour: number) {
    setSelectedHour(hour);

    setCurrentDate((prevDate) => {
      const updatedDate = new Date(prevDate);
      updatedDate.setHours(hour);
      return updatedDate;
    });
  }

  function handleSelectScheduling(date: Date) {
    console.log(date);
    onSelectDate(date)
    
  }

  function handleSetStyleOnDate(day: number) {
    const DateToCaompare = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (
      !isBefore(
        DateToCaompare,
        today
      )
    ) {
      if(blockedTimes.includes(DateToCaompare.getDay())){
        return 'text-gray-400 cursor-not-allowed'
      }else{
        return 'bg-gray-600 rounded hover:bg-gray-900 cursor-pointer'
      }
    }else{
      return 'text-gray-400 cursor-not-allowed'
    }
  }

  const isButtonDisabled = useMemo(() => {
    return availabilityTimes?.availableTimes?.length === 0 || currentDate.getHours() === 0;
  }, [availabilityTimes, currentDate]);

  return (
    <Box>
      <Row>
        <Column className="gap-6 w-full pr-6">
          <Row className="justify-between">
            <Row className="gap-1">
              <p className="capitalize font-medium text-sm">
                {format(currentDate, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-gray-200">{format(currentDate, "yyyy")}</p>
            </Row>

            <Row className="text-gray-200">
              <CaretLeft
                size={20}
                className="hover:bg-gray-900 rounded cursor-pointer"
                onClick={() => handleMonthNavigation("prev")}
              />
              <CaretRight
                size={20}
                className="hover:bg-gray-900 rounded cursor-pointer"
                onClick={() => handleMonthNavigation("next")}
              />
            </Row>
          </Row>

          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                {weekDays.map((weekDay) => (
                  <th className="uppercase text-gray-200" key={weekDay}>
                    {weekDay.slice(0, 3)}.
                  </th>
                ))}
              </tr>
            </thead>

            {isLoadingBlockdTimes == false && (
             <tbody>
             {chunk(days, 7).map((week:any, rowIndex:number) => (
               <tr key={rowIndex}>
                 {week.map((day:number, index:number) => (
                   <td
                     key={index}
                     className={`p-2 text-center h-[58px] w-[66px] ${
                              day === currentDate.getDate()
                                ? "border-green-500"
                                : "border-transparent"
                            } border-b ${day && handleSetStyleOnDate(day)}`}
                     onClick={() => day && handleSelectDate(day)}
                   >
                     {day || ""}
                   </td>
                 ))}
               </tr>
             ))}
           </tbody>
            )}
          </table>
        </Column>

        {availabilityTimes?.possibleTimes && isLoadingAbailability == false && (
          <Column className="w-[380px] border-l-2 gap-3 pl-6 border-gray-600">
            <span className="capitalize">
              {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </span>
            <Column className="h-[438px] gap-2 overflow-y-scroll scrollbar-none">
              {availabilityTimes?.possibleTimes.map((time, i) => {
                const isAvailable =
                  availabilityTimes.availableTimes.includes(time);

                return (
                  <div
                    key={i}
                    onClick={() => isAvailable && handleSelectHour(time)}
                    className={`flex items-center justify-center border min-h-12 rounded-md ${
                      isAvailable
                        ? "bg-gray-600 cursor-pointer"
                        : "bg-gray-900 text-gray-200"
                    } ${
                      selectedHour === time && isAvailable
                        ? "border-green-500"
                        : "border-gray-600"
                    }`}
                  >
                    {time}:00h
                  </div>
                );
              })}
            </Column>
            <div className="">
              <Button
                sizes="full"
                disabled={isButtonDisabled}
                variant="primary"
                onClick={() => handleSelectScheduling(currentDate)}
              >
                Selecionar
              </Button>
            </div>
          </Column>
        )}
      </Row>
    </Box>
  );
}
