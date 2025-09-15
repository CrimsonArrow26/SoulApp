export interface SoulCard {
  id: string;
  nickname: string;
  age: number;
  photos: string[];
  interests: { [key: string]: string };
  distance?: number;
  isOnline: boolean;
  lastSeen?: Date;
  mode: 'mystery' | 'normal';
}

export const DEMO_SOUL_CARDS: SoulCard[] = [
  {
    id: '1',
    nickname: 'StarGazer',
    age: 24,
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop'
    ],
    interests: {
      'Everyday Vibes': 'A perfect cup of coffee on a rainy morning',
      'Passions & Interests': 'Reading mystery novels and stargazing',
      'Values & Beliefs': 'Honesty and kindness above all',
      'Stories & Memories': 'Booked a flight to Japan with just 2 hours notice',
      'Dreams & Aspirations': 'Opening my own bookstore café'
    },
    distance: 2.5,
    isOnline: true,
    mode: 'normal'
  },
  {
    id: '2',
    nickname: 'AdventureSeeker',
    age: 26,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop'
    ],
    interests: {
      'Everyday Vibes': 'The sound of waves crashing on the shore',
      'Passions & Interests': 'Rock climbing and photography',
      'Values & Beliefs': 'Living life to the fullest',
      'Stories & Memories': 'Hitchhiked across Europe with just a backpack',
      'Dreams & Aspirations': 'Climbing Mount Everest'
    },
    distance: 5.2,
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    mode: 'normal'
  },
  {
    id: '3',
    nickname: 'MysteryWriter',
    age: 22,
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop'
    ],
    interests: {
      'Everyday Vibes': 'The smell of old books and fresh ink',
      'Passions & Interests': 'Writing poetry and painting watercolors',
      'Values & Beliefs': 'Creativity is the soul\'s language',
      'Stories & Memories': 'Published my first poem at 16',
      'Dreams & Aspirations': 'Writing a bestselling novel'
    },
    distance: 1.8,
    isOnline: true,
    mode: 'mystery'
  },
  {
    id: '4',
    nickname: 'MusicLover',
    age: 25,
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=600&fit=crop'
    ],
    interests: {
      'Everyday Vibes': 'Discovering new songs on vinyl records',
      'Passions & Interests': 'Playing guitar and collecting vintage records',
      'Values & Beliefs': 'Music connects all souls',
      'Stories & Memories': 'Performed at a local café open mic night',
      'Dreams & Aspirations': 'Recording my own album'
    },
    distance: 3.7,
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    mode: 'normal'
  },
  {
    id: '5',
    nickname: 'DreamChaser',
    age: 23,
    photos: [
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop'
    ],
    interests: {
      'Everyday Vibes': 'Sunrise yoga sessions in the park',
      'Passions & Interests': 'Meditation and sustainable living',
      'Values & Beliefs': 'Inner peace leads to outer harmony',
      'Stories & Memories': 'Lived in a monastery for a month',
      'Dreams & Aspirations': 'Starting a wellness retreat center'
    },
    distance: 4.1,
    isOnline: true,
    mode: 'mystery'
  }
];