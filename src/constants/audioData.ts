// Audio files from Supabase storage
const SUPABASE_URL = "https://fivneiunnsbodehcledx.supabase.co/storage/v1/object/public/hagocstorage";

export const audioFiles = [
  // Nature sounds
  `${SUPABASE_URL}/calming_sounds/nature1.mp3`,
  `${SUPABASE_URL}/calming_sounds/nature2.mp3`,
  `${SUPABASE_URL}/calming_sounds/nature3.mp3`,
  `${SUPABASE_URL}/calming_sounds/nature4.mp3`,
  `${SUPABASE_URL}/calming_sounds/nature5.mp3`,
  
  // Meditation sounds
  `${SUPABASE_URL}/calming_sounds/meditation1.mp3`,
  `${SUPABASE_URL}/calming_sounds/meditation2.mp3`,
  
  // Sleep sounds
  `${SUPABASE_URL}/calming_sounds/sleep1.mp3`,
  `${SUPABASE_URL}/calming_sounds/sleep2.mp3`,
  `${SUPABASE_URL}/calming_sounds/sleep3.mp3`,
];

export const audioCategories = {
  nature: [0, 1, 2, 3, 4],
  meditation: [5, 6],
  sleep: [7, 8, 9],
};