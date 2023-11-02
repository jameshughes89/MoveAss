const KGS_PER_LBS: number = 1 / 2.205;
const M_PER_CM: number = 1 / 100;

/**
 * Calculate the BMI based on a mass in kilograms and height in meters.
 *
 * @param massKg - Mass in kilograms
 * @param heightM - Height in meters
 * @return The BMI of an individual in kg/(m^{2})
 */
export function bmiKgM(massKg: number, heightM: number): number {
  return massKg / heightM ** 2;
}

export function calculateSum(data: Array<number>): number {
  let runningTotal = 0;
  for (let i: number = 0; i < data.length; i++) {
    runningTotal += data[i];
  }
  return runningTotal;
}

export function calculateAverage(data: Array<number>): number {
  if (data.length == 0) {
    return 0;
  } else {
    return calculateSum(data) / data.length;
  }
}
