import { useQuery } from "@tanstack/react-query";
import { getUserMemberId } from "./client";
import { toCamel } from "@/utility";

export function useUserMemberId({ courseId }) {
  const { isSuccess, data, ...rest } = useQuery({
    queryKey: ["memberId", courseId],
    queryFn: getUserMemberId,
  });

  const userMemberId = isSuccess ? toCamel(data).user.id : undefined;
  return { userMemberId, isSuccess, ...rest };
}
