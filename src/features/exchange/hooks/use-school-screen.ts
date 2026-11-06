import { Presets } from 'react-native-pulsar';

import { SCHOOL_STAFF } from '@/features/exchange/data/staff';
import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { confirmDelete } from '@/lib/confirm';

export function useSchoolScreen() {
  const schools = useExchangeStore((s) => s.schools);
  const items = useExchangeStore((s) => s.items);
  const needs = useExchangeStore((s) => s.needs);
  const claims = useExchangeStore((s) => s.claims);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);
  const approveClaim = useExchangeStore((s) => s.approveClaim);
  const declineClaim = useExchangeStore((s) => s.declineClaim);
  const resetDemo = useExchangeStore((s) => s.resetDemo);

  const school = schools.find((x) => x.school_id === activeSchoolID);
  const staff = SCHOOL_STAFF[activeSchoolID];
  const schoolName = (id: string) => schools.find((x) => x.school_id === id)?.name ?? id;
  const itemFor = (id: string) => items.find((i) => i.item_id === id);

  const incoming = claims.filter((c) => c.from_school_id === activeSchoolID && c.status === 'pending');
  const outgoing = claims.filter((c) => c.to_school_id === activeSchoolID);
  const listings = items.filter((i) => i.school_id === activeSchoolID);
  const myNeeds = needs.filter((n) => n.school_id === activeSchoolID);

  const approve = (claimID: string) => {
    approveClaim(claimID);
    Presets.System.notificationSuccess();
  };

  const decline = (claimID: string) =>
    confirmDelete({
      title: 'Decline this request?',
      message: 'The quantity goes back on your listing.',
      confirmLabel: 'Decline',
      onConfirm: () => declineClaim(claimID),
    });

  const reset = () =>
    confirmDelete({
      title: 'Reset the demo data?',
      message: 'All claims, new listings and new needs are cleared, and the original 60 items and 50 needs come back.',
      confirmLabel: 'Reset data',
      onConfirm: resetDemo,
    });

  return { school, staff, schoolName, itemFor, incoming, outgoing, listings, myNeeds, approve, decline, reset };
}
