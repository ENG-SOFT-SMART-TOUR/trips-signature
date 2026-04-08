export type { Destination, Activity } from './types';
export { destinations } from './destinations';
export { activityTemplates } from './activityTemplates';

import type { Activity } from './types';
import { destinations } from './destinations';
import { activityTemplates } from './activityTemplates';

const categories = ['Sightseeing', 'Food & Drink', 'Nature', 'Adventure', 'Culture', 'Shopping'];
const shifts: ('morning' | 'afternoon' | 'evening')[] = ['morning', 'afternoon', 'evening'];

export const activities: Activity[] = destinations.flatMap((dest) => {
  const template = activityTemplates[dest.id];
  if (!template) return [];
  return template.names.map((name, i) => ({
    id: `${dest.id}-a${i + 1}`,
    destinationId: dest.id,
    name,
    category: categories[i % categories.length],
    duration: `${1 + (i % 3) + 1}h`,
    shift: shifts[i % 3],
    description: template.descriptions[i],
    address: `${name}, ${dest.name}, ${dest.country}`,
    tips: `Best to visit during ${shifts[i % 3]}. Bring comfortable shoes and water.`,
    images: [
      `https://picsum.photos/seed/${dest.id}-${i}-1/800/600`,
      `https://picsum.photos/seed/${dest.id}-${i}-2/800/600`,
      `https://picsum.photos/seed/${dest.id}-${i}-3/800/600`,
    ],
    latitude: template.coords[i][0],
    longitude: template.coords[i][1],
  }));
});

export function getDestinationActivities(destId: string): Activity[] {
  return activities.filter(a => a.destinationId === destId);
}

export function getActivity(id: string): Activity | undefined {
  return activities.find(a => a.id === id);
}

export function getDestination(id: string) {
  return destinations.find(d => d.id === id);
}

export function calculateMatch(userTags: string[], destTags: string[]): number {
  if (userTags.length === 0) return Math.floor(Math.random() * 30 + 60);
  const matches = destTags.filter(t => userTags.includes(t)).length;
  return Math.min(100, Math.floor((matches / Math.max(destTags.length, userTags.length)) * 100 + 30));
}
