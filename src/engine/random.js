// Shared shuffling. Fisher–Yates gives every order the same chance; sort(() => Math.random() - 0.5)
// does not (with 3 options the correct answer landed in the middle slot only ~19% of the time).

// Shuffles arr in place and returns it
export function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Returns a shuffled copy of arr
export function shuffle(arr) {
  return shuffleInPlace([...arr]);
}
