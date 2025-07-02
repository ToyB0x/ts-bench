import type { Route } from "./+types/graph";
// biome-ignore lint/correctness/noEmptyPattern: example code
export function meta({}: Route.MetaArgs) {
  return [];
}

export default function Page({}: Route.ComponentProps) {}
