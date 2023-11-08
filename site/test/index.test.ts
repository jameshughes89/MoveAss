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
  didPasSleepTarget,
  didPassColour,
  parseFitbitCsvString,
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

describe('didPasSleepTarget', () => {
  test('Empty array returns true', () => {
    expect(didPasSleepTarget([])).toBe(true);
  });
  test('Within threshold window all days returns true', () => {
    expect(didPasSleepTarget([430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530])).toBe(true);
  });
  test('On threshold window limit all days returns true', () => {
    expect(didPasSleepTarget([420, 420, 420, 540, 540, 540])).toBe(true);
  });
  test('Above maximum threshold one day returns false', () => {
    expect(didPasSleepTarget([430, 440, 450, 460, 470, 541, 490, 500, 510, 520, 530])).toBe(false);
  });
  test('Above maximum threshold some days returns false', () => {
    expect(didPasSleepTarget([430, 440, 541, 460, 470, 541, 490, 500, 541, 520, 530])).toBe(false);
  });
  test('Above maximum threshold all days returns false', () => {
    expect(didPasSleepTarget([541, 541, 541, 541, 541, 541])).toBe(false);
  });
  test('Below minimum threshold one day returns false', () => {
    expect(didPasSleepTarget([430, 440, 450, 460, 470, 419, 490, 500, 510, 520, 530])).toBe(false);
  });
  test('Below minimum threshold some days returns false', () => {
    expect(didPasSleepTarget([430, 440, 419, 460, 470, 419, 490, 500, 419, 520, 530])).toBe(false);
  });
  test('Below minimum threshold all days returns false', () => {
    expect(didPasSleepTarget([419, 419, 419, 419, 419, 419])).toBe(false);
  });
  test('Above and below threshold window some days returns false', () => {
    expect(didPasSleepTarget([430, 440, 419, 460, 470, 541, 490, 500, 419, 520, 530])).toBe(false);
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

describe('parseFitbitCsvString', () => {
  test('Empty string returns empty Map', () => {
    expect(parseFitbitCsvString('', 101, 101)).toEqual(new Map());
  });
  test('No lines specified to read with start/end line returns Map with keys and empty lists', () => {
    let testData: string = `This, Is, A, Test
        "10", "11", "12", "13"
        "20", "21", "22", "23"`;
    let expectedMap: Map<string, Array<string | number>> = new Map([
      ['This', []],
      ['Is', []],
      ['A', []],
      ['Test', []],
    ]);
    expect(parseFitbitCsvString(testData, 0, 0)).toEqual(expectedMap);
  });
  test('Start line not index 0 returns Map with keys and empty lists', () => {
    let testData: string = `This, Is, A, Test
        "10", "11", "12", "13"
        "20", "21", "22", "23"`;
    let expectedMap: Map<string, Array<string | number>> = new Map([
      ['"10"', []],
      ['"11"', []],
      ['"12"', []],
      ['"13"', []],
    ]);
    expect(parseFitbitCsvString(testData, 1, 1)).toEqual(expectedMap);
  });
  test('End line before start lines returns Map with keys and empty lists', () => {
    let testData: string = `This, Is, A, Test
        "10", "11", "12", "13"
        "20", "21", "22", "23"`;
    let expectedMap: Map<string, Array<string | number>> = new Map([
      ['This', []],
      ['Is', []],
      ['A', []],
      ['Test', []],
    ]);
    expect(parseFitbitCsvString(testData, 0, -1)).toEqual(expectedMap);
  });
  test('One line specified to read with start/end line returns correct Map', () => {
    let testData: string = `This, Is, A, Test
        "10", "11", "12", "13"
        "20", "21", "22", "23"`;
    let expectedMap: Map<string, Array<string | number>> = new Map([
      ['This', ['10']],
      ['Is', [11]],
      ['A', [12]],
      ['Test', [13]],
    ]);
    expect(parseFitbitCsvString(testData, 0, 1)).toEqual(expectedMap);
  });
  test('Multiple line specified to read with start/end line returns correct Map', () => {
    let testData: string = `This, Is, A, Test
        "10", "11", "12", "13"
        "20", "21", "22", "23"
        "30", "31", "32", "33"
        "40", "41", "42", "43"`;
    let expectedMap: Map<string, Array<string | number>> = new Map([
      ['This', ['10', '20', '30']],
      ['Is', [11, 21, 31]],
      ['A', [12, 22, 32]],
      ['Test', [13, 23, 33]],
    ]);
    expect(parseFitbitCsvString(testData, 0, 3)).toEqual(expectedMap);
  });
  test('Non-zero start line returns correct Map', () => {
    let testData: string = `Stuff
        Not important
        This, Is, A, Test
        "10", "11", "12", "13"
        "20", "21", "22", "23"
        "30", "31", "32", "33"
        "40", "41", "42", "43"`;
    let expectedMap: Map<string, Array<string | number>> = new Map([
      ['This', ['10', '20', '30']],
      ['Is', [11, 21, 31]],
      ['A', [12, 22, 32]],
      ['Test', [13, 23, 33]],
    ]);
    expect(parseFitbitCsvString(testData, 2, 5)).toEqual(expectedMap);
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
