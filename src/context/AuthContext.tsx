import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type UserRole = 'customer' | 'admin'

export type AuthUser = {
  username: string
  role: UserRole
}

type StoredAccount = {
  username: string
  password: string
  role: UserRole
}

const SESSION_KEY = 'antrepriznodwes-session'
const REGISTERED_KEY = 'antrepriznodwes-users'

const SEED_ACCOUNTS: StoredAccount[] = [
  { username: 'user1', password: 'user1', role: 'customer' },
  { username: 'user2', password: 'user2', role: 'customer' },
  { username: 'ano_admin', password: 'admin', role: 'admin' },
]

type AuthContextValue = {
  user: AuthUser | null
  isGuest: boolean
  login: (
    username: string,
    password: string,
  ) => { ok: true; user: AuthUser } | { ok: false; reason: 'invalid' }
  signUp: (
    username: string,
    password: string,
  ) =>
    | { ok: true; user: AuthUser }
    | { ok: false; reason: 'exists' | 'invalid_username' | 'weak_password' }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (parsed?.username && (parsed.role === 'customer' || parsed.role === 'admin')) {
      return parsed
    }
  } catch {
    /* ignore */
  }
  return null
}

function readRegistered(): StoredAccount[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(REGISTERED_KEY)
    if (!raw) return []
    return JSON.parse(raw) as StoredAccount[]
  } catch {
    return []
  }
}

function writeRegistered(accounts: StoredAccount[]) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(accounts))
}

function allAccounts(): StoredAccount[] {
  const registered = readRegistered()
  const seedNames = new Set(SEED_ACCOUNTS.map((a) => a.username.toLowerCase()))
  const extra = registered.filter((a) => !seedNames.has(a.username.toLowerCase()))
  return [...SEED_ACCOUNTS, ...extra]
}

function findAccount(username: string): StoredAccount | undefined {
  const key = username.trim().toLowerCase()
  return allAccounts().find((a) => a.username.toLowerCase() === key)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession())

  const persistSession = useCallback((next: AuthUser | null) => {
    setUser(next)
    if (next) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }, [])

  const login = useCallback((username: string, password: string) => {
    const account = findAccount(username)
    if (!account || account.password !== password) {
      return { ok: false as const, reason: 'invalid' as const }
    }
    const authUser: AuthUser = { username: account.username, role: account.role }
    persistSession(authUser)
    return { ok: true as const, user: authUser }
  }, [persistSession])

  const signUp = useCallback(
    (username: string, password: string) => {
      const trimmed = username.trim()
      if (trimmed.length < 3) {
        return { ok: false as const, reason: 'invalid_username' as const }
      }
      if (password.length < 4) {
        return { ok: false as const, reason: 'weak_password' as const }
      }
      if (findAccount(trimmed)) {
        return { ok: false as const, reason: 'exists' as const }
      }
      const account: StoredAccount = {
        username: trimmed,
        password,
        role: 'customer',
      }
      const registered = readRegistered()
      registered.push(account)
      writeRegistered(registered)
      const authUser: AuthUser = { username: trimmed, role: 'customer' }
      persistSession(authUser)
      return { ok: true as const, user: authUser }
    },
    [persistSession],
  )

  const logout = useCallback(() => persistSession(null), [persistSession])

  const value = useMemo(
    () => ({
      user,
      isGuest: user === null,
      login,
      signUp,
      logout,
    }),
    [user, login, signUp, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
