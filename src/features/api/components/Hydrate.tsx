"use client";

import {
  HydrationBoundary,
  HydrationBoundaryProps,
} from "@tanstack/react-query";

export const Hydrate = (props: HydrationBoundaryProps) => (
  <HydrationBoundary {...props} />
);
