import { api } from "@/lib/axios";
import { useEffect, useState } from "react";





export function useGetBlockedDates(username:string,currentDate:Date){
    const [blockedTimes, setBlockedTimes] = useState<number[]>([]);
    const [isLoadingBlockdTimes, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        api
          .get(`users/${username}/blocked-dates`, {
            params: {
              year: currentDate.getFullYear(),
              month: currentDate.getMonth(),
            },
          })
          .then((res) => setBlockedTimes(res.data));

          setIsLoading(false)
      }, [currentDate, username]);

    return{blockedTimes,isLoadingBlockdTimes}
}