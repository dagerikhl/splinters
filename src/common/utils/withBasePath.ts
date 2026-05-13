export const withBasePath = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
