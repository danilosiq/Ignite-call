"use client";
import { Calendar } from "@/core/components/calendar";
import { Column } from "@/core/components/layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { ConfirmScheduling } from "./components/confirm-scheduling";

export function ScheduleScreen() {
  const sessionData = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const [currentSession,setSession] = useState<'calendar' | 'confirmDate'>('calendar')

  function handleChangeToCofirmSession(data:Date){
    setSelectedDate(data)
    setSession('confirmDate')
  }

  
  return (
    <Column className="max-w-[820px] mt-24 m-auto gap-6 h-screen ">
      <Column className="items-center">
        {sessionData.data && (
          <Image
            src={sessionData.data.user.avatar_url}
            width={64}
            height={64}
            alt=""
            className="rounded-full"
          />
        )}
        <p className="">{sessionData.data?.user.name}</p>
        <p>{sessionData.data?.user.bio}</p>
      </Column>

      {sessionData.data && currentSession=="calendar" && (
        <Calendar
          username={sessionData.data?.user.username}
          onSelectDate={handleChangeToCofirmSession}
        />
      )}

      {selectedDate && currentSession=="confirmDate" && sessionData.data &&(
         <ConfirmScheduling selectedDate={selectedDate} onGoBack={()=>setSession('calendar')} userData={sessionData.data?.user}/>
      )}
     
     
    </Column>
  );
}
