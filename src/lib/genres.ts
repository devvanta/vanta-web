export type Genre = {
  slug: string;
  label: string;
  /** Tailwind classes pro badge: bg + text + border */
  badgeClass: string;
};

export const genres: Genre[] = [
  {
    slug: "eletronica",
    label: "Eletrônica",
    badgeClass:
      "bg-purple-500/15 text-purple-200 border border-purple-400/30",
  },
  {
    slug: "techno",
    label: "Techno",
    badgeClass:
      "bg-purple-500/15 text-purple-200 border border-purple-400/30",
  },
  {
    slug: "funk",
    label: "Funk",
    badgeClass: "bg-pink-500/15 text-pink-200 border border-pink-400/30",
  },
  {
    slug: "sertanejo",
    label: "Sertanejo",
    badgeClass: "bg-pink-500/15 text-pink-200 border border-pink-400/30",
  },
  {
    slug: "samba",
    label: "Samba",
    badgeClass: "bg-amber-500/15 text-amber-200 border border-amber-400/30",
  },
  {
    slug: "pagode",
    label: "Pagode",
    badgeClass: "bg-amber-500/15 text-amber-200 border border-amber-400/30",
  },
  {
    slug: "rock",
    label: "Rock",
    badgeClass: "bg-red-500/15 text-red-200 border border-red-400/30",
  },
  {
    slug: "pop",
    label: "Pop",
    badgeClass: "bg-blue-500/15 text-blue-200 border border-blue-400/30",
  },
  {
    slug: "rap",
    label: "Rap / Hip Hop",
    badgeClass:
      "bg-orange-500/15 text-orange-200 border border-orange-400/30",
  },
  {
    slug: "reggae",
    label: "Reggae",
    badgeClass:
      "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30",
  },
  {
    slug: "jazz",
    label: "Jazz",
    badgeClass: "bg-cyan-500/15 text-cyan-200 border border-cyan-400/30",
  },
  {
    slug: "mpb",
    label: "MPB",
    badgeClass: "bg-teal-500/15 text-teal-200 border border-teal-400/30",
  },
  {
    slug: "forro",
    label: "Forró",
    badgeClass:
      "bg-yellow-500/15 text-yellow-200 border border-yellow-400/30",
  },
  {
    slug: "house",
    label: "House",
    badgeClass:
      "bg-purple-500/15 text-purple-200 border border-purple-400/30",
  },
];

export const genreBySlug = new Map(genres.map((g) => [g.slug, g]));
