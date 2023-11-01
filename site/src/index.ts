const KGS_PER_LBS: number = 1 / 2.205;

export function calculateBmi(weightLb: number, heightCm: number): number {
  const weightKg: number = weightLb * KGS_PER_LBS;
  const heightM: number = heightCm / 100.0;
  return weightKg / heightM ** 2;
}

export function calculateSum(data: Array<number>): number {
  let runningTotal = 0;
  for (let i: number = 0; i < data.length; i++) {
    runningTotal += data[i];
  }
  return runningTotal;
}
