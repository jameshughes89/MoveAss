import { calculateBmi } from '../src';

describe('calculateBmi', () => {
  test('Zero lbs weight returns BMI of zero', () => {
    expect(calculateBmi(0, 1)).toBe(0);
  });
  test('Zero cm height returns BMI of infinity', () => {
    expect(calculateBmi(1, 0)).toBe(Infinity);
  });
  test('200 lbs weight 200 cm height returns BMI of 22.679625', () => {
    expect(calculateBmi(200, 200)).toBeCloseTo(22.679625);
  });
});
