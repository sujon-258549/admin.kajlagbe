import { useMyData } from "../redux/hooks";
import { config } from "../config";
import { useLocation, matchPath } from "react-router-dom";
import { routePermissions } from "../router/routePermissions";

// ─── Helper: user এর permission থেকে can() এবং actions বের করো ───────────────
const resolvePermission = (
  moduleName: string,
  userPermissions: { module: string; permissions: string[] }[],
  isSuperAdmin: boolean,
  allActions: string[],
) => {
  if (isSuperAdmin) {
    // Super Admin → সব action এ নাম রিটার্ন করবে
    const canActions = Object.fromEntries(allActions.map((a) => [a, a]));
    return {
      can: () => true,
      actions: allActions,
      canActions, // e.g. { view: "view", create: "create" }
      moduleName,
    };
  }

  const modulePerm = userPermissions.find(
    (p) => p.module.toLowerCase() === moduleName.toLowerCase(),
  );

  // ইউজারের এই মডিউলের জন্য থাকা অ্যাকশনগুলো (যদি থাকে)
  const actions: string[] = modulePerm
    ? modulePerm.permissions.map((a: string) => a.toLowerCase())
    : [];

  const can = (action: string): boolean =>
    actions.includes(action.toLowerCase());

  // শুধু সেই অ্যাকশনগুলো দিয়ে ম্যাপ তৈরি করো যেগুলোর পারমিশন ইউজারের আছে
  // ভ্যালু হিসেবে সরাসরি নামটাই থাকবে
  const canActions: Record<string, any> = Object.fromEntries(
    actions.map((a) => [a, a])
  );

  return { can, actions, canActions, moduleName };
};

// ─── Hook 1: Module name manually দিলে ─────────────────────────────────────────
/**
 * useButtonPermission
 * @param moduleName - sidebar/routePermissions এর module name (e.g. "Employees")
 *
 * Usage:
 *   const { can } = useButtonPermission("Employees");
 *   {can("create") && <Button>Add</Button>}
 */
export const useButtonPermission = (moduleName: string) => {
  const { user } = useMyData();
  const userPermissions: { module: string; permissions: string[] }[] =
    user?.role?.permissions || [];
  const isSuperAdmin = user?.email === config.superAdminEmail;

  const allActions: string[] = Array.from(
    new Set<string>(
      userPermissions.flatMap((p) => (p.permissions || []).map((a) => a.toLowerCase()))
    )
  );

  return resolvePermission(moduleName, userPermissions, isSuperAdmin, allActions);
};

// ─── Hook 2: Current route দেখে automatic module detect করে ────────────────────
/**
 * useRoutePermission
 * Current URL দেখে routePermissions থেকে module auto-detect করে।
 * কোনো parameter pass করতে হবে না।
 *
 * Usage:
 *   const { can, moduleName } = useRoutePermission();
 *   {can("create") && <Button>Add</Button>}
 */
export const useRoutePermission = () => {
  const { user } = useMyData();
  const location = useLocation();
  const userPermissions: { module: string; permissions: string[] }[] =
    user?.role?.permissions || [];
  const isSuperAdmin = user?.email === config.superAdminEmail;

  const allActions: string[] = Array.from(
    new Set<string>(
      userPermissions.flatMap((p) => (p.permissions || []).map((a) => a.toLowerCase()))
    )
  );

  // Current pathname → routePermissions এ match করো
  const matchedKey = Object.keys(routePermissions).find((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

  if (!matchedKey) {
    return {
      can: () => false,
      actions: [] as string[],
      canActions: {} as Record<string, boolean>,
      moduleName: "",
    };
  }

  const { module: moduleName } = routePermissions[matchedKey];

  return resolvePermission(moduleName, userPermissions, isSuperAdmin, allActions);
};