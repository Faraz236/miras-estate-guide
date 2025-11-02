import { FamilyMember, Asset, Preferences, ShariaShare, StateFlag, ActionItem } from '@/types/miras';

interface Fraction {
  numerator: number;
  denominator: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyFraction(num: number, den: number): Fraction {
  const divisor = gcd(Math.abs(num), Math.abs(den));
  return {
    numerator: num / divisor,
    denominator: den / divisor
  };
}

function fractionToString(frac: Fraction): string {
  if (frac.denominator === 1) return frac.numerator.toString();
  return `${frac.numerator}/${frac.denominator}`;
}

function fractionToPercent(frac: Fraction): number {
  return (frac.numerator / frac.denominator) * 100;
}

export function computeSharia(
  family: FamilyMember[],
  assets: Asset[],
  preferences: Preferences
) {
  const shares: ShariaShare[] = [];
  const stateFlags: StateFlag[] = [];
  const actionItems: ActionItem[] = [];

  // Calculate probate vs non-probate
  const probateAssets = assets.filter(a => 
    a.ownerType === 'sole' && a.beneficiaries.length === 0
  );
  
  const nonProbateAssets = assets.filter(a => 
    a.ownerType !== 'sole' || a.beneficiaries.length > 0
  );

  const probateEstateValue = probateAssets.reduce((sum, a) => sum + a.value, 0);
  const nonProbateValue = nonProbateAssets.reduce((sum, a) => sum + a.value, 0);

  // Get living heirs
  const livingHeirs = family.filter(f => f.alive);
  const spouse = livingHeirs.find(f => f.relation === 'spouse');
  const children = livingHeirs.filter(f => f.relation === 'child');
  const parents = livingHeirs.filter(f => f.relation === 'parent');
  const siblings = livingHeirs.filter(f => f.relation === 'sibling');

  // Sunni Sharia calculation
  let fixedShares: Map<string, Fraction> = new Map();
  
  // Spouse share
  if (spouse) {
    if (children.length > 0) {
      // Spouse gets 1/8 if children exist
      fixedShares.set(spouse.id, { numerator: 1, denominator: 8 });
      shares.push({
        heirId: spouse.id,
        heirName: spouse.name || 'Spouse',
        relation: 'Spouse',
        fraction: '1/8',
        percentage: 12.5,
        explanation: 'Spouse receives 1/8 because children are present'
      });
    } else {
      // Spouse gets 1/4 if no children
      fixedShares.set(spouse.id, { numerator: 1, denominator: 4 });
      shares.push({
        heirId: spouse.id,
        heirName: spouse.name || 'Spouse',
        relation: 'Spouse',
        fraction: '1/4',
        percentage: 25,
        explanation: 'Spouse receives 1/4 because no children are present'
      });
    }
  }

  // Parents share
  if (parents.length > 0) {
    if (children.length > 0) {
      // Each parent gets 1/6 if children exist
      parents.forEach(parent => {
        fixedShares.set(parent.id, { numerator: 1, denominator: 6 });
        shares.push({
          heirId: parent.id,
          heirName: parent.name || 'Parent',
          relation: 'Parent',
          fraction: '1/6',
          percentage: 16.67,
          explanation: 'Parent receives 1/6 because children are present'
        });
      });
    } else {
      // More complex rules when no children - simplified for MVP
      parents.forEach(parent => {
        fixedShares.set(parent.id, { numerator: 1, denominator: 3 });
        shares.push({
          heirId: parent.id,
          heirName: parent.name || 'Parent',
          relation: 'Parent',
          fraction: '1/3',
          percentage: 33.33,
          explanation: 'Parent receives 1/3 share (no children present)'
        });
      });
    }
  }

  // Calculate remaining for children
  if (children.length > 0) {
    // Sum up fixed shares
    let totalFixed = 0;
    fixedShares.forEach(frac => {
      totalFixed += frac.numerator / frac.denominator;
    });

    const remainingFraction = 1 - totalFixed;
    
    // Count male and female children
    const sons = children.filter(c => c.sex === 'male').length;
    const daughters = children.filter(c => c.sex === 'female').length;
    
    // Total units: each son = 2, each daughter = 1
    const totalUnits = (sons * 2) + daughters;
    
    if (totalUnits > 0) {
      children.forEach(child => {
        const units = child.sex === 'male' ? 2 : 1;
        const childShare = (units / totalUnits) * remainingFraction;
        const childFraction = simplifyFraction(
          Math.round(childShare * 1000),
          1000
        );
        
        shares.push({
          heirId: child.id,
          heirName: child.name || (child.sex === 'male' ? 'Son' : 'Daughter'),
          relation: child.sex === 'male' ? 'Son' : 'Daughter',
          fraction: fractionToString(childFraction),
          percentage: childShare * 100,
          explanation: child.sex === 'male' 
            ? 'Son receives double the share of daughters (2:1 ratio)'
            : 'Daughter receives half the share of sons (1:2 ratio)'
        });
      });
    }
  }

  // Check for non-probate assets and flag them
  if (nonProbateAssets.length > 0) {
    stateFlags.push({
      type: 'error',
      title: 'Non-probate assets detected',
      description: 'These assets will pass outside any will. Update beneficiary designations or name a Trust as beneficiary.',
      assets: nonProbateAssets.map(a => a.id)
    });

    actionItems.push({
      priority: 1,
      title: 'Update non-probate asset beneficiaries',
      description: 'Review and update beneficiary designations on retirement accounts, life insurance, and jointly-owned property.',
      script: 'Sample message to HR: "I would like to update the beneficiary designation on my 401(k) account. Please send me the necessary forms."'
    });
  }

  // Check for joint tenancy with spouse
  const jointWithSpouse = assets.filter(a => 
    a.ownerType === 'joint_tenancy' && spouse
  );
  
  if (jointWithSpouse.length > 0) {
    stateFlags.push({
      type: 'warning',
      title: 'Joint tenancy property detected',
      description: 'Property in joint tenancy passes directly to the surviving joint owner, bypassing your will. Consider retitling to trust.',
      assets: jointWithSpouse.map(a => a.id)
    });
  }

  // Check spousal elective share for Illinois
  if (spouse && children.length > 0) {
    stateFlags.push({
      type: 'warning',
      title: 'Illinois spousal statutory share',
      description: 'Illinois law allows a surviving spouse to claim approximately 1/3 of the estate. This may override your will provisions. Consult an attorney.',
    });

    actionItems.push({
      priority: 2,
      title: 'Schedule attorney consultation',
      description: 'Discuss the Illinois spousal elective share and how it affects your estate plan.',
      script: 'Email template: "I am planning my estate and would like to discuss the Illinois spousal elective share provisions. I have prepared an Action Packet. Can we schedule a one-hour consultation?"'
    });
  }

  // Check wasiyyah limit
  if (preferences.wasiyyahPercent > 33.33) {
    stateFlags.push({
      type: 'error',
      title: 'Wasiyyah exceeds 33% limit',
      description: 'Under Sunni fiqh, bequests to non-heirs (wasiyyah) are typically limited to 1/3 of the estate. Amounts over this may require heirs\' consent.',
    });

    actionItems.push({
      priority: 1,
      title: 'Reduce wasiyyah or obtain heirs\' consent',
      description: 'Either reduce your wasiyyah to 33% or less, or obtain written consent from all heirs for the higher amount.',
    });
  }

  // Add attorney consultation to action items
  if (actionItems.length === 0) {
    actionItems.push({
      priority: 3,
      title: 'Initial attorney consultation',
      description: 'Even with no conflicts detected, consult an Illinois estate attorney to review your plan.',
      script: 'Bring your Action Packet and asset documentation to discuss will preparation and trust options.'
    });
  }

  return {
    probateEstateValue,
    nonProbateValue,
    shariaShares: shares,
    stateFlags,
    actionItems: actionItems.sort((a, b) => a.priority - b.priority)
  };
}
