export const parseValueAndUnit = (
  valueStringMayHaveUnit: string,
): { value: number; unit: string | null } => {
  const match = valueStringMayHaveUnit.match(/^([0-9.]+)([a-zA-Z%]*)$/);
  if (!match)
    throw Error(
      "Value string does not match expected format: " + valueStringMayHaveUnit,
    );

  const valueString = match[1];
  if (!valueString) throw Error("Value string is empty");

  const value = Number.parseFloat(valueString);

  const unit = match[2] || null; // 単位がない場合はnull
  return { value, unit };
};

//     'Files:                         618',
//     'Lines of Library:            41836',
//     'Lines of Definitions:       127137',
//     'Lines of TypeScript:          1068',
//     'Lines of JavaScript:             0',
//     'Lines of JSON:                  44',
//     'Lines of Other:                  0',
//     'Identifiers:                186597',
//     'Symbols:                    203309',
//     'Types:                       71049',
//     'Instantiations:             926111',
//     'Memory used:               285146K',
//     'Assignability cache size:    15536',
//     'Identity cache size:           181',
//     'Subtype cache size:            139',
//     'Strict subtype cache size:      35',
//     'Tracing time:                0.03s',
//     'I/O Read time:               0.04s',
//     'Parse time:                  0.28s',
//     'ResolveModule time:          0.10s',
//     'ResolveTypeReference time:   0.00s',
//     'ResolveLibrary time:         0.01s',
//     'Program time:                0.51s',
//     'Bind time:                   0.21s',
//     'Check time:                  0.69s',
//     'printTime time:              0.00s',
//     'Emit time:                   0.00s',
//     'Dump types time:             0.99s',
//     'Total time:                  1.41s',

// const diagnosticsKeySchema = v.union([
//   v.literal("Files"),
//   v.literal("Lines of Library"),
//   v.literal("Lines of Definitions"),
//   v.literal("Lines of TypeScript"),
//   v.literal("Lines of JavaScript"),
//   v.literal("Lines of JSON"),
//   v.literal("Lines of Other"),
//   v.literal("Identifiers"),
//   v.literal("Symbols"),
//   v.literal("Types"),
//   v.literal("Instantiations"),
//   v.literal("Memory used"),
//   v.literal("Assignability cache size"),
//   v.literal("Identity cache size"),
//   v.literal("Subtype cache size"),
//   v.literal("Strict subtype cache size"),
//   v.literal("Tracing time"),
//   v.literal("I/O Read time"),
//   v.literal("Parse time"),
//   v.literal("ResolveModule time"),
//   v.literal("ResolveTypeReference time"),
//   v.literal("ResolveLibrary time"),
//   v.literal("Program time"),
//   v.literal("Bind time"),
//   v.literal("Check time"),
//   v.literal("printTime time"),
//   v.literal("Emit time"),
//   v.literal("Dump types time"),
//   v.literal("Total time"),
// ]);
