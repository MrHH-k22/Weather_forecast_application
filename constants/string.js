export const UVIndexLevels = [
  { min: 0, max: 1.9, level: "Low", color: "#00FF00" },
  { min: 2, max: 4.9, level: "Moderate", color: "#FFFF00" },
  { min: 5, max: 6.9, level: "High", color: "#FFA500" },
  { min: 7, max: 9.9, level: "Very High", color: "#FF0000" },
  { min: 10, max: 100, level: "Extreme", color: "#800080" },
];

export const airQualityLevels = [
  {
    index: 1,
    category: "Very Good",
    color: "#39FF13",
    healthAdvice:
      "Enjoy outdoor activities. Open your windows to bring clean, fresh air to indoors",
  },
  {
    index: 2,
    category: "Good",
    color: "#FDFF00",
    healthAdvice:
      "Enjoy outdoor activities. Open your windows to bring clean, fresh air to indoors",
  },
  {
    index: 3,
    category: "Fair",
    color: "#FE6900",
    healthAdvice:
      "People unusually sensitive to air pollution. Plan strenuous outdoor activities when air quality is better",
  },
  {
    index: 4,
    category: "Poor",
    color: "#ef4444",
    healthAdvice: "Cut back or reschedule strenuous outdoor activities",
  },
  {
    index: 5,
    category: "Very Poor",
    color: "##7F4699",
    healthAdvice:
      "Avoid strenuous outdoor activities. Cut back or reschedule strenuous outdoor activities",
  },
  {
    index: 6,
    category: "Hazardous",
    color: "#800000",
    healthAdvice:
      "Avoid all outdoor physical activities. Significantly cut back on outdoor physical activities",
  },
];
