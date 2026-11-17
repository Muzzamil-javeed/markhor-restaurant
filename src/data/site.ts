export type DayHours = {
  id: string;
  days: string;
  /** 0 = Sunday … 6 = Saturday. */
  dayIndexes: number[];
  opens: string;
  closes: string;
  closesNextDay: boolean;
  label: string;
};

export type Offer = {
  id: string;
  name: string;
  code: string;
  percentOff: number;
  summary: string;
  appliesTo: "all" | "delivery";
  window?: { start: string; end: string };
};

export type TablePerk = {
  id: string;
  title: string;
  body: string;
};

export type GuestReview = {
  id: string;
  author: string;
  role?: string;
  quote: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export const site = {
  name: "Markhor Restaurant",
  tagline: "“idk, you pick” ends here.",
  loaderTagline:
    "Western food · DHA Phase 6, Karachi · Smoked low and slow",
  meta: "Burgers, steaks, tacos, pasta and smoked brisket in DHA Phase 6, Karachi. Open daily from 12:30 PM.",
  address:
    "Shop 1, Plot 11C Khayaban-e-Nishat, D.H.A Phase 6, Defence Housing Authority, Karachi, 75500",
  phone: "+92 332 2396608",
  instagram: "https://www.instagram.com/markhor.restaurant/",
  facebook: "https://www.facebook.com/Markhor.restaurant/",
  directions:
    "https://www.google.com/maps/search/?api=1&query=Markhor+Smoked+Meat&query_place_id=ChIJj-loet89sz4RwRJAHs_Ku0Y",
  reviewsUrl:
    "https://www.google.com/maps/place/Markhor+Smoked+Meat/@24.800423,67.0666509,17z/data=!4m8!3m7!1s0x3eb33ddf7a68e98f:0x46bbcacf1e4012c1!9m1!1b1",
  timezone: "Asia/Karachi",
  hours: [
    {
      id: "sun-thu",
      days: "Sun to Thu",
      dayIndexes: [0, 1, 2, 3, 4],
      opens: "12:30",
      closes: "00:30",
      closesNextDay: true,
      label: "12:30 PM to 12:30 AM",
    },
    {
      id: "fri-sat",
      days: "Fri and Sat",
      dayIndexes: [5, 6],
      opens: "12:30",
      closes: "01:30",
      closesNextDay: true,
      label: "12:30 PM to 1:30 AM",
    },
  ] satisfies DayHours[],
  offers: [
    {
      id: "lunch25",
      name: "Lunch special",
      code: "lunch25",
      percentOff: 25,
      summary: "25% off, daily 1 PM to 4 PM",
      appliesTo: "all",
      window: { start: "13:00", end: "16:00" },
    },
    {
      id: "deliver20",
      name: "Delivery discount",
      code: "deliver20",
      percentOff: 20,
      summary: "20% off on delivery orders",
      appliesTo: "delivery",
    },
  ] satisfies Offer[],
  perks: [
    {
      id: "insta-story",
      title: "Post an Insta story, unlock a surprise",
      body: "Share your Markhor experience on your Instagram story and unlock a surprise.",
    },
    {
      id: "complimentary-tea",
      title: "Complimentary tea or green tea",
      body: "A hot cup on us. Just ask our staff. Available when we are not too busy.",
    },
    {
      id: "uno-or-jenga",
      title: "Uno or Jenga",
      body: "Make it a game night. Ask our staff for a deck of Uno or a Jenga tower to play at your table.",
    },
  ] satisfies TablePerk[],
  reviews: [
    {
      id: "kanza-amjad",
      author: "Kanza Amjad",
      quote:
        "This has become one of my go-to places for meat. The tacos, steak, and mac and cheese are consistently fresh and full of flavour.",
    },
    {
      id: "maidah-ahmed",
      author: "Maidah Ahmed",
      quote:
        "The staff gave us a warm, welcoming greeting. The food was delicious.",
    },
    {
      id: "abdullah-raheel",
      author: "Abdullah Raheel",
      quote:
        "The beef tenderloin was cooked perfectly. It is a little expensive, but worth it.",
    },
    {
      id: "salmaan-saleem",
      author: "Salmaan Saleem",
      quote:
        "Loved the wooden interior. Service was friendly, and the portions were great.",
    },
    {
      id: "faraz-siddiqui",
      author: "Faraz Siddiqui",
      role: "Local Guide",
      quote:
        "Delicious food, about Rs. 2,000 per person, with a good atmosphere.",
    },
  ] satisfies GuestReview[],
  footer: {
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Contact", href: "/contact" },
    ] satisfies FooterLink[],
    note: "Prices are exclusive of GST. Items are subject to availability.",
  },
};
