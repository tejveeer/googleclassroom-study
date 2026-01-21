import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./client";

export function usePosts() {
  const { isSuccess, data } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const posts = isSuccess ? toCamel(data) : undefined;
  return posts;
}
