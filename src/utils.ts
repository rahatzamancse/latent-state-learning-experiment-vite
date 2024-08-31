/**
 * This function reads a file from the project directory.
 * @param filePath The path relative to the root of the project
 * @returns The content of the file in string format (encoded in UTF-8)
 */
export function readFile(filePath: string) {
  return fetch(filePath).then((response) => response.text());
}

export function shuffleIndices(n: number) {
  return Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5);
}

export function getShuffledArray<T>(array: T[]): { shuffledArray: T[], originalIndices: number[] } {
  // Copy the array to avoid modifying the original
  const copiedArray = array.slice();
  // Create an array of original indices
  const originalIndices = array.map((_, index) => index);
  
  // Shuffle the copied array and the original indices array using the Fisher-Yates algorithm
  for (let i = copiedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements in copiedArray
      [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
      // Swap corresponding indices in originalIndices
      [originalIndices[i], originalIndices[j]] = [originalIndices[j], originalIndices[i]];
  }

  return {
      shuffledArray: copiedArray,
      originalIndices: originalIndices
  };
}

export function addObjectInRange<T, NT>(arr: T[], obj: NT, start: number, end: number): (T | NT)[] {
  let result: (T | NT)[] = [];
  for (let i = 0; i < arr.length; i++) {
      result.push(arr[i]); 
      if (i >= start && i <= end) {
          result.push(obj); 
      }
  }
  return result;
}

export function findMaxIndex(arr: number[]): number {
  return arr.reduce((maxIndex, currentValue, currentIndex, array) => {
      return currentValue > array[maxIndex] ? currentIndex : maxIndex;
  }, 0);
}