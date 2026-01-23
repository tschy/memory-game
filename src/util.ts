export function randomPick<T>(n: number, list: T[]): T[] {
  if (!Number.isFinite(n) || n < 0) {
    throw new Error("n must be a non-negative number");
  }

  const count = Math.floor(n);
  if (count > list.length) {
    throw new Error("n cannot exceed list length");
  }

  const arr = list.slice();
  for (let i = arr.length - 1; i >= arr.length - count; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(arr.length - count);
}

export function randomize<T>(things: T[]) {
  // Fisher–Yates shuffle (uniform), returning a new array (doesn't mutate input)
  const arr = things.slice();

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}