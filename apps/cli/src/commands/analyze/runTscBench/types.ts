import type { listPackages } from "../libs";

export type Package = Awaited<ReturnType<typeof listPackages>>[number];

export type TscResult = TscSuccess | TscFailure;

export type TscSuccess = {
  package: Package;
  status: "SUCCESS";
  numTrace: number;
  numType: number;
  numHotSpots: number;
  durationMs: number;
  durationMsHotSpots: number;
};

export type TscFailure = {
  package: Package;
  status: "FAILURE";
  durationMs: number;
  error: unknown;
};

export type AnalyzeResult = {
  stdout?: string;
  stderr?: string;
  success: boolean;
};
