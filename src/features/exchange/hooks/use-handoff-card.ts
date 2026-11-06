import { useState } from 'react';
import { Presets } from 'react-native-pulsar';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import type { Claim } from '@/features/exchange/types/exchange';

export function useHandoffCard(claim: Claim) {
  const item = useExchangeStore((s) => s.items.find((i) => i.item_id === claim.item_id));
  const schools = useExchangeStore((s) => s.schools);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);
  const verifyHandoff = useExchangeStore((s) => s.verifyHandoff);
  const [error, setError] = useState<string | null>(null);

  const schoolName = (id: string) => schools.find((x) => x.school_id === id)?.name ?? id;
  const giving = claim.from_school_id === activeSchoolID;
  const myVerifier = giving ? claim.from_verified_by : claim.to_verified_by;
  const otherSchoolID = giving ? claim.to_school_id : claim.from_school_id;

  const verify = () => {
    const result = verifyHandoff(claim.claim_id);
    if (!result.ok) {
      Presets.System.notificationError();
      setError(result.error);
      return;
    }
    setError(null);
    if (result.transferred) {
      Presets.System.notificationSuccess();
      return;
    }
    Presets.System.impactMedium();
  };

  return {
    item,
    giving,
    fromName: schoolName(claim.from_school_id),
    toName: schoolName(claim.to_school_id),
    otherName: schoolName(otherSchoolID),
    iVerified: Boolean(myVerifier),
    error,
    verify,
  };
}
