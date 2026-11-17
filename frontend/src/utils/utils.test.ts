import { describe, expect, test, it } from 'vitest';
import { sum, calculateTotal } from './utils.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

describe('calculateTotal', () => {
  it('calculates total price', () => {
    expect(calculateTotal(100, 3)).toBe(30);
  });
});
