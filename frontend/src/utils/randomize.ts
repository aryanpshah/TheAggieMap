type Weighted = {
  weight?: number;
};

function createSeededRng(seed: number) {
  let state = seed >>> 0;
  if (state === 0) {
    state = 0x6d2b79f5;
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function weightedShuffle<T extends Weighted>(items: T[], seed: number): T[] {
  const rng = createSeededRng(seed);
  const pool = items.map((item) => ({
    item,
    weight: item.weight ?? 1,
  }));
  const result: T[] = [];

  if (pool.length === 0) {
    return result;
  }

  while (pool.length > 0) {
    const totalWeight = pool.reduce((acc, entry) => acc + entry.weight, 0);
    let target = rng() * totalWeight;

    for (let index = 0; index < pool.length; index += 1) {
      const entry = pool[index];
      target -= entry.weight;
      if (target <= 0) {
        result.push(entry.item);
        pool.splice(index, 1);
        break;
      }
    }
  }

  return result;
}

function generateSeed(): number {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] || Date.now();
  }
  return Math.floor(Math.random() * 0xffffffff) || Date.now();
}

export function getSessionSeed(key: string): number {
  if (typeof window === "undefined") {
    return generateSeed();
  }

  try {
    const stored = window.sessionStorage.getItem(key);
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Unable to read session seed", error);
  }

  return reseed(key);
}

export function reseed(key: string): number {
  const seed = generateSeed();
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(key, seed.toString());
    } catch (error) {
      console.warn("Unable to store session seed", error);
    }
  }
  return seed;
}

export function pickTop<T>(arr: T[], n: number): T[] {
  if (n <= 0) {
    return [];
  }
  if (arr.length <= n) {
    return arr.slice();
  }
  return arr.slice(0, n);
}
