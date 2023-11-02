import {
  COLOUR_UNDERWEIGHT,
  COLOUR_NORMAL_WEIGHT,
  COLOUR_OVERWEIGHT,
  COLOUR_OBESE_CLASS_I,
  COLOUR_OBESE_CLASS_II,
  COLOUR_OBESE_CLASS_III,
  COLOUR_PASS,
  COLOUR_FAIL,
  TARGET_ACTIVITY_MINUTES_BETWEEN_18_65,
  TARGET_ACTIVITY_MINUTES_OUTSIDE_18_65,
  activityTargetFromAge,
  ageFromDobAsOfDay,
  averageOf,
  bmiCategory,
  bmiCategoryColour,
  bmiKgM,
  didPassActivityTarget,
  didPassSedentaryTarget,
  didPassColour,
  sumOf,
} from '../src';

describe('activityTargetFromAge', () => {
  test('Age of 17 returns outside 18 -- 65 target', () => {
    expect(activityTargetFromAge(17)).toBe(TARGET_ACTIVITY_MINUTES_OUTSIDE_18_65);
  });
  test('Age of 18 returns between 18 -- 65 target', () => {
    expect(activityTargetFromAge(18)).toBe(TARGET_ACTIVITY_MINUTES_BETWEEN_18_65);
  });
  test('Age of 64 returns between 18 -- 65 target', () => {
    expect(activityTargetFromAge(64)).toBe(TARGET_ACTIVITY_MINUTES_BETWEEN_18_65);
  });
  test('Age of 65 returns outside 18 -- 65 target', () => {
    expect(activityTargetFromAge(65)).toBe(TARGET_ACTIVITY_MINUTES_OUTSIDE_18_65);
  });
});

describe('ageFromDobAsOfDay', () => {
  test('Dob 10 years after asOf date returns -10', () => {
    expect(ageFromDobAsOfDay(new Date('2000-01-01'), new Date('1990-01-01'))).toBe(-10);
  });
  test('Dob same as asOf date returns 0', () => {
    expect(ageFromDobAsOfDay(new Date('2000-01-01'), new Date('2000-01-01'))).toBe(0);
  });
  test('Birthday not occurred yet in asOf year returns correct age', () => {
    expect(ageFromDobAsOfDay(new Date('2000-6-6'), new Date('2020-01-01'))).toBe(19);
  });
  test('Birthday occurred already in asOf year returns correct age', () => {
    expect(ageFromDobAsOfDay(new Date('2000-6-6'), new Date('2020-12-12'))).toBe(20);
  });
  test('Birthday not occurred yet in asOf month returns correct age', () => {
    expect(ageFromDobAsOfDay(new Date('2000-6-6'), new Date('2020-6-5'))).toBe(19);
  });
  test('Birthday occurred already in asOf month returns correct age', () => {
    expect(ageFromDobAsOfDay(new Date('2000-6-6'), new Date('2020-6-7'))).toBe(20);
  });
  test('Birthday on asOf day returns correct age', () => {
    expect(ageFromDobAsOfDay(new Date('2000-6-6'), new Date('2020-6-6'))).toBe(20);
  });
});

describe('averageOf', () => {
  test('Empty array returns zero', () => {
    expect(averageOf([])).toBe(0);
  });
  test('Array of positive numbers returns correct average', () => {
    expect(averageOf([0, 1, 2, 3, 4])).toBe(2);
  });
  test('Array of negative numbers returns correct sum', () => {
    expect(averageOf([0, -1, -2, -3, -4])).toBe(-2);
  });
  test('Array of positive and negative numbers returns correct sum', () => {
    expect(averageOf([0, -1, 2, -3, 4])).toBeCloseTo(0.4);
  });
});

describe('bmiCategory', () => {
  test('BMI of 18.49 returns Underweight', () => {
    expect(bmiCategory(18.49)).toBe('Underweight');
  });
  test('BMI of 18.5 returns Normal Weight', () => {
    expect(bmiCategory(18.5)).toBe('Normal Weight');
  });
  test('BMI of 24.99 returns Normal Weight', () => {
    expect(bmiCategory(24.99)).toBe('Normal Weight');
  });
  test('BMI of 25 returns Overweight', () => {
    expect(bmiCategory(25)).toBe('Overweight');
  });
  test('BMI of 29.99 returns Overweight', () => {
    expect(bmiCategory(29.99)).toBe('Overweight');
  });
  test('BMI of 30 returns Obese (Class I)', () => {
    expect(bmiCategory(30)).toBe('Obese (Class I)');
  });
  test('BMI of 34.99 returns Obese (Class I)', () => {
    expect(bmiCategory(34.99)).toBe('Obese (Class I)');
  });
  test('BMI of 35 returns Obese (Class II)', () => {
    expect(bmiCategory(35)).toBe('Obese (Class II)');
  });
  test('BMI of 39.99 returns Obese (Class II)', () => {
    expect(bmiCategory(39.99)).toBe('Obese (Class II)');
  });
  test('BMI of 40 returns Obese (Class III)', () => {
    expect(bmiCategory(40)).toBe('Obese (Class III)');
  });
});

