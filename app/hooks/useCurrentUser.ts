import { useQuery, useSession } from "blitz"
import getCurrentUser from "app/queries/getCurrentUser"
import { UserSelect, User, Session, Calendar, Group } from "@prisma/client"

export interface CurrentUser {
  id: number
  name: string | null
  email: string
  role: string
}

export type BaseUserSelect = "id" | "name" | "email" | "role"

type A = User & { sessions: Session[]; calendars: Calendar[]; groups: Group[] }

// TODO: FIX GENERIC
export const useCurrentUser = <T extends Omit<UserSelect, BaseUserSelect>>(
  userSelect?: T
): [A | null, () => void] => {
  const session = useSession()
  const [user, { refetch }] = useQuery(getCurrentUser, userSelect || {}, {
    enabled: !!session.userId,
  })

  return [session.userId ? (user as any) : null, refetch]
}
