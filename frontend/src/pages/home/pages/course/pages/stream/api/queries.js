import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./client";
import { toCamel } from "@/utility";

export function usePosts({ courseId }) {
  const { isSuccess, data, ...rest } = useQuery({
    queryKey: ["posts", courseId],
    queryFn: ({ queryKey: [_, courseId] }) => getPosts(courseId),
  });

  const posts = isSuccess ? toCamel(data) : undefined;
  return { posts, isSuccess, ...rest };
}
