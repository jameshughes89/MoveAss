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
    return 'powderblue';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'palegreen';
  } else if (bmi >= 25 && bmi < 30) {
    return 'palegoldenrod';
  } else if (bmi >= 30 && bmi < 35) {
    return 'lightsalmon';
  } else if (bmi >= 35 && bmi < 40) {
    return 'salmon';
  } else {
    return 'darksalmon';
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
