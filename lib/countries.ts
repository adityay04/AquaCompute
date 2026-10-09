export interface CountryData {
  code: string;
  name: string;
  flag: string;
  currency: string;
  water: {
    bucketLiters: number;
    bottleLiters: number;
    showerLiters: number;
  };
  energy: {
    acUnitKw: number;
    acLabel: string;
    householdDailyKwh: number;
    householdLabel: string;
    bulbWatts: number;
  };
  carbon: {
    domesticFlightKg: number;
    domesticFlightLabel: string;
    carGramsPerKm: number;
  };
}

export const COUNTRIES: CountryData[] = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    water: {
      bucketLiters: 20,
      bottleLiters: 1,
      showerLiters: 60,
    },
    energy: {
      acUnitKw: 1.5,
      acLabel: "1.5-ton AC",
      householdDailyKwh: 8.33,
      householdLabel: "Indian household days",
      bulbWatts: 9,
    },
    carbon: {
      domesticFlightKg: 150,
      domesticFlightLabel: "Delhi → Mumbai flights",
      carGramsPerKm: 120,
    },
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    water: {
      bucketLiters: 15,
      bottleLiters: 0.5,
      showerLiters: 75,
    },
    energy: {
      acUnitKw: 3.5,
      acLabel: "3.5-ton central AC",
      householdDailyKwh: 28.7,
      householdLabel: "US household days",
      bulbWatts: 10,
    },
    carbon: {
      domesticFlightKg: 250,
      domesticFlightLabel: "NY → LA flights",
      carGramsPerKm: 250,
    },
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    water: {
      bucketLiters: 10,
      bottleLiters: 0.5,
      showerLiters: 65,
    },
    energy: {
      acUnitKw: 2.5,
      acLabel: "2.5kW portable AC",
      householdDailyKwh: 10.0,
      householdLabel: "UK household days",
      bulbWatts: 8,
    },
    carbon: {
      domesticFlightKg: 130,
      domesticFlightLabel: "London → Edinburgh flights",
      carGramsPerKm: 160,
    },
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    water: {
      bucketLiters: 12,
      bottleLiters: 1,
      showerLiters: 70,
    },
    energy: {
      acUnitKw: 2.0,
      acLabel: "2kW split AC",
      householdDailyKwh: 8.2,
      householdLabel: "German household days",
      bulbWatts: 8,
    },
    carbon: {
      domesticFlightKg: 140,
      domesticFlightLabel: "Berlin → Munich flights",
      carGramsPerKm: 170,
    },
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    currency: "JPY",
    water: {
      bucketLiters: 15,
      bottleLiters: 0.5,
      showerLiters: 70,
    },
    energy: {
      acUnitKw: 2.8,
      acLabel: "2.8kW AC unit",
      householdDailyKwh: 12.3,
      householdLabel: "Japanese household days",
      bulbWatts: 9,
    },
    carbon: {
      domesticFlightKg: 160,
      domesticFlightLabel: "Tokyo → Osaka flights",
      carGramsPerKm: 150,
    },
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    water: {
      bucketLiters: 15,
      bottleLiters: 0.6,
      showerLiters: 80,
    },
    energy: {
      acUnitKw: 3.5,
      acLabel: "3.5kW split AC",
      householdDailyKwh: 18.0,
      householdLabel: "Australian household days",
      bulbWatts: 10,
    },
    carbon: {
      domesticFlightKg: 300,
      domesticFlightLabel: "Sydney → Melbourne flights",
      carGramsPerKm: 200,
    },
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    currency: "BRL",
    water: {
      bucketLiters: 12,
      bottleLiters: 1,
      showerLiters: 55,
    },
    energy: {
      acUnitKw: 2.0,
      acLabel: "2kW split AC",
      householdDailyKwh: 5.5,
      householdLabel: "Brazilian household days",
      bulbWatts: 9,
    },
    carbon: {
      domesticFlightKg: 170,
      domesticFlightLabel: "São Paulo → Rio flights",
      carGramsPerKm: 130,
    },
  },
  {
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    currency: "AED",
    water: {
      bucketLiters: 18,
      bottleLiters: 0.5,
      showerLiters: 70,
    },
    energy: {
      acUnitKw: 3.0,
      acLabel: "3-ton AC",
      householdDailyKwh: 35.0,
      householdLabel: "UAE household days",
      bulbWatts: 9,
    },
    carbon: {
      domesticFlightKg: 120,
      domesticFlightLabel: "Dubai → Abu Dhabi flights",
      carGramsPerKm: 220,
    },
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    water: {
      bucketLiters: 12,
      bottleLiters: 0.5,
      showerLiters: 60,
    },
    energy: {
      acUnitKw: 2.5,
      acLabel: "2.5kW AC unit",
      householdDailyKwh: 13.5,
      householdLabel: "Singapore household days",
      bulbWatts: 8,
    },
    carbon: {
      domesticFlightKg: 90,
      domesticFlightLabel: "Singapore → Kuala Lumpur flights",
      carGramsPerKm: 150,
    },
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    currency: "ZAR",
    water: {
      bucketLiters: 15,
      bottleLiters: 1,
      showerLiters: 55,
    },
    energy: {
      acUnitKw: 2.0,
      acLabel: "2kW split AC",
      householdDailyKwh: 8.0,
      householdLabel: "South African household days",
      bulbWatts: 9,
    },
    carbon: {
      domesticFlightKg: 160,
      domesticFlightLabel: "Joburg → Cape Town flights",
      carGramsPerKm: 180,
    },
  },
];

export function getCountryByCode(code: string): CountryData | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
