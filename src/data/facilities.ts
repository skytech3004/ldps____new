export type FacilitySeed = {
  name: string;
  code: string;
  fallback: string;
  sortOrder: number;
};

export const defaultFacilities: FacilitySeed[] = [
  { name: "Artificial Intelligence", code: "DSC05229", fallback: "/lps-vidhyawadi/gallery-01.jpg", sortOrder: 1 },
  { name: "Robotics Lab", code: "DSC05252", fallback: "/lps-vidhyawadi/gallery-02.jpg", sortOrder: 2 },
  { name: "Aeronautics Lab", code: "ENTP", fallback: "/lps-vidhyawadi/gallery-03.jpg", sortOrder: 3 },
  { name: "Financial Literacy and Entrepreneurship", code: "DSC07324", fallback: "/lps-vidhyawadi/gallery-04.jpg", sortOrder: 4 },
  { name: "Abacus and Vedic Maths", code: "DSC08576", fallback: "/lps-vidhyawadi/gallery-05.jpg", sortOrder: 5 },
  { name: "Smart Classes", code: "DSC08589", fallback: "/lps-vidhyawadi/gallery-06.jpg", sortOrder: 6 },
  { name: "English Communication", code: "DSC05324", fallback: "/lps-vidhyawadi/gallery-07.jpg", sortOrder: 7 },
  { name: "Physics Lab", code: "DSC08551", fallback: "/lps-vidhyawadi/gallery-08.jpg", sortOrder: 8 },
  { name: "Chemistry Lab", code: "DSC05352", fallback: "/lps-vidhyawadi/gallery-09.jpg", sortOrder: 9 },
  { name: "Biology Lab", code: "C8397T01", fallback: "/lps-vidhyawadi/gallery-10.jpg", sortOrder: 10 },
  { name: "Computer Lab", code: "C8429T01", fallback: "/lps-vidhyawadi/gallery-11.jpg", sortOrder: 11 },
  { name: "Mathematics Lab", code: "remedial class", fallback: "/lps-vidhyawadi/gallery-12.jpg", sortOrder: 12 },
  { name: "Remedial classes", code: "Taekwondo", fallback: "/lps-vidhyawadi/gallery-01.jpg", sortOrder: 13 },
  { name: "Taekwondo", code: "C8262T01", fallback: "/lps-vidhyawadi/gallery-02.jpg", sortOrder: 14 },
  { name: "Library", code: "Library", fallback: "/lps-vidhyawadi/gallery-03.jpg", sortOrder: 15 },
];
