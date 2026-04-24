/**
 * Completed years from date of birth (`YYYY-MM-DD` from `<input type="date" />`).
 * Appends `T12:00:00` for date-only strings to reduce timezone off-by-one issues.
 */
export function ageFromDateOfBirth(dob: string | undefined | null): number | null {
  const raw = dob?.trim();
  if (!raw) return null;
  const iso = raw.length === 10 ? `${raw}T12:00:00` : raw;
  const birth = new Date(iso);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years -= 1;
  if (years < 0 || years > 150) return null;
  return years;
}

/** Prefer age derived from DOB when DOB parses; otherwise use manual form age. */
export function resolveProfileAge(
  dob: string | undefined | null,
  formAge: number | undefined | null,
): number | null {
  const dobTrim = dob?.trim() ?? "";
  if (dobTrim) {
    const fromDob = ageFromDateOfBirth(dobTrim);
    if (fromDob !== null) return fromDob;
  }
  if (formAge === undefined || formAge === null || Number.isNaN(Number(formAge))) {
    return null;
  }
  return Number(formAge);
}
