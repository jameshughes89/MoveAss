const KGS_PER_LBS: number = 1 / 2.205;
const M_PER_CM: number = 1 / 100;

export const COLOUR_UNDERWEIGHT: string = 'powderblue';
export const COLOUR_NORMAL_WEIGHT: string = 'palegreen';
export const COLOUR_OVERWEIGHT: string = 'palegoldenrod';
export const COLOUR_OBESE_CLASS_I: string = 'lightsalmon';
export const COLOUR_OBESE_CLASS_II: string = 'salmon';
export const COLOUR_OBESE_CLASS_III: string = 'darksalmon';

export const COLOUR_PASS: string = 'palegreen';
export const COLOUR_FAIL: string = 'pink';

export const TARGET_ACTIVITY_MINUTES_BETWEEN_18_65: number = 200;
export const TARGET_ACTIVITY_MINUTES_OUTSIDE_18_65: number = 150;

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
 * Get a BMI categories based on a BMI. The BMI categories, as defined by the Wold Health Organization (WHO) are as
 * follows:
 *  bmi < 18.5 --- Underweight
 *  18.5 <= bmi < 25 --- Normal weight
 *  25 <= bmi < 30 --- Overweight
 *  30 <= bmi < 35 --- Obese (Class I)
 *  35 <= bmi < 40 --- Obese (Class II)
 *  40 <= bmi --- Obese (Class III)
 *
 * @param bmi - BMI of the individual
 * @return BMI Category
 */
export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal Weight';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else if (bmi >= 30 && bmi < 35) {
    return 'Obese (Class I)';
  } else if (bmi >= 35 && bmi < 40) {
    return 'Obese (Class II)';
  } else {
    return 'Obese (Class III)';
  }
}

/**
 * Get the colour associated with the bmi category. The colours being returned were chosen to match the colours in the
 * image available on the Wikipedia page for "Body Mass Index" --- https://en.wikipedia.org/wiki/Body_mass_index. The
 * BMI categories, as defined by the Wold Health Organization (WHO) are as follows:
 *  bmi < 18.5 --- Underweight
 *  18.5 <= bmi < 25 --- Normal weight
 *  25 <= bmi < 30 --- Overweight
 *  30 <= bmi < 35 --- Obese (Class I)
 *  35 <= bmi < 40 --- Obese (Class II)
 *  40 <= bmi --- Obese (Class III)
 *
 * @param bmi - BMI of the individual
 * @return Colour string for the provided BMI
 */
export function bmiCategoryColour(bmi: number): string {
  if (bmi < 18.5) {
    return COLOUR_UNDERWEIGHT;
  } else if (bmi >= 18.5 && bmi < 25) {
    return COLOUR_NORMAL_WEIGHT;
  } else if (bmi >= 25 && bmi < 30) {
    return COLOUR_OVERWEIGHT;
  } else if (bmi >= 30 && bmi < 35) {
    return COLOUR_OBESE_CLASS_I;
  } else if (bmi >= 35 && bmi < 40) {
    return COLOUR_OBESE_CLASS_II;
  } else {
    return COLOUR_OBESE_CLASS_III;
  }
}

/**
 * Get the age of an individual on a specified date based on their date of birth and a specified date. To determine the
 * individual's current age, as of today, specify the asOf date as today.
 *
 * @param dob - The individual's date of birth
 * @param asOf - The date to calculate the age of the individual on (use "today" to determine the current age)
 * @return The age of the individual as of the specified date
 */
export function ageFromDobAsOfDay(dob: Date, asOf: Date): number {
  let age: number = asOf.getFullYear() - dob.getFullYear();
  if (asOf.getMonth() < dob.getMonth() || (asOf.getMonth() === dob.getMonth() && asOf.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Get the weekly activity target for an individual based on their age.
 *
 * @param age - Age of the individual
 * @return Weekly activity target in minutes for the specified age
 */
export function activityTargetFromAge(age: number): number {
  if (age >= 18 && age < 65) {
    return TARGET_ACTIVITY_MINUTES_BETWEEN_18_65;
  } else {
    return TARGET_ACTIVITY_MINUTES_OUTSIDE_18_65;
  }
}

/**
 * Determine if an individual met or exceeded their physical activity target for the week.
 *
 * @param totalModerateVigorousActivity - Total moderate and vigorous activity for the week
 * @param target - Physical activity target for the week
 * @return If they met/exceeded their target (true) or not (false)
 */
export function didPassActivityTarget(totalModerateVigorousActivity: number, target: number): boolean {
  return totalModerateVigorousActivity >= target;
}

/**
 * Get the colour associated with passing/failing a target.
 *
 * @param didPass - True if the target was met/exceeded, false otherwise
 * @return Colour string for a pass or fail
 */
export function didPassColour(didPass: boolean): string {
  if (didPass) {
    return COLOUR_PASS;
  } else {
    return COLOUR_FAIL;
  }
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
