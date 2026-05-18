/**
 * NextAuth API route handler.
 * Handles /api/auth/* endpoints (signin, signout, callback, session).
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
