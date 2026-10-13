// ============================================================================
// HomeSense — Local Auth Service
// Stores registered accounts in localStorage. No hardcoded users.
// ============================================================================

const ACCOUNTS_KEY = 'homesense_accounts';

export interface LocalAccount {
  email: string;
  passwordHash: string; // simple hash for local-only demo
  name: string;
  householdName: string;
  createdAt: string;
}

/** Deterministic hash — good enough for a local-only demo app */
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const chr = password.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return `hs_${Math.abs(hash).toString(36)}`;
}

function loadAccounts(): LocalAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: LocalAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerAccount(
  email: string,
  password: string,
  name: string,
  householdName: string
): { ok: true; account: LocalAccount } | { ok: false; error: string } {
  const accounts = loadAccounts();
  const normalizedEmail = email.trim().toLowerCase();

  if (accounts.find((a) => a.email === normalizedEmail)) {
    return { ok: false, error: 'An account with this email already exists. Please sign in instead.' };
  }

  const account: LocalAccount = {
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    name: name.trim(),
    householdName: householdName.trim() || `${name.trim()}'s Household`,
    createdAt: new Date().toISOString(),
  };

  saveAccounts([...accounts, account]);
  return { ok: true, account };
}

export function signInAccount(
  email: string,
  password: string
): { ok: true; account: LocalAccount } | { ok: false; error: string } {
  const accounts = loadAccounts();
  const normalizedEmail = email.trim().toLowerCase();

  const account = accounts.find((a) => a.email === normalizedEmail);
  if (!account) {
    return { ok: false, error: 'No account found with that email. Please check your email or create a new account.' };
  }

  if (account.passwordHash !== hashPassword(password)) {
    return { ok: false, error: 'Incorrect password. Please try again.' };
  }

  return { ok: true, account };
}
