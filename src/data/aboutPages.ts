export type AboutPageSlug =
  | "management"
  | "management-message"
  | "ceo-message"
  | "secretary-message"
  | "about-trust"
  | "principals-message";

export type ManagementMember = {
  name: string;
  designation: string;
  sortOrder: number;
};

export type AboutPageSeed = {
  slug: AboutPageSlug;
  pageTitle: string;
  pageSubtitle: string;
  bannerImage: string;
  portraitImage: string;
  personName: string;
  personDesignation: string;
  content: string;
  inspirationContent: string;
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

const secretaryMessage = `
<blockquote><p><strong>"Dedicated service and transparent governance strengthen the foundation of every great institution."</strong></p></blockquote>
<p>Dear Students, Parents, and Well-Wishers,</p>
<p>As Secretary of Marudhar Mahila Shikshan Sangh, Vidyawadi, it is my honour to serve an institution that has been transforming lives through girls' education for decades.</p>
<p>Our management is committed to ensuring that every decision reflects the trust placed in us by parents, students, and the community. We work closely with the President, Managing Committee, and academic leadership to support the school's growth while preserving its values and traditions.</p>
<p>Through careful planning, responsible administration, and continuous dialogue with all stakeholders, we strive to create an environment where every girl at Vidyawadi can learn, grow, and achieve her dreams.</p>
<p>I welcome you to be a part of the Vidyawadi family and look forward to our shared journey of excellence.</p>
`.trim();

const aboutTrustContent = `
<h2>Vidyawadi — Best Residential Girls' Education Campus in Rajasthan</h2>
<p><strong>Marudhar Mahila Shikshan Sangh Vidyawadi</strong>, located at Khimel Rani Station, Tehsil Bali, District Pali, Rajasthan (306115), is one of the most trusted and established residential girls' education campuses in Rajasthan.</p>
<p>Spread across a massive 65-acre green campus, the institute is dedicated to academic excellence, character building, and holistic development of every girl child enrolled in Vidyawadi. Our campus is designed to provide a safe, disciplined, and growth-oriented learning environment for girls.</p>
<h2>Nurturing Excellence Since 1956</h2>
<p>Vidyawadi is more than just a school and college; it is a community dedicated to the holistic development of girls. Our campus is spread over 65+ acres of lush greenery, providing an ideal environment for learning and growth. With a legacy of over 70 years, we have consistently produced leaders who excel in various fields across the globe.</p>
`.trim();

const inspirationContent = `
<p>Smt. Subhadraji Jain was one amongst the founders of Vidyawadi. A strong and dedicated lady who worked for the betterment of the institution all through her life. She was awarded with many awards at district, state and national level several times. She worked as a Teacher, as a Principal and as an Administrator with a sole objective of growth of Vidyawadi.</p>
`.trim();

const principalsMessage = `
<blockquote><p><strong>"A society that educates its daughters rewrites its destiny."</strong></p></blockquote>
<p>Dear Students, Parents, and Community Members,</p>
<p>Welcome to LPS, Vidyawadi, where we take pride in fostering a nurturing environment that empowers every learner to grow into a confident, compassionate, and globally-minded citizen.</p>
<p>Founded in 2004, situated in the rural belt of Pali District in Rajasthan, this Vidyalaya is a residential school providing quality education from Nursery to XII primarily for girls, with a noble thought of promoting girls' education. Presently, the School accommodates more than 1000 girls.</p>
<p>At our core, we embrace a vision to nurture global citizens who are equipped to thrive in an ever-changing world. Our mission is to provide a healthy learning environment where every student feels safe, valued, and inspired to pursue excellence.</p>
<p>Together, let us work to create a future where every child shines brightly, empowered to shape their destiny and contribute meaningfully to the global community.</p>
`.trim();

export const aboutPageDefaults: Record<AboutPageSlug, AboutPageSeed> = {
  management: {
    slug: "management",
    pageTitle: "Management Committee",
    pageSubtitle: "",
    bannerImage: "/uploads/about/management-banner.jpg",
    portraitImage: "",
    personName: "",
    personDesignation: "",
    content: managementIntro,
    inspirationContent: "",
    members: defaultManagementMembers,
  },
  "management-message": {
    slug: "management-message",
    pageTitle: "President's Message",
    pageSubtitle: "A message from the President of Marudhar Mahila Shikshan Sangh, Vidyawadi.",
    bannerImage: "",
    portraitImage: "/uploads/about/president-message.jpg",
    personName: "KANTILAL N. MEHTA",
    personDesignation: "President",
    content: presidentMessage,
    inspirationContent: "",
    members: [],
  },
  "ceo-message": {
    slug: "ceo-message",
    pageTitle: "CEO's Message",
    pageSubtitle: "A message from the Chief Executive Officer of Vidyawadi.",
    bannerImage: "",
    portraitImage: "/uploads/about/ceo-message.png",
    personName: "",
    personDesignation: "Chief Executive Officer",
    content: ceoMessage,
    inspirationContent: "",
    members: [],
  },
  "secretary-message": {
    slug: "secretary-message",
    pageTitle: "Secretary's Message",
    pageSubtitle: "A message from the Secretary of Marudhar Mahila Shikshan Sangh, Vidyawadi.",
    bannerImage: "",
    portraitImage: "",
    personName: "Shri Kailash Tejraj Kaveria",
    personDesignation: "Secretary",
    content: secretaryMessage,
    inspirationContent: "",
    members: [],
  },
  "about-trust": {
    slug: "about-trust",
    pageTitle: "About Trust",
    pageSubtitle: "Marudhar Mahila Shikshan Sangh Vidyawadi — nurturing excellence since 1956.",
    bannerImage: "/uploads/about-trust/about-campus.png",
    portraitImage: "/uploads/about-trust/subhadraji-jain.avif",
    personName: "Smt. Subhadraji Jain",
    personDesignation: "Our Inspiration",
    content: aboutTrustContent,
    inspirationContent,
    members: [],
  },
  "principals-message": {
    slug: "principals-message",
    pageTitle: "Principal's Desk",
    pageSubtitle: "A balanced curriculum, caring atmosphere, and lifelong learning focus.",
    bannerImage: "",
    portraitImage: "/principle.avif",
    personName: "Ms. Jyoti Nath",
    personDesignation: "Principal, Leeladevi Parasmal Sancheti English Medium Sr.Sec. School",
    content: principalsMessage,
    inspirationContent: "",
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
