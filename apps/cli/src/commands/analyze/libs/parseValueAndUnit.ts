export const parseValueAndUnit = (
  valueStringMayHaveUnit: string,
): { value: number; unit: string | null } => {
  const match = valueStringMayHaveUnit.match(/^([0-9.]+)([a-zA-Z%]*)$/);
  if (!match)
    throw Error(
      `Value string does not match expected format: ${valueStringMayHaveUnit}`,
    );

  const valueString = match[1];
  if (!valueString) throw Error("Value string is empty");

  const value = Number.parseFloat(valueString);

  const unit = match[2] || null; // 単位がない場合はnull
  return { value, unit };
};
