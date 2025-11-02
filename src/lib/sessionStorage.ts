import { SessionData } from '@/types/miras';

const SESSION_KEY = 'miras_session_data';

export function saveSession(data: SessionData): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function loadSession(): SessionData | null {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

export function createInitialSession(): SessionData {
  return {
    sessionId: crypto.randomUUID(),
    state: 'IL',
    date: new Date().toISOString().split('T')[0],
    decedent: {
      name: '',
      relationToUser: 'self'
    },
    family: [],
    assets: [],
    preferences: {
      wasiyyahPercent: 0,
      charityPercent: 0,
      executor: '',
      guardian: '',
      fiqhMode: 'sunni'
    },
    computed: {
      probateEstateValue: 0,
      nonProbateValue: 0,
      shariaShares: [],
      stateFlags: [],
      actionItems: []
    },
    disclaimerAccepted: false
  };
}

export function loadDemoData(): SessionData {
  return {
    sessionId: crypto.randomUUID(),
    state: 'IL',
    date: new Date().toISOString().split('T')[0],
    decedent: {
      name: 'Ahmad Khan',
      relationToUser: 'self'
    },
    family: [
      {
        id: crypto.randomUUID(),
        relation: 'spouse',
        name: 'Fatima Khan',
        sex: 'female',
        alive: true,
        adopted: false
      },
      {
        id: crypto.randomUUID(),
        relation: 'child',
        name: 'Hassan Khan',
        sex: 'male',
        alive: true,
        adopted: false
      },
      {
        id: crypto.randomUUID(),
        relation: 'child',
        name: 'Aisha Khan',
        sex: 'female',
        alive: true,
        adopted: false
      }
    ],
    assets: [
      {
        id: crypto.randomUUID(),
        name: 'Primary Home',
        type: 'real_estate',
        value: 450000,
        ownerType: 'sole',
        beneficiaries: [],
        acquiredDuringMarriage: true,
        notes: 'Family residence'
      },
      {
        id: crypto.randomUUID(),
        name: '401(k) Account',
        type: 'retirement',
        value: 280000,
        ownerType: 'sole',
        beneficiaries: [{ name: 'Fatima Khan', percent: 100 }],
        acquiredDuringMarriage: true,
        notes: 'Employer retirement account'
      },
      {
        id: crypto.randomUUID(),
        name: 'Savings Account',
        type: 'bank_account',
        value: 45000,
        ownerType: 'sole',
        beneficiaries: [],
        acquiredDuringMarriage: true,
        notes: 'Emergency fund'
      }
    ],
    preferences: {
      wasiyyahPercent: 10,
      charityPercent: 0,
      executor: 'Fatima Khan',
      guardian: 'Uncle Ibrahim',
      fiqhMode: 'sunni'
    },
    computed: {
      probateEstateValue: 0,
      nonProbateValue: 0,
      shariaShares: [],
      stateFlags: [],
      actionItems: []
    },
    disclaimerAccepted: true
  };
}