describe('bmiCategoryColour', () => {
  test('BMI of 18.49 returns Underweight colour', () => {
    expect(bmiCategoryColour(18.49)).toBe(COLOUR_UNDERWEIGHT);
  });
  test('BMI of 18.5 returns Normal Weight colour', () => {
    expect(bmiCategoryColour(18.5)).toBe(COLOUR_NORMAL_WEIGHT);
  });
  test('BMI of 24.99 returns Normal Weight colour', () => {
    expect(bmiCategoryColour(24.99)).toBe(COLOUR_NORMAL_WEIGHT);
  });
  test('BMI of 25 returns Overweight colour', () => {
    expect(bmiCategoryColour(25)).toBe(COLOUR_OVERWEIGHT);
  });
  test('BMI of 29.99 returns Overweight colour', () => {
    expect(bmiCategoryColour(29.99)).toBe(COLOUR_OVERWEIGHT);
  });
  test('BMI of 30 returns Obese (Class I) colour', () => {
    expect(bmiCategoryColour(30)).toBe(COLOUR_OBESE_CLASS_I);
  });
  test('BMI of 34.99 returns Obese (Class I) colour', () => {
    expect(bmiCategoryColour(34.99)).toBe(COLOUR_OBESE_CLASS_I);
  });
  test('BMI of 35 returns Obese (Class II) colour', () => {
    expect(bmiCategoryColour(35)).toBe(COLOUR_OBESE_CLASS_II);
  });
  test('BMI of 39.99 returns Obese (Class II) colour', () => {
    expect(bmiCategoryColour(39.99)).toBe(COLOUR_OBESE_CLASS_II);
  });
  test('BMI of 40 returns Obese (Class III) colour', () => {
    expect(bmiCategoryColour(40)).toBe(COLOUR_OBESE_CLASS_III);
  });
});

describe('bmiKgM', () => {
  test('Zero kgs mass returns BMI of zero', () => {
    expect(bmiKgM(0, 1)).toBe(0);
  });
  test('Zero m height returns BMI of infinity', () => {
    expect(bmiKgM(1, 0)).toBe(Infinity);
  });
  test('Arbitrary non-zero height and weight returns correct BMI', () => {
    expect(bmiKgM(95, 1.95)).toBeCloseTo(24.9835634451);
  });
});

describe('didPassActivityTarget', () => {
  test('Did not meet threshold returns false', () => {
    expect(didPassActivityTarget(9, 10)).toBe(false);
  });
  test('Did meet threshold returns true', () => {
    expect(didPassActivityTarget(10, 10)).toBe(true);
  });
  test('Did exceed threshold returns true', () => {
    expect(didPassActivityTarget(11, 10)).toBe(true);
  });
});

describe('didPassSedentaryTarget', () => {
  test('Exceeded threshold returns false', () => {
    expect(didPassSedentaryTarget(481)).toBe(false);
  });
  test('At threshold returns true', () => {
    expect(didPassSedentaryTarget(480)).toBe(true);
  });
  test('Under threshold returns true', () => {
    expect(didPassSedentaryTarget(479)).toBe(true);
  });
});

describe('didPassColour', () => {
  test('Passed targets (true) returns passed colour', () => {
    expect(didPassColour(true)).toBe(COLOUR_PASS);
  });
  test('Failed targets (false) returns failed colour', () => {
    expect(didPassColour(false)).toBe(COLOUR_FAIL);
  });
});

describe('sumOf', () => {
  test('Empty array returns zero', () => {
    expect(sumOf([])).toBe(0);
  });
  test('Array of positive numbers returns correct sum', () => {
    expect(sumOf([0, 1, 2, 3, 4])).toBe(10);
  });
  test('Array of negative numbers returns correct sum', () => {
    expect(sumOf([0, -1, -2, -3, -4])).toBe(-10);
  });
  test('Array of positive and negative numbers returns correct sum', () => {
    expect(sumOf([0, -1, 2, -3, 4])).toBe(2);
  });
});
