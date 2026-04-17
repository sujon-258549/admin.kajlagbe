/**
 * Prisma-aligned admin employee (User + Profile + WorkInfo).
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

export type CreateEmployeeRequest = {
  email: string;
  password: string;
  mobile: string;
  name: string;
  role: PrismaRole;
  isActive: boolean;
  designation?: string;
  department?: string;
};

export type UpdateEmployeeRequest = {
  email?: string;
  mobile?: string;
  name?: string;
  role?: PrismaRole;
  isActive?: boolean;
  designation?: string;
  department?: string;
  password?: string;
};

export type EmployApiUser = {
  id: string;
  email: string;
  mobile: string;
  role: string;
  isActive: boolean;
  profile?: { name: string | null } | null;
  workInfo?: {
    experience?: string | null;
    workType?: string | null;
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
  role: PrismaRole;
  isActive: boolean;
  designation: string;
  department: string;
  password?: string;
};

export function isPrismaRole(v: string): v is PrismaRole {
  return (PRISMA_ROLES as readonly string[]).includes(v);
}

function coerceRole(raw: string): PrismaRole {
  const u = raw?.toUpperCase?.() ?? "";
  return isPrismaRole(u) ? u : "EMPLOYEE";
}

export function mapApiUserToEmployeeRow(u: EmployApiUser): EmployeeRow {
  return {
    id: u.id,
    name: u.profile?.name?.trim() || "—",
    email: u.email,
    phone: u.mobile,
    designation: u.workInfo?.experience?.trim() || "—",
    department: u.workInfo?.workType?.trim() || "—",
    role: coerceRole(u.role),
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
