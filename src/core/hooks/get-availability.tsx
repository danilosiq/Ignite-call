import { SchedulingAvalilability } from "@/@types/shceduling-availability";
import { api } from "@/lib/axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function useGetAvailability(username: string, currentDate: Date) {
  const [availabilityTimes, setAvailabilityTimes] = useState<SchedulingAvalilability>();
  const [isLoadingAbailability, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    api
      .get(`users/${username}/availability`, {
        params: {
          date: dayjs(currentDate).format("YYYY-MM-DD"),
        },
      })
      .then((res) => setAvailabilityTimes(res.data));
      setIsLoading(false)
  }, [currentDate, username]);

  return { availabilityTimes ,isLoadingAbailability};
}
