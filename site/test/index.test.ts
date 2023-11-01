import { calculateBmi, calculateSum } from '../src';

describe('calculateBmi', () => {
  test('Zero lbs weight returns BMI of zero', () => {
    expect(calculateBmi(0, 1)).toBe(0);
  });
  test('Zero cm height returns BMI of infinity', () => {
    expect(calculateBmi(1, 0)).toBe(Infinity);
  });
  test('Arbitrary non-zero height and weight returns correct BMI', () => {
    expect(calculateBmi(200, 200)).toBeCloseTo(22.679625);
  });
});

describe('calculateSum', () => {
  test('Empty array returns zero', () => {
    expect(calculateSum([])).toBe(0);
  });
  test('Array of positive numbers returns correct sum', () => {
    expect(calculateSum([0, 1, 2, 3, 4])).toBe(10);
  });
  test('Array of negative numbers returns correct sum', () => {
    expect(calculateSum([0, -1, -2, -3, -4])).toBe(-10);
  });
  test('Array of positive and negative numbers returns correct sum', () => {
    expect(calculateSum([0, -1, 2, -3, 4])).toBe(2);
  });
});
