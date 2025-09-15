export interface InterestCard {
  id: string;
  title: string;
  prompt: string;
  emoji: string;
}

export const INTEREST_CARDS: InterestCard[] = [
  {
    id: '1',
    title: 'Everyday Vibes',
    prompt: 'The small thing that always makes me smile is…',
    emoji: '😊'
  },
  {
    id: '2',
    title: 'Passions & Interests',
    prompt: 'Pick the creative scenes you vibe with (choose many):',
    emoji: '🎯'
  },
  {
    id: '3',
    title: 'Values & Beliefs',
    prompt: 'One value I\'d never compromise on is…',
    emoji: '💎'
  },
  {
    id: '4',
    title: 'Stories & Memories',
    prompt: 'Which hobbies keep you energized (choose many):',
    emoji: '✨'
  },
  {
    id: '5',
    title: 'Dreams & Aspirations',
    prompt: 'One thing I\'m looking forward to is…',
    emoji: '🌟'
  }
];