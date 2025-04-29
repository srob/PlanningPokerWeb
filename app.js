import { db } from './firebaseConfig.js';
import { countVotes } from './utils.js';

import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

let sessionId = '';
let userId = 'web-' + Math.random().toString(36).substring(2, 10);
let userName = '';
let unsubscribe = null;

const estimateValues = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'];

function showSpinner(show) {
  document.getElementById('spinner').style.display = show ? 'block' : 'none';
}

function createSession() {
  userName = document.getElementById('username').value.trim();
  if (!userName) return alert('Please enter your name first.');

  showSpinner(true);
  const newSessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
  sessionId = newSessionId;

  const sessionRef = doc(db, 'sessions', sessionId);

  // Set locally immediately
  localStorage.setItem('creator_session', sessionId);
  localStorage.setItem('creator_userid', userId);

  setDoc(sessionRef, {
    createdBy: userId,
    revealed: false,
    votes: {},
    participants: { [userId]: userName },
    createdAt: serverTimestamp()
  }).then(() => {
    listenToSession(sessionId);
  });
}

function joinSession() {
  userName = document.getElementById('username').value.trim();
  if (!userName) return alert('Please enter your name first.');

  const inputId = document.getElementById('sessionIdInput').value.trim().toUpperCase();
  if (!inputId) return alert('Please enter a session ID to join.');

  sessionId = inputId;
  const sessionRef = doc(db, 'sessions', sessionId);

  showSpinner(true);
  getDoc(sessionRef).then((docSnap) => {
    if (docSnap.exists()) {
      updateDoc(sessionRef, {
        ['participants.' + userId]: userName
      });
      listenToSession(sessionId);
    } else {
      alert('Session not found.');
      showSpinner(false);
    }
  });
}

function listenToSession(id) {
  if (unsubscribe) unsubscribe();

  const sessionRef = doc(db, 'sessions', id);
  unsubscribe = onSnapshot(sessionRef, (docSnap) => {
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const { participants, votes, revealed, createdBy } = data;

    document.getElementById('sessionIdDisplay').textContent = id;
    document.getElementById('sessionView').style.display = 'block';
    showSpinner(false);

    const participantsDiv = document.getElementById('participants');
    participantsDiv.innerHTML = '<h3>Participants:</h3>';
    for (const [uid, name] of Object.entries(participants)) {
      const hasVoted = votes && votes[uid] !== undefined;
      participantsDiv.innerHTML += `<div>${name} ${hasVoted ? '[Voted]' : '[Waiting]'}</div>`;
    }

    const buttonsDiv = document.getElementById('buttons');
    buttonsDiv.innerHTML = '<h3>Your Estimate:</h3>';
    estimateValues.forEach(val => {
      const btn = document.createElement('button');
      btn.textContent = val;
      btn.onclick = () => {
        updateDoc(sessionRef, {
          ['votes.' + userId]: val
        });
      };
      buttonsDiv.appendChild(btn);
    });

    const votesDiv = document.getElementById('votes');
    votesDiv.innerHTML = '<h3>Votes:</h3>';
    if (revealed) {
      for (const [uid, val] of Object.entries(votes || {})) {
        const name = participants[uid] || uid.substring(0, 6);
        votesDiv.innerHTML += `<div>${name}: ${val}</div>`;
      }
    } else {
      votesDiv.innerHTML += '<div>Votes are hidden</div>';
    }

    const controlsDiv = document.getElementById('creatorControls');
    controlsDiv.innerHTML = '';

    // Retrieve creator info locally
    const localCreatorId = localStorage.getItem('creator_userid');

    if (userId === createdBy || userId === localCreatorId) {
    const participantCount = Object.keys(participants).length;
    const voteCount = countVotes(votes || {});

      if (voteCount > 0) {
      const revealBtn = document.createElement('button');
      revealBtn.textContent = revealed ? '🙈 Hide Votes' : '👁 Reveal Votes';
      revealBtn.onclick = () => {
        updateDoc(sessionRef, {
          revealed: !revealed
        });
      };
      controlsDiv.appendChild(revealBtn);
    }

      const resetBtn = document.createElement('button');
      resetBtn.textContent = '🔄 Reset Session';
      resetBtn.onclick = () => {
        updateDoc(sessionRef, {
          votes: {},
          revealed: false
        });
      };
      controlsDiv.appendChild(resetBtn);
    }
  });
}

// Attach events after DOM is ready
document.getElementById('createSessionBtn').addEventListener('click', createSession);
document.getElementById('joinSessionBtn').addEventListener('click', joinSession);
