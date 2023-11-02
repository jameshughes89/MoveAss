import { calculateAverage, bmiKgM, calculateSum } from '../src';

describe('calculateAverage', () => {
  test('Empty array returns zero', () => {
    expect(calculateAverage([])).toBe(0);
  });
  test('Array of positive numbers returns correct average', () => {
    expect(calculateAverage([0, 1, 2, 3, 4])).toBe(2);
  });
  test('Array of negative numbers returns correct sum', () => {
    expect(calculateAverage([0, -1, -2, -3, -4])).toBe(-2);
  });
  test('Array of positive and negative numbers returns correct sum', () => {
    expect(calculateAverage([0, -1, 2, -3, 4])).toBeCloseTo(0.4);
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
