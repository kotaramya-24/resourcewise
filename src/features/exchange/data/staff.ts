// From users.csv: each school's lister (posts items and needs) and approver (signs off handoffs).
export const SCHOOL_STAFF: Record<string, { lister: string; approver: string }> = {
  S01: { lister: 'Maria Alvarez', approver: 'Grace Lindqvist' },
  S02: { lister: 'Daniel Okafor', approver: 'Omar Haddad' },
  S03: { lister: 'Priya Raman', approver: 'Nina Petrova' },
  S04: { lister: 'Tom Whitfield', approver: 'Caleb Foster' },
  S05: { lister: 'Lena Novak', approver: 'Yuki Tanaka' },
  S06: { lister: 'Marcus Bell', approver: 'Rosa Delgado' },
  S07: { lister: 'Aisha Karim', approver: 'Ethan Brooks' },
  S08: { lister: 'Ben Hartley', approver: 'Hannah Weiss' },
  S09: { lister: 'Sofia Marino', approver: 'Kofi Mensah' },
  S10: { lister: 'Jonah Reyes', approver: 'Isla Murray' },
};
