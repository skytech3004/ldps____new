export type LeadershipMemberSeed = {
  name: string;
  designation: string;
  image: string;
  sortOrder: number;
};

export const defaultLeadershipMembers: LeadershipMemberSeed[] = [
  {
    name: "Shri Kantilal ji N Mehta",
    designation: "President",
    image: "",
    sortOrder: 1,
  },
  {
    name: "Shri Pradeep ji G Rathore",
    designation: "Vice President",
    image: "",
    sortOrder: 2,
  },
  {
    name: "Shri Chandan ji M. Parmar",
    designation: "Vice President",
    image: "",
    sortOrder: 3,
  },
  {
    name: "Shri Kantilal ji M Mehta",
    designation: "Vice President",
    image: "",
    sortOrder: 4,
  },
  {
    name: "Shri Ramesh ji C. Sancheti",
    designation: "Secretary",
    image: "",
    sortOrder: 5,
  },
  {
    name: "Shri Pradeep ji C. Sancheti",
    designation: "Treasurer",
    image: "",
    sortOrder: 6,
  },
];
