export interface SessionData {
  sessionId: string;
  state: string;
  date: string;
  decedent: {
    name: string;
    relationToUser: 'self' | 'spouse' | 'executor' | 'other';
  };
  family: FamilyMember[];
  assets: Asset[];
  preferences: Preferences;
  computed: ComputedResults;
  disclaimerAccepted: boolean;
}

export interface FamilyMember {
  id: string;
  relation: 'spouse' | 'parent' | 'child' | 'sibling' | 'other';
  name: string;
  sex: 'male' | 'female' | 'other';
  alive: boolean;
  adopted?: boolean;
  deceasedChildren?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  type: 'real_estate' | 'bank_account' | 'retirement' | 'life_insurance' | 'personal_property' | 'business_interest' | 'other';
  value: number;
  ownerType: 'sole' | 'joint_tenancy' | 'tenancy_in_common' | 'trust';
  beneficiaries: Beneficiary[];
  acquiredDuringMarriage: boolean;
  notes: string;
}

export interface Beneficiary {
  name: string;
  percent: number;
}

export interface Preferences {
  wasiyyahPercent: number;
  charityPercent: number;
  charityAmount?: number;
  executor: string;
  guardian: string;
  fiqhMode: 'sunni' | 'shia';
}

export interface ComputedResults {
  probateEstateValue: number;
  nonProbateValue: number;
  shariaShares: ShariaShare[];
  stateFlags: StateFlag[];
  actionItems: ActionItem[];
}

export interface ShariaShare {
  heirId: string;
  heirName: string;
  relation: string;
  fraction: string;
  percentage: number;
  explanation: string;
}

export interface StateFlag {
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  assets?: string[];
}

export interface ActionItem {
  priority: number;
  title: string;
  description: string;
  script?: string;
}
