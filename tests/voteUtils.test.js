import { countVotes, haveAllVoted, isRevealAllowed } from '../utils.js';

describe('countVotes', () => {
  test('returns 0 for no votes', () => {
    expect(countVotes({})).toBe(0);
  });

  test('returns correct count for some votes', () => {
    expect(countVotes({ user1: '3', user2: '5' })).toBe(2);
  });
});

describe('haveAllVoted', () => {
  test('returns true if all participants voted', () => {
    const participants = ['user1', 'user2'];
    const votes = { user1: '3', user2: '5' };
    expect(haveAllVoted(participants, votes)).toBe(true);
  });

  test('returns false if someone has not voted', () => {
    const participants = ['user1', 'user2', 'user3'];
    const votes = { user1: '3', user2: '5' };
    expect(haveAllVoted(participants, votes)).toBe(false);
  });
});

describe('isRevealAllowed', () => {
  test('returns false for 0 votes', () => {
    expect(isRevealAllowed({})).toBe(false);
  });

  test('returns true for 1 or more votes', () => {
    expect(isRevealAllowed({ user1: '3' })).toBe(true);
  });
});

