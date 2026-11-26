export type TeamChoice = 'maison' | 'restau';

export interface RestaurantOption {
  id: string;
  name: string;
  district: string;
  fullLabel: string;
}

export interface InvitationSubmission {
  firstName: string;
  team: TeamChoice;
  restaurantId: string | null;
  note: string;
  submittedAt: string;
}

export const EVENT_DETAILS = {
  eyebrow: 'Une parenthèse joyeuse',
  title: 'Repas Familial du 25 Décembre',
  dateLabel: '25 Décembre',
  timeLabel: '13h00',
  contributionLabel: '15 000 FCFA / personne',
  majorityRule: "La majorité l'emporte évidemment",
  whatsappDisplay: '+237 99000811',
  whatsappDigits: '23799000811',
} as const;

export const RESTAURANTS: readonly RestaurantOption[] = [
  {
    id: 'chez-wou',
    name: 'Chez Wou',
    district: 'Bastos',
    fullLabel: 'Chez Wou (Bastos)',
  },
  {
    id: 'roof-top-sky-view',
    name: 'Roof Top Sky View',
    district: 'Tongolo',
    fullLabel: 'Roof Top Sky View (Tongolo)',
  },
  {
    id: 'steak-house',
    name: 'Steak House',
    district: 'Bastos',
    fullLabel: 'Steak House (Bastos)',
  },
  {
    id: 'le-tassa',
    name: 'Le Tassa',
    district: 'Bastos',
    fullLabel: 'Le Tassa (Bastos)',
  },
] as const;

export const STORAGE_KEY = 'repas-familial-25-dec-rsvp-v1';

export function buildWhatsAppMessage(submission: InvitationSubmission): string {
  const restaurant = RESTAURANTS.find((r) => r.id === submission.restaurantId);
  const teamText = submission.team === 'maison' ? 'Team Maison' : 'Team Restau';

  const lines: string[] = [
    `*${EVENT_DETAILS.title}*`,
    `Heure : ${EVENT_DETAILS.timeLabel} | Participation : ${EVENT_DETAILS.contributionLabel}`,
    '',
    `Prénom : ${submission.firstName.trim()}`,
    `Choix : ${teamText}`,
  ];

  if (submission.team === 'restau' && restaurant) {
    lines.push(`Restaurant choisi : ${restaurant.fullLabel}`);
  }

  if (submission.note.trim()) {
    lines.push(`Message : ${submission.note.trim()}`);
  }

  lines.push('', `_${EVENT_DETAILS.majorityRule}_`);

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${EVENT_DETAILS.whatsappDigits}?text=${encodeURIComponent(message)}`;
}
