// Browser-compatible database utility for development
// In production, this should connect to a real API or use WASM SQLite

// Define types locally to avoid importing Node.js-specific code
type PackageResult = {
  id: number;
  package: string;
  isSuccess: boolean;
  isCached: boolean;
  scanId: number;
  error: string | null;
  files: number | null;
  linesOfLibrary: number | null;
  linesOfDefinitions: number | null;
  linesOfTypeScript: number | null;
  linesOfJavaScript: number | null;
  linesOfJSON: number | null;
  linesOfOther: number | null;
  identifiers: number | null;
  symbols: number | null;
  types: number | null;
  instantiations: number | null;
  memoryUsed: number | null;
  assignabilityCacheSize: number | null;
  identityCacheSize: number | null;
  subtypeCacheSize: number | null;
  strictSubtypeCacheSize: number | null;
  tracingTime: number | null;
  ioReadTime: number | null;
  parseTime: number | null;
  resolveModuleTime: number | null;
  resolveTypeReferenceTime: number | null;
  resolveLibraryTime: number | null;
  programTime: number | null;
  bindTime: number | null;
  checkTime: number | null;
  printTimeTime: number | null;
  emitTime: number | null;
  dumpTypesTime: number | null;
  totalTime: number | null;
  traceNumType: number | null;
  traceNumTrace: number | null;
  traceFileSizeType: number | null;
  traceFileSizeTrace: number | null;
  analyzeHotSpot: number | null;
  analyzeHotSpotMs: number | null;
  analyzeFileSize: number | null;
  // scan fields
  version: string;
  owner: string;
  repository: string;
  changed: number | null;
  insertions: number | null;
  deletions: number | null;
  commitHash: string;
  commitMessage: string;
  commitDate: Date;
  scannedAt: Date;
  cpus: string;
  aiCommentImpact: string | null;
  aiCommentReason: string | null;
  aiCommentSuggestion: string | null;
};

// Mock data for browser testing
const mockData: PackageResult[] = [];

export async function fetchPackageResults(packageName: string): Promise<{
  packageFullName: string;
  resultTblKeysForGraph: string[];
  results: PackageResult[];
}> {
  // In a real implementation, this would either:
  // 1. Make an API call to a backend server
  // 2. Use WASM SQLite to query a local database
  // For now, we'll return mock data or empty results

  const resultTblKeysForGraph = [
    "files",
    "linesOfLibrary",
    "linesOfDefinitions",
    "linesOfTypeScript",
    "linesOfJavaScript",
    "linesOfJSON",
    "linesOfOther",
    "identifiers",
    "symbols",
    "types",
    "instantiations",
    "memoryUsed",
    "assignabilityCacheSize",
    "identityCacheSize",
    "subtypeCacheSize",
    "strictSubtypeCacheSize",
    "tracingTime",
    "ioReadTime",
    "parseTime",
    "resolveModuleTime",
    "resolveTypeReferenceTime",
    "resolveLibraryTime",
    "programTime",
    "bindTime",
    "checkTime",
    "printTimeTime",
    "emitTime",
    "dumpTypesTime",
    "totalTime",
  ];

  return {
    packageFullName: packageName,
    resultTblKeysForGraph,
    results: mockData.filter((r) => r.package === packageName),
  };
}
