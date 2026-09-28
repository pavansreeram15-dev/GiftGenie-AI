export type Relationship =
  | 'Friend' | 'Best Friend' | 'Girlfriend' | 'Boyfriend' | 'Mother' | 'Father'
  | 'Brother' | 'Sister' | 'Teacher' | 'Colleague' | 'Wife' | 'Husband'
  | 'Kids' | 'Pets' | 'Others';

export type Occasion =
  | 'Birthday' | 'Wedding' | 'Anniversary' | 'Valentine' | 'Christmas' | 'New Year'
  | 'Housewarming' | 'Baby Shower' | 'Graduation' | 'Promotion' | 'Farewell'
  | 'Festival' | 'Raksha Bandhan' | 'Diwali' | 'Eid' | 'Pongal'
  | "Mother's Day" | "Father's Day" | 'Friendship Day' | 'Custom';

export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';

export type Store = 'Amazon' | 'Flipkart' | 'Myntra' | 'Nykaa' | 'Ajio' | 'Croma' | 'Reliance Digital' | 'Meesho' | 'Any';

export type Personality =
  | 'Funny' | 'Introvert' | 'Extrovert' | 'Creative' | 'Minimalist' | 'Luxury Lover'
  | 'Practical' | 'Geek' | 'Adventure' | 'Romantic' | 'Professional';

export type BudgetCategory = 'Budget' | 'Mid-range' | 'Premium' | 'Luxury';

export interface PriceEntry {
  store: Store;
  price: number;
  prime: boolean;
  deliveryDays: number;
  url: string;
}

export interface GiftProduct {
  id: string;
  name: string;
  image: string;
  interests: string[];
  occasions: Occasion[];
  genders: Gender[];
  ageRange: [number, number];
  personality: Personality[];
  budgetCategory: BudgetCategory;
  store: Store;
  prices: PriceEntry[];
  rating: number;
  reviews: number;
  pros: string[];
  cons: string[];
  suitableAges: string;
  popularity: number;
  uniqueness: number;
  trendScore: number;
  socialPopularity: number;
  giftWrapping: boolean;
  tags: string[];
  story: string;
  conversationStarter: string;
}

export interface WizardForm {
  relationship: Relationship | '';
  occasion: Occasion | '';
  gender: Gender | '';
  age: number;
  budget: number;
  interests: string[];
  personality: Personality[];
  store: Store;
}

export type SortOption =
  | 'Highest Match' | 'Lowest Price' | 'Trending' | 'Luxury'
  | 'Most Unique' | 'Fast Delivery' | 'Highest Rated' | 'Best Value';

export interface Recommendation extends GiftProduct {
  matchScore: number;
  reasons: string[];
  explanation: string;
  emotionPrediction: string;
  happinessMeter: number;
  compatibilityScore: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  gifts?: Recommendation[];
}
