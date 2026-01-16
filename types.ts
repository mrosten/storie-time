
export enum StoryTheme {
  SPACE = 'Space Adventure',
  FANTASY = 'Magical Forest',
  ANIMALS = 'Friendly Animals',
  OCEAN = 'Deep Sea Wonders',
  DINOSAURS = 'Dino World',
  DREAMS = 'Dreamy Clouds',
  CANDY = 'Candy Kingdom',
  TOYS = 'Toy Factory',
  CASTLE = 'Ancient Castle',
  GARDEN = 'Secret Garden',
  HEROES = 'Superhero City',
  TIME = 'Time Travel'
}

export enum StoryMood {
  CALM = 'Soothing & Calm',
  ADVENTURE = 'Exciting Adventure',
  FUNNY = 'Silly & Funny',
  GENTLE = 'Gentle & Soft',
  MYSTERY = 'Mystery & Wonder',
  BRAVE = 'Brave & Bold',
  LEARN = 'Learning & Discovery'
}

export enum StoryLength {
  SHORT = 'Short (2 mins)',
  MEDIUM = 'Medium (5 mins)',
  LONG = 'Long (10 mins)'
}

export enum TargetAge {
  TODDLER = 'Tiny Tot (1-3)',
  PRESCHOOL = 'Little Dreamer (4-6)',
  SCHOOL = 'Big Explorer (7-9)',
  TEEN = 'Young Sage (10+)'
}

export enum MagicIngredient {
  DRAGON = 'A Friendly Dragon',
  FRIENDSHIP = 'Value of Friendship',
  MAGIC = 'A Magic Wand',
  LESSON = 'A Life Lesson',
  NIGHT = 'A Starry Night',
  MUSIC = 'Magical Music'
}

export interface StoryState {
  title: string;
  content: string;
  audioData?: string;
  isLoading: boolean;
  error?: string;
}
