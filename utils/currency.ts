interface TakaFunction {
  (amount: number): string;
}

export const taka: TakaFunction = (amount: number): string => {
  return `৳${amount.toFixed(2)}`;
};