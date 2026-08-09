export type AboutPageSlug = "management" | "management-message" | "ceo-message";

export type ManagementMember = {
  name: string;
  designation: string;
  sortOrder: number;
};

export type AboutPageSeed = {
  slug: AboutPageSlug;
  pageTitle: string;
  bannerImage: string;
  portraitImage: string;
  personName: string;
  personDesignation: string;
  content: string;
  members: ManagementMember[];
};

const managementIntro = `
<p><img src="/uploads/about/management-banner.jpg" alt="Vidyawadi Management Committee" /></p>
<h2>A Seventy Year's Old Educational Institution</h2>
<p>Going strong and growing stronger. Ethical management is its back bone. Those interested in the well being of the institution, become its member.</p>
<p>These members not only help Vidyawadi financially but also spend a great deal of time in planning about how to take the institution further without harming its original ethos and values, i.e., the love for culture, values, morals, yet-modern.</p>
<p>The management of Vidyawadi is committed to creating an environment where girls can flourish. Our leadership team consists of experienced educationists, social workers, and industry leaders who bring a wealth of knowledge and a shared passion for women's empowerment.</p>
<p>We believe in transparent governance, continuous innovation, and maintaining the highest standards of safety and academic rigor.</p>
`.trim();

export const defaultManagementMembers: ManagementMember[] = [
  { name: "Shri Kantilal Nagraj Mehta", designation: "President", sortOrder: 1 },
  { name: "Shri Pradeep Ghisulal Rathod", designation: "Vice President", sortOrder: 2 },
  { name: "Shri Chandan Magraj Parmar", designation: "Vice President", sortOrder: 3 },
  { name: "Shri Kantilal Multanmal Mehta", designation: "Vice President", sortOrder: 4 },
  { name: "Shri Arvind kumar Pannalal Ranawat", designation: "Vice President", sortOrder: 5 },
  { name: "Shri Kailash Tejraj Kaveria", designation: "Secretary", sortOrder: 6 },
  { name: "Mrs. Chandra Pradeep Mehta", designation: "Joint Secretary", sortOrder: 7 },
  { name: "Shri Hasmukhlal Ramanlal Sanghvi", designation: "Joint Secretary", sortOrder: 8 },
  { name: "Shri Mahendra Kumar Dhoka", designation: "Treasurer", sortOrder: 9 },
  { name: "Shri Bharat Bakhtawarmal Rathod", designation: "JT. Treasurer", sortOrder: 10 },
  { name: "Shri Popatlal Fulchand Sundesha", designation: "Past President", sortOrder: 11 },
];

const presidentMessage = `
<blockquote><p><strong>"Education is the light that empowers minds, builds character, and inspires leaders for a better tomorrow."</strong></p></blockquote>
<p>Dear Students, Parents, and Well-Wishers,</p>
<p>It is my privilege to welcome you to <strong>Vidyawadi</strong>, an institution dedicated to empowering young women through quality education and strong values since <strong>1956</strong>.</p>
<p>Guided by our philosophy, <strong>"शिक्षा भी • संस्कार भी"</strong>, we believe that education goes beyond academics. It nurtures character, confidence, and leadership while preparing students to meet the challenges of a dynamic world.</p>
<p>At Vidyawadi, we are committed to providing a learning environment that inspires excellence, innovation, and lifelong learning. Our dedicated educators and holistic approach help every student realize her potential and become a responsible, compassionate, and confident individual.</p>
<p>I invite you to join the Vidyawadi family as we continue our journey of nurturing minds, building character, and shaping the leaders of tomorrow.</p>
`.trim();

const ceoMessage = `
<p>It gives me immense pleasure to welcome you to Vidyawadi. As the Chief Executive Officer, I am proud to be part of an institution that has a rich legacy of empowering women through education.</p>
<p>Our vision is to build a vibrant learning community that celebrates diversity, encourages innovation, and instills a lifelong love for learning. We are constantly upgrading our infrastructure, introducing new programs, and forging partnerships to provide our students with the best possible opportunities.</p>
<p>I invite you to explore our campus, learn about our programs, and discover the Vidyawadi difference. Together, let us shape a brighter future for our students and our society.</p>
`.trim();

export const aboutPageDefaults: Record<AboutPageSlug, AboutPageSeed> = {
  management: {
    slug: "management",
    pageTitle: "Management Committee",
    bannerImage: "/uploads/about/management-banner.jpg",
    portraitImage: "",
    personName: "",
    personDesignation: "",
    content: managementIntro,
    members: defaultManagementMembers,
  },
  "management-message": {
    slug: "management-message",
    pageTitle: "President's Message",
    bannerImage: "",
    portraitImage: "/uploads/about/president-message.jpg",
    personName: "KANTILAL N. MEHTA",
    personDesignation: "President",
    content: presidentMessage,
    members: [],
  },
  "ceo-message": {
    slug: "ceo-message",
    pageTitle: "CEO's Message",
    bannerImage: "",
    portraitImage: "/uploads/about/ceo-message.png",
    personName: "",
    personDesignation: "Chief Executive Officer",
    content: ceoMessage,
    members: [],
  },
};

export const managementValues = [
  { title: "Integrity", description: "Honest & transparent governance" },
  { title: "Compassion", description: "Student-centric approach" },
  { title: "Innovation", description: "Modern teaching methods" },
  { title: "Community", description: "Strong stakeholder bonds" },
];

export const leadershipStructure = [
  { title: "General Committee", description: "Decision-making body" },
  { title: "Managing Committee", description: "Operational leadership" },
  { title: "Academic Council", description: "Educational standards" },
  { title: "Parent-Teacher Association", description: "Collaborative growth" },
];
