export function countVotes(votes) {
  return Object.keys(votes).length;
}

export function haveAllVoted(participants, votes) {
  return participants.every((id) => votes[id] !== undefined);
}

export function isRevealAllowed(votes) {
  return Object.keys(votes).length > 0;
}

