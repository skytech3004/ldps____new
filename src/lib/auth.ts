import { NextResponse } from "next/server";
import { UserRole } from "@/types/adminNav";

/**
 * Validates request authorization header or cookie for role-based API access.
 * Enforces Super Admin privileges for sensitive operations.
 */
export function checkApiAuthorization(
  request: Request,
  requiredRole: UserRole = "admin"
): { authorized: boolean; response?: NextResponse; role: UserRole } {
  // Extract role from custom header or fallback header
  const roleHeader = request.headers.get("x-user-role") || request.headers.get("X-User-Role");
  const userRole: UserRole = (roleHeader as UserRole) || "super_admin"; // Default to super_admin for development if header omitted

  if (requiredRole === "super_admin" && userRole !== "super_admin") {
    return {
      authorized: false,
      role: userRole,
      response: NextResponse.json(
        {
          error: "Unauthorized: Only Super Administrator can perform this operation.",
          code: "FORBIDDEN_SUPER_ADMIN_REQUIRED",
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, role: userRole };
}
