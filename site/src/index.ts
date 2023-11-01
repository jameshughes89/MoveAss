const KGS_PER_LBS: number = 1/2.205;
export function sum(a: number, b: number): number {
  return a + b;
}

export function calculateBmi(weightLb: number, heightCm: number): number {
  const weightKg: number = weightLb * KGS_PER_LBS;
  return weightKg / (heightCm**2);
}