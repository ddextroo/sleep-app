// Audio files from Supabase storage
const SUPABASE_URL = "https://fivneiunnsbodehcledx.supabase.co/storage/v1/object/public/hagocstorage";

export const storyAudioFiles = [
  // Love Radio stories
  `${SUPABASE_URL}/listen_stories/djraqi1.mp3`,
  `${SUPABASE_URL}/listen_stories/djraqi2.mp3`,
  `${SUPABASE_URL}/listen_stories/djraqi3.mp3`,
  
  // Reddit stories
  `${SUPABASE_URL}/listen_stories/reddit1.mp3`,
  `${SUPABASE_URL}/listen_stories/reddit2.mp3`,
  
  // Horror stories
  `${SUPABASE_URL}/listen_stories/parkinglot.mp3`,
  `${SUPABASE_URL}/listen_stories/dalampasigan.mp3`,
  
  // Kids stories
  `${SUPABASE_URL}/listen_stories/firefly.mp3`,
  `${SUPABASE_URL}/listen_stories/elephant.mp3`,
];

export const storyCategories = {
  general: [0, 1, 2],
  reddit: [3, 4],
  horror: [5, 6],
  kids: [7, 8],
};