import { countVotes } from '../utils.js';

describe('countVotes', () => {
  test('returns 0 for no votes', () => {
    expect(countVotes({})).toBe(0);
  });

  test('returns correct count for some votes', () => {
    const votes = {
      user1: '3',
      user2: '5',
    };
    expect(countVotes(votes)).toBe(2);
  });

  test('includes undefined votes as present keys', () => {
    const votes = {
      user1: undefined,
      user2: '8',
    };
    expect(countVotes(votes)).toBe(2);
  });
});
