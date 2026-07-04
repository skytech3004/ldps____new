export type BoardResultSeed = {
  year: string;
  passPercentage: string;
  highestScore: string;
  highestScoreScorer: string;
  distinctionsCount: number;
  batchAverage: string;
  toppers: Array<{
    name: string;
    class: "Class X" | "Class XII";
    stream: string;
    score: string;
    rank: number;
    medal: string;
    description: string;
  }>;
  students: Array<{
    name: string;
    class: "Class X" | "Class XII";
    stream: string;
    percent: number;
    status: string;
  }>;
};

export const defaultBoardResults: BoardResultSeed[] = [
  {
    year: "2024-25",
    passPercentage: "100%",
    highestScore: "98.4%",
    highestScoreScorer: "Ms. Bhavya Sharma (Class X)",
    distinctionsCount: 38,
    batchAverage: "91.8%",
    toppers: [
      // Class 12 Toppers
      { name: "Ms. Rajbala Chouhan", class: "Class XII", stream: "Science", score: "98.2%", rank: 1, medal: "gold", description: "School Topper - Awarded by block SDM for academic distinction." },
      { name: "Ms. Samridhi Trivedi", class: "Class XII", stream: "Commerce", score: "97.4%", rank: 2, medal: "silver", description: "Commerce Stream Topper - Excellence in Accountancy." },
      { name: "Ms. Tanisha Rajpurohit", class: "Class XII", stream: "Humanities", score: "96.8%", rank: 3, medal: "bronze", description: "Humanities Stream Topper - Distinction in History." },
      { name: "Ms. Monika Kanwar Ranawat", class: "Class XII", stream: "Science", score: "95.5%", rank: 4, medal: "star", description: "Distinction in Physics and Math." },
      { name: "Ms. Laxmi Kunwar", class: "Class XII", stream: "Science", score: "94.8%", rank: 5, medal: "star", description: "Distinction in Chemistry & English." },
      { name: "Ms. Ashmita Singh", class: "Class XII", stream: "Humanities", score: "94.2%", rank: 6, medal: "star", description: "High achiever in Political Science." },
      { name: "Ms. Muskan Bisla", class: "Class XII", stream: "Science", score: "93.6%", rank: 7, medal: "star", description: "Excellence in Biology." },
      // Class 10 Toppers
      { name: "Ms. Bhavya Sharma", class: "Class X", stream: "General", score: "98.4%", rank: 1, medal: "gold", description: "Class Topper - Awarded with a laptop at Jaipur by the Chief Minister." },
      { name: "Ms. Jaisal Singh Shekhawat", class: "Class X", stream: "General", score: "96.2%", rank: 2, medal: "silver", description: "Outstanding performance in Mathematics & Science." },
      { name: "Ms. Kritika Rathore", class: "Class X", stream: "General", score: "95.8%", rank: 3, medal: "bronze", description: "Outstanding performance in Sanskrit & Social Science." },
      { name: "Ms. Sakshi Soni", class: "Class X", stream: "General", score: "94.5%", rank: 4, medal: "star", description: "Distinction in Hindi & Computer Science." },
      { name: "Ms. Shivranjani", class: "Class X", stream: "General", score: "93.9%", rank: 5, medal: "star", description: "National Softball Player with Academic distinction." },
      { name: "Ms. Kumkum Saini", class: "Class X", stream: "General", score: "92.8%", rank: 6, medal: "star", description: "First Class Distinction in all core subjects." }
    ],
    students: [
      // Class 12 Registry
      { name: "Ms. Rajbala Chouhan", class: "Class XII", stream: "Science", percent: 98.2, status: "Merit with Gold Medal" },
      { name: "Ms. Samridhi Trivedi", class: "Class XII", stream: "Commerce", percent: 97.4, status: "Merit with Silver Medal" },
      { name: "Ms. Tanisha Rajpurohit", class: "Class XII", stream: "Humanities", percent: 96.8, status: "Merit with Bronze Medal" },
      { name: "Ms. Monika Kanwar Ranawat", class: "Class XII", stream: "Science", percent: 95.5, status: "Distinction" },
      { name: "Ms. Laxmi Kunwar", class: "Class XII", stream: "Science", percent: 94.8, status: "Distinction" },
      { name: "Ms. Ashmita Singh", class: "Class XII", stream: "Humanities", percent: 94.2, status: "Distinction" },
      { name: "Ms. Muskan Bisla", class: "Class XII", stream: "Science", percent: 93.6, status: "Distinction" },
      { name: "Ms. Himanshi Chouhan", class: "Class XII", stream: "Science", percent: 92.2, status: "Distinction" },
      { name: "Ms. Vishakha Champawat", class: "Class XII", stream: "Humanities", percent: 92.0, status: "Distinction" },
      { name: "Ms. Yashaswi Shekhawat", class: "Class XII", stream: "Humanities", percent: 91.4, status: "Distinction" },
      { name: "Ms. Varsha Chauhan", class: "Class XII", stream: "Humanities", percent: 90.6, status: "Distinction" },
      { name: "Ms. Anshu Rajpurohit", class: "Class XII", stream: "Science", percent: 90.2, status: "Distinction" },
      { name: "Ms. Ritu Soni", class: "Class XII", stream: "Commerce", percent: 89.4, status: "First Class" },
      { name: "Ms. Nikita Charan", class: "Class XII", stream: "Arts", percent: 88.5, status: "First Class" },
      { name: "Ms. Rambala", class: "Class XII", stream: "Commerce", percent: 87.2, status: "First Class" },
      // Class 10 Registry
      { name: "Ms. Bhavya Sharma", class: "Class X", stream: "General", percent: 98.4, status: "Merit with Gold Medal" },
      { name: "Ms. Jaisal Singh Shekhawat", class: "Class X", stream: "General", percent: 96.2, status: "Merit with Silver Medal" },
      { name: "Ms. Kritika Rathore", class: "Class X", stream: "General", percent: 95.8, status: "Merit with Bronze Medal" },
      { name: "Ms. Sakshi Soni", class: "Class X", stream: "General", percent: 94.5, status: "Distinction" },
      { name: "Ms. Shivranjani", class: "Class X", stream: "General", percent: 93.9, status: "Distinction" },
      { name: "Ms. Kumkum Saini", class: "Class X", stream: "General", percent: 92.8, status: "Distinction" },
      { name: "Ms. Khyati Soni", class: "Class X", stream: "General", percent: 92.6, status: "Distinction" },
      { name: "Ms. Yashvi Jain", class: "Class X", stream: "General", percent: 92.4, status: "Distinction" },
      { name: "Ms. Kamini Malviya", class: "Class X", stream: "General", percent: 91.2, status: "Distinction" },
      { name: "Ms. Megha Goswami", class: "Class X", stream: "General", percent: 90.5, status: "Distinction" },
      { name: "Ms. Sonali Suthar", class: "Class X", stream: "General", percent: 90.2, status: "Distinction" },
      { name: "Ms. Kailash Vaishnav", class: "Class X", stream: "General", percent: 89.8, status: "First Class" },
      { name: "Ms. Ragini Vaishnav", class: "Class X", stream: "General", percent: 89.0, status: "First Class" },
      { name: "Ms. Siddhi Sharma", class: "Class X", stream: "General", percent: 88.4, status: "First Class" }
    ]
  },
  {
    year: "2023-24",
    passPercentage: "100%",
    highestScore: "97.8%",
    highestScoreScorer: "Ms. Nikita Rathore (Class XII)",
    distinctionsCount: 32,
    batchAverage: "90.2%",
    toppers: [
      // Class 12 Toppers
      { name: "Ms. Nikita Rathore", class: "Class XII", stream: "Science", score: "97.8%", rank: 1, medal: "gold", description: "School Topper - Outstanding achievement in Physics, Chemistry & Biology." },
      { name: "Ms. Riddhi Soni", class: "Class XII", stream: "Commerce", score: "96.5%", rank: 2, medal: "silver", description: "Commerce Stream Topper - Distinction in Economics & Business Studies." },
      { name: "Ms. Divya Choudhary", class: "Class XII", stream: "Humanities", score: "95.8%", rank: 3, medal: "bronze", description: "Humanities Topper - Perfect grades in Geography & Political Science." },
      { name: "Ms. Khyati Soni", class: "Class XII", stream: "Science", score: "94.6%", rank: 4, medal: "star", description: "Excellence in Computer Science and Math." },
      { name: "Ms. Yashvi Jain", class: "Class XII", stream: "Commerce", score: "94.0%", rank: 5, medal: "star", description: "Distinction in Accountancy and Statistics." },
      { name: "Ms. Sakshi Soni", class: "Class XII", stream: "Science", score: "93.2%", rank: 6, medal: "star", description: "High achiever in English Core." },
      // Class 10 Toppers
      { name: "Ms. Sakshi Jhala", class: "Class X", stream: "General", score: "97.2%", rank: 1, medal: "gold", description: "Class Topper - Honored with academic merit shield during annual day." },
      { name: "Ms. Varsha Kanwar", class: "Class X", stream: "General", score: "95.4%", rank: 2, medal: "silver", description: "Outstanding performance in Mathematics & Social Studies." },
      { name: "Ms. Panchan Kanwar", class: "Class X", stream: "General", score: "94.8%", rank: 3, medal: "bronze", description: "Outstanding performance in Sanskrit & English Language." },
      { name: "Ms. Kumkum Saini", class: "Class X", stream: "General", score: "93.6%", rank: 4, medal: "star", description: "First Class Distinction in all boards science courses." },
      { name: "Ms. Rajbala", class: "Class X", stream: "General", score: "92.4%", rank: 5, medal: "star", description: "High performer in Secondary social science labs." },
      { name: "Ms. Krishna Rathore", class: "Class X", stream: "General", score: "91.8%", rank: 6, medal: "star", description: "Excellence in boards arts and music credits." }
    ],
    students: [
      // Class 12 Registry
      { name: "Ms. Nikita Rathore", class: "Class XII", stream: "Science", percent: 97.8, status: "Merit with Gold Medal" },
      { name: "Ms. Riddhi Soni", class: "Class XII", stream: "Commerce", percent: 96.5, status: "Merit with Silver Medal" },
      { name: "Ms. Divya Choudhary", class: "Class XII", stream: "Humanities", percent: 95.8, status: "Merit with Bronze Medal" },
      { name: "Ms. Khyati Soni", class: "Class XII", stream: "Science", percent: 94.6, status: "Distinction" },
      { name: "Ms. Yashvi Jain", class: "Class XII", stream: "Commerce", percent: 94.0, status: "Distinction" },
      { name: "Ms. Sakshi Soni", class: "Class XII", stream: "Science", percent: 93.2, status: "Distinction" },
      { name: "Ms. Kamini Malviya", class: "Class XII", stream: "Science", percent: 92.4, status: "Distinction" },
      { name: "Ms. Megha Goswami", class: "Class XII", stream: "Science", percent: 91.8, status: "Distinction" },
      { name: "Ms. Sonali Suthar", class: "Class XII", stream: "Commerce", percent: 91.2, status: "Distinction" },
      { name: "Ms. Kailash Vaishnav", class: "Class XII", stream: "Humanities", percent: 90.6, status: "Distinction" },
      { name: "Ms. Ragini Vaishnav", class: "Class XII", stream: "Humanities", percent: 90.2, status: "Distinction" },
      { name: "Ms. Siddhi Sharma", class: "Class XII", stream: "Humanities", percent: 89.8, status: "First Class" },
      { name: "Ms. Pradhuman Jodha", class: "Class XII", stream: "Science", percent: 88.5, status: "First Class" },
      { name: "Ms. Manali Soni", class: "Class XII", stream: "Science", percent: 87.4, status: "First Class" },
      // Class 10 Registry
      { name: "Ms. Sakshi Jhala", class: "Class X", stream: "General", percent: 97.2, status: "Merit with Gold Medal" },
      { name: "Ms. Varsha Kanwar", class: "Class X", stream: "General", percent: 95.4, status: "Merit with Silver Medal" },
      { name: "Ms. Panchan Kanwar", class: "Class X", stream: "General", percent: 94.8, status: "Merit with Bronze Medal" },
      { name: "Ms. Kumkum Saini", class: "Class X", stream: "General", percent: 93.6, status: "Distinction" },
      { name: "Ms. Rajbala", class: "Class X", stream: "General", percent: 92.4, status: "Distinction" },
      { name: "Ms. Krishna Rathore", class: "Class X", stream: "General", percent: 91.8, status: "Distinction" },
      { name: "Ms. Anita Sirvi", class: "Class X", stream: "General", percent: 91.2, status: "Distinction" },
      { name: "Ms. Sonu Dewasi", class: "Class X", stream: "General", percent: 90.8, status: "Distinction" },
      { name: "Ms. Cheshta Shandilya", class: "Class X", stream: "General", percent: 90.5, status: "Distinction" },
      { name: "Ms. Harshita Singh Bhati", class: "Class X", stream: "General", percent: 90.2, status: "Distinction" },
      { name: "Ms. Sakshi Dangi", class: "Class X", stream: "General", percent: 89.6, status: "First Class" },
      { name: "Ms. Bhumika Rathore", class: "Class X", stream: "General", percent: 88.2, status: "First Class" }
    ]
  }
];
