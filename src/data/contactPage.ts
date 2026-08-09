export type ImportantContactSeed = {
  department: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  sortOrder: number;
  isActive: boolean;
};

export const defaultImportantContacts: ImportantContactSeed[] = [
  {
    department: "General Enquiry",
    contactName: "Campus Office",
    designation: "Marudhar Mahila Shikshan Sangh Vidyawadi",
    phone: "+91 6377204218",
    email: "marudharmahila@gmail.com",
    sortOrder: 1,
    isActive: true,
  },
  {
    department: "Admissions",
    contactName: "Admissions Office",
    designation: "School & College Admissions",
    phone: "02934-220935 / 220936",
    email: "lpsvidhyawadi@gmail.com",
    sortOrder: 2,
    isActive: true,
  },
  {
    department: "LPS School Office",
    contactName: "School Administration",
    designation: "Leeladevi Parasmal Sancheti English Medium Sr. Sec. School",
    phone: "02934-220935",
    email: "lpsvidhyawadi@gmail.com",
    sortOrder: 3,
    isActive: true,
  },
  {
    department: "Hostel Enquiry",
    contactName: "Hostel Office",
    designation: "Residential Campus",
    phone: "02934-220936",
    email: "lpsvidhyawadi@gmail.com",
    sortOrder: 4,
    isActive: true,
  },
];

export const contactLocation = {
  title: "Marudhar Mahila Shikshan Sangh Vidyawadi",
  addressLines: [
    "Post - Khimel, St. Rani,",
    "Tehsil - Bali, Dist. Pali,",
    "State - Rajasthan (India)",
    "PIN – 306115",
  ],
  phone: "+91 6377204218",
  email: "marudharmahila@gmail.com",
  note: "We come under Khimel village panchayat, located in Pali district. The campus is on Rani-Falna route, 3 kms away from Rani and 11 kms from Falna station.",
};

export const howToReach = {
  rail: [
    "Delhi-Jaipur-Ajmer-Marwar-Ahmedabad Route",
    "Bikaner-Ahmedabad-Bombay Route",
    "Jodhpur-Bombay Route",
  ],
  road: [
    "Sanderao on Pali-Ahmedabad Route",
    "Falna on Jodhpur-Udaipur Route",
    "Vidyawadi on Jodhpur-Sadri Route",
  ],
  air: [
    "Distance from Jodhpur Airport: 130 kms",
    "Distance from Udaipur Airport: 153 kms",
  ],
};
