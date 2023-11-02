import {averageOf, bmiCategory, bmiKgM, sumOf} from '../src';

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
    expect(bmiCategory(18.49)).toBe("Underweight");
  });
  test('BMI of 18.5 returns Normal Weight', () => {
    expect(bmiCategory(18.5)).toBe("Normal Weight");
  });
  test('BMI of 24.99 returns Normal Weight', () => {
    expect(bmiCategory(24.99)).toBe("Normal Weight");
  });
  test('BMI of 25 returns Overweight', () => {
    expect(bmiCategory(25)).toBe("Overweight");
  });
  test('BMI of 29.99 returns Overweight', () => {
    expect(bmiCategory(29.99)).toBe("Overweight");
  });
  test('BMI of 30 returns Obese (Class I)', () => {
    expect(bmiCategory(30)).toBe("Obese (Class I)");
  });
  test('BMI of 34.99 returns Obese (Class I)', () => {
    expect(bmiCategory(34.99)).toBe("Obese (Class I)");
  });
  test('BMI of 35 returns Obese (Class II)', () => {
    expect(bmiCategory(35)).toBe("Obese (Class II)");
  });
  test('BMI of 39.99 returns Obese (Class II)', () => {
    expect(bmiCategory(39.99)).toBe("Obese (Class II)");
  });
  test('BMI of 40 returns Obese (Class III)', () => {
    expect(bmiCategory(40)).toBe("Obese (Class III)");
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
