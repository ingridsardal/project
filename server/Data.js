'use strict';
const languages = ["en", "se"];
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.getUILabels = function (lang = "en") {
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(pollId, lang="en", rounds, categories, roundCounter) {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;  
    poll.rounds = rounds;
    poll.roundCounter = roundCounter;
    poll.categories = categories;
    poll.players = [];
    poll.roundNumber = 1;
    poll.selectedLetter = "";
    this.polls[pollId] = poll;
    console.log("poll created ");
  }
  return this.polls[pollId];
  }

  /*
  Data.prototype.roundCount = function(roundCounter) {{
      let poll = {};
      poll.roundCounter = roundCounter;  
      console.log("roundadded");
    }
    return this.poll[roundCounter];
    }
*/


Data.prototype.addQuestion = function(pollId, q) {
  const poll = this.polls[pollId];
  console.log("question added to", pollId, q);
  if (typeof poll !== 'undefined') {
    poll.questions.push(q);
  }
}

Data.prototype.editQuestion = function(pollId, index, newQuestion) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[index] = newQuestion;
  }
}

Data.prototype.getQuestion = function(pollId, qId=null) {
  const poll = this.polls[pollId];
  console.log("question requested for ", pollId, qId);
  if (typeof poll !== 'undefined') {
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return []
}

Data.prototype.submitAnswer = function(pollId, answer, name) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const playerIndex = poll.players.findIndex(player => player.nameId === name);
    if (playerIndex !== -1) {
      const player = poll.players[playerIndex];
      player.answers.push(answer);
      console.log("answers looks like ", player.answers);
    }
  }
}

Data.prototype.getAnswers = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return {q: poll.questions[poll.currentQuestion].q, a: answers};
    }
  }
  return {}
}

// Data vi gjort själva:
Data.prototype.startGame = function(pollId) {
  const poll = this.polls[pollId];
  console.log("game started", poll);
  if (typeof poll !== "undefined") {
    console.log("Game started");
    return poll;
  }
  console.log("Game not started", typeof poll);
};

Data.prototype.joinGame = function(pollId, nameId) {
  const poll = this.polls[pollId];
  console.log("joingame", poll)
  if (typeof poll !== "undefined") {
  for (let i = 0; i < poll.players.length; i++) {
    if (poll.players[i].nameId === nameId) {
      return false;
    }
  }
    let player = {
      nameId: nameId,
      answers: [],
      points: 0,
      avatar: "",
    };
    poll.players.push(player);
    console.log("player joined", player.nameId);
    return true
}
};

Data.prototype.getPlayers = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    console.log("Updated players");
    return poll.players;
  }
  return [];
};

Data.prototype.startRound = function(pollId, selectedLetter) {
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    console.log("Round started");
    poll.selectedLetter = selectedLetter;
  }   
}

export { Data };



