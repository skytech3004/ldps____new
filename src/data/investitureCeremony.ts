export type InvestitureCeremonyPhoto = {
  src: string;
  alt: string;
  title: string;
};

export type InvestitureCeremonyGalleryRecord = {
  _id?: string;
  title: string;
  page: string;
  category: string;
  date: string;
  description: string;
  photos: string[];
  cover: string;
  featured: boolean;
};

export const defaultInvestitureCeremonyPhotos: InvestitureCeremonyPhoto[] = Array.from({ length: 18 }, (_, index) => {
  const fileIndex = String(index + 1).padStart(2, "0");
  return {
    src: `https://www.lpsvidhyawadi.com/Images/InvestitureCeremony/InvestitureCeremony${fileIndex}.JPG`,
    alt: `Investiture Ceremony Moment ${fileIndex}`,
    title: `Ceremony Moment ${fileIndex}`,
  };
});

export function buildDefaultInvestitureCeremonyGallery(): InvestitureCeremonyGalleryRecord {
  return {
    title: "Investiture Ceremony",
    page: "investiture-ceremony",
    category: "Ceremony",
    date: "",
    description:
      "Student Leadership and ceremony highlights from the annual Investiture Ceremony.",
    photos: defaultInvestitureCeremonyPhotos.map((photo) => photo.src),
    cover: defaultInvestitureCeremonyPhotos[0]?.src ?? "",
    featured: true,
  };
}

