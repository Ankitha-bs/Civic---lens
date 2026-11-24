import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateMockAdmin, DEMO_ADMIN_CREDENTIALS } from './auth';

test('authenticateMockAdmin rejects empty inputs with a clear message', () => {
  const res = authenticateMockAdmin('', '');
  assert.equal(res.ok, false);
  if (!res.ok) {
    assert.match(res.error, /enter both/i);
  }
});

test('authenticateMockAdmin rejects invalid credentials', () => {
  const res = authenticateMockAdmin('wrong-user', 'wrong-pass');
  assert.equal(res.ok, false);
  if (!res.ok) {
    assert.match(res.error, /invalid demo credentials/i);
  }
});

test('authenticateMockAdmin accepts valid demo credentials case-insensitively on ID', () => {
  const demo = DEMO_ADMIN_CREDENTIALS[0];
  const res = authenticateMockAdmin(demo.officerId.toLowerCase(), demo.passcode);
  assert.equal(res.ok, true);
  if (res.ok) {
    assert.equal(res.user.officerId, demo.officerId);
    assert.equal(res.user.corporation, 'Shivamogga City Corporation');
  }
});
