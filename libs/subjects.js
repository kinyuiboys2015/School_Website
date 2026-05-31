export const CBC_SUBJECTS = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Integrated Science",
  "Creative Arts & Sports",
  "Agriculture",
  "Home Science",
  "Pre-Technical Studies",
  "Social Studies",
  "Religious Education",
  "Business Studies",
  "French",
  "German",
  "Mandarin",
  "Kenyan Sign Language",
  "Indigenous Languages",
  "Computer Science",
  "Physical Education"
];

export const EIGHT_FOUR_FOUR_SUBJECTS = [
  "Biology",
  "Chemistry",
  "Physics",
  "History & Government",
  "Geography",
  "CRE/IRE/HRE",
  "Computer Studies",
  "Arabic",
  "Music",
  "Art & Design",
  "Building Construction",
  "Electricity",
  "Metalwork",
  "Woodwork",
  "Power Mechanics",
  "Aviation Technology",
  "Marine Engineering"
];

export const ALL_LEARNING_SUBJECTS = Array.from(
  new Set([...CBC_SUBJECTS, ...EIGHT_FOUR_FOUR_SUBJECTS])
);
