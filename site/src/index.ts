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

/**
 * Calculate the sum of the numbers within an array.
 *
 * @param data - The array to sum the contents of
 * @return The sum of the numbers within the array
 */
export function sumOf(data: Array<number>): number {
  let runningTotal = 0;
  for (let i: number = 0; i < data.length; i++) {
    runningTotal += data[i];
  }
  return runningTotal;
}

/**
 * Calculate the average of the numbers within an array.
 *
 * @param data - The array to calculate the average of
 * @return The average of the numbers within the array 
 */
export function averageOf(data: Array<number>): number {
  if (data.length == 0) {
    return 0;
  } else {
    return sumOf(data) / data.length;
  }
}
