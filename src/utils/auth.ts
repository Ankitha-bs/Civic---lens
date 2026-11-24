import type { AdminUser } from '../types/civic';

export interface MockAdminCredential {
  officerId: string;
  passcode: string;
  user: AdminUser;
}

export const DEMO_ADMIN_CREDENTIALS: readonly MockAdminCredential[] = [
  {
    officerId: 'SMC-ADMIN-01',
    passcode: 'civic2026',
    user: {
      officerId: 'SMC-ADMIN-01',
      name: 'Raghavendra Kulkarni',
      designation: 'Municipal Triage Officer',
      corporation: 'Shivamogga City Corporation',
    },
  },
  {
    officerId: 'admin@shivamogga.gov.in',
    passcode: 'shivamogga123',
    user: {
      officerId: 'admin@shivamogga.gov.in',
      name: 'Deepa Gowda',
      designation: 'Assistant Executive Engineer',
      corporation: 'Shivamogga City Corporation',
    },
  },
] as const;

export function authenticateMockAdmin(
  officerIdInput: string,
  passcodeInput: string,
): { ok: true; user: AdminUser } | { ok: false; error: string } {
  const normalizedId = officerIdInput.trim().toLowerCase();
  const trimmedPasscode = passcodeInput.trim();

  if (!normalizedId || !trimmedPasscode) {
    return {
      ok: false,
      error: 'Please enter both Officer ID / Email and Access Passcode to sign in.',
    };
  }

  const matched = DEMO_ADMIN_CREDENTIALS.find(
    (entry) =>
      entry.officerId.toLowerCase() === normalizedId && entry.passcode === trimmedPasscode,
  );

  if (!matched) {
    return {
      ok: false,
      error:
        'Invalid demo credentials. Use SMC-ADMIN-01 with passcode civic2026 (or click Fill Demo Credentials).',
    };
  }

  return { ok: true, user: matched.user };
}
