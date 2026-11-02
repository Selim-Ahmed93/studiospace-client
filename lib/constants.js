export const STUDIO_CATEGORIES = [
  {
    value: "Photography Studio",
    label: "Photo Studios",
    description: "Natural light, backdrops, and professional lighting.",
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&q=80",
    icon: "camera",
  },
  {
    value: "Sound Stage",
    label: "Sound Stages",
    description: "Large, treated rooms built for film and production.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80",
    icon: "clapperboard",
  },
  {
    value: "Podcast Room",
    label: "Podcast Rooms",
    description: "Quiet, acoustically treated spaces for clear audio.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&q=80",
    icon: "mic",
  },
  {
    value: "Music Studio",
    label: "Music Suites",
    description: "Recording, mixing, and rehearsal rooms with gear.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80",
    icon: "music",
  },
  {
    value: "Art Workshop",
    label: "Art Workshops",
    description: "Flexible, light-filled spaces for making and teaching.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80",
    icon: "palette",
  },
];

export const CATEGORY_VALUES = STUDIO_CATEGORIES.map(
  (category) => category.value
);

export const AMENITY_SUGGESTIONS = [
  "Natural Light",
  "Blackout Curtains",
  "Backdrop",
  "Lighting Kit",
  "Cyclorama",
  "Air Conditioning",
  "Wi-Fi",
  "Parking",
  "Green Room",
  "Soundproofing",
  "Mixing Console",
  "Microphones",
  "Instruments",
  "Piano",
  "Projector",
  "Kitchen",
  "Wheelchair Access",
];

export const BOOKING_STATUS_STYLES = {
  Pending:
    "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  Confirmed:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
  Completed:
    "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300",
  Cancelled:
    "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300",
};

export const HERO_SLIDES = [
  {
    eyebrow: "Your creative space starts here",
    title: "Find the perfect space for your creative vision",
    description:
      "Discover photography lofts, sound stages, podcast rooms, and production spaces across Bangladesh — booked by the hour.",
    image:
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=2000&q=80",
    imageAlt: "Photographer working in a bright creative studio",
  },
  {
    eyebrow: "Built for production",
    title: "Sound stages that keep up with big ideas",
    description:
      "Book treated rooms, reliable power, and the space your crew needs — without long-term leases or hidden fees.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=2000&q=80",
    imageAlt: "Music and sound production studio with professional equipment",
  },
  {
    eyebrow: "Press record",
    title: "Podcast rooms that sound as good as they look",
    description:
      "Quiet, ready-to-record spaces with the right acoustics, microphones, and comfort for long sessions.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=2000&q=80",
    imageAlt: "Professional podcast microphone in a recording room",
  },
];
