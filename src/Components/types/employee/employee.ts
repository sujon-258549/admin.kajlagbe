/**
 * Prisma-aligned admin employee (User + Profile + WorkInfo + Address).
 */
export const PRISMA_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MAINTAINER",
  "OWNER",
  "USER",
  "WORKER",
  "EMPLOYEE",
] as const;

export type PrismaRole = (typeof PRISMA_ROLES)[number];

export const ROLE_LABELS: Record<PrismaRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MAINTAINER: "Maintainer",
  OWNER: "Owner",
  USER: "User",
  WORKER: "Worker",
  EMPLOYEE: "Employee",
};

export const PRISMA_GENDERS = ["MALE", "FEMALE", "OTHER"] as const;
export type PrismaGender = (typeof PRISMA_GENDERS)[number];

export const PRISMA_BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;
export type PrismaBloodGroup = (typeof PRISMA_BLOOD_GROUPS)[number];

export const GENDER_LABELS: Record<PrismaGender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

export const BLOOD_GROUP_LABELS: Record<PrismaBloodGroup, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A−",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB−",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O−",
};

export type CreateEmployeeRequest = {
  email: string;
  password: string;
  mobile: string;
  name: string;
  /** `AllRole.role` string from API / DB */
  role: string;
  isActive: boolean;
  /** User.isBlocked */
  isBlocked?: boolean;
  /** User.isVerified */
  isVerified?: boolean;
  /** User.departmentId */
  departmentId?: string;
  /** WorkInfo.experience (alias: designation) */
  designation?: string;
  /** WorkInfo.workType (alias: department label) */
  department?: string;
  /** Profile */
  gender?: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  profilePhotoUrl?: string;
  nid?: string;
  /** Address */
  division?: string;
  district?: string;
  upazila?: string;
  address?: string;
  /** WorkInfo.categories — comma string or array */
  categories?: string | string[];
  availableTime?: string;
};

export type UpdateEmployeeRequest = {
  email?: string;
  mobile?: string;
  role?: string;
  password?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  isVerified?: boolean;
  departmentId?: string | null;
  profile?: {
    name?: string;
    gender?: string | null;
    age?: number | null;
    dob?: string | null;
    bloodGroup?: string | null;
    photo?: string | null;
    nid?: string | null;
  };
  address?: {
    division?: string | null;
    district?: string | null;
    upazila?: string | null;
    address?: string | null;
  };
  workInfo?: {
    experience?: string | null;
    workType?: string | null;
    categories?: string[];
    availableTime?: string | null;
  };
};

export type EmployApiUser = {
  id: string;
  email: string;
  mobile: string;
  role: string | { role: string; id?: string };
  isActive: boolean;
  isBlocked?: boolean;
  isVerified?: boolean;
  departmentId?: string | null;
  profile?: {
    name?: string | null;
    gender?: string | null;
    age?: number | null;
    dob?: string | null;
    bloodGroup?: string | null;
    photo?: string | null;
    nid?: string | null;
    nidPhoto?: string[];
  } | null;
  address?: {
    division?: string | null;
    district?: string | null;
    upazila?: string | null;
    address?: string | null;
  } | null;
  workInfo?: {
    experience?: string | null;
    workType?: string | null;
    categories?: string[];
    availableTime?: string | null;
  } | null;
};

export type EmployeeRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  role: PrismaRole;
  status: "Active" | "Inactive";
};

export type EmployeeModalSubmit = {
  name: string;
  email: string;
  mobile: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  departmentId?: string;
  designation: string;
  department: string;
  password?: string;
  gender?: string;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  profilePhotoUrl?: string;
  nid?: string;
  division?: string;
  district?: string;
  upazila?: string;
  addressLine?: string;
  categories?: string;
  availableTime?: string;
};

export function isPrismaRole(v: string): v is PrismaRole {
  return (PRISMA_ROLES as readonly string[]).includes(v);
}

export function deriveRoleString(u: { role?: unknown }): string {
  const r = u.role;
  if (typeof r === "string") return r;
  if (r && typeof r === "object" && "role" in r) {
    const inner = (r as { role?: unknown }).role;
    if (typeof inner === "string") return inner;
  }
  return "EMPLOYEE";
}

export function coerceRole(raw: string): PrismaRole {
  const u = raw?.toUpperCase?.() ?? "";
  return isPrismaRole(u) ? u : "EMPLOYEE";
}

/** GET /employ/:id may return the user object or `{ data: user }`. */
export function unwrapEmploySingleResponse(res: unknown): EmployApiUser | null {
  if (res == null || typeof res !== "object") return null;
  const o = res as Record<string, unknown>;
  if (typeof o.id === "string" && typeof o.email === "string")
    return o as EmployApiUser;
  const inner = o.data;
  if (inner && typeof inner === "object") {
    const d = inner as Record<string, unknown>;
    if (typeof d.id === "string" && typeof d.email === "string")
      return d as EmployApiUser;
  }
  return null;
}

export function mapApiUserToEmployeeRow(u: EmployApiUser): EmployeeRow {
  return {
    id: u.id,
    name: u.profile?.name?.trim() || "—",
    email: u.email,
    phone: u.mobile,
    designation: u.workInfo?.experience?.trim() || "—",
    department: u.workInfo?.workType?.trim() || "—",
    role: coerceRole(deriveRoleString(u)),
    status: u.isActive ? "Active" : "Inactive",
  };
}

export function unwrapEmployeeListResponse(res: unknown): EmployApiUser[] {
  if (res == null) return [];
  if (Array.isArray(res)) return res as EmployApiUser[];
  if (typeof res === "object") {
    const o = res as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as EmployApiUser[];
    if (Array.isArray(o.users)) return o.users as EmployApiUser[];
    if (Array.isArray(o.results)) return o.results as EmployApiUser[];
    if (Array.isArray(o.employees)) return o.employees as EmployApiUser[];
  }
  return [];
}
