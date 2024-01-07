function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang, d.rounds, d.categories, d.firstSelectedLetter);
  });

  socket.on('startRound', function(d) {
    console.log("sockets", d.roundCounter)
    data.startRound(d.pollId, d.selectedLetter, d.roundCounter);
    io.to(d.pollId).emit('moveToNextRound');

  });

  /*
  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('editQuestion', function(d) {
    data.editQuestion(d.pollId, d.index, {q: d.q, a: d.a});
    socket.emit('questionEdited', data.getAllQuestions(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    //socket.emit('newQuestion', data.getQuestion(pollId));
    socket.emit('dataUpdate', data.getAnswers(pollId));
  });

  
  socket.on('runQuestion', function(d) {
    //io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    //io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

/*
  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });*/

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  // Här lägger vi till egna sockets
  socket.on('joinGame', function(d){;
    socket.emit('isTaken', data.joinGame(d.pollId, d.nameId, d.avatar))
   });

   socket.on('getNumOfPlayers', function(pollId){;
    console.log("num of players", pollId)
    socket.emit('numOfplayers', data.getPlayers(pollId));
   });

   socket.on('getPlayers', function(d){;
    io.to(d.pollId).emit('playersUpdate', data.getPlayers(d.pollId));
   });

   socket.on('joinSocket', function(d){;
    socket.join(d.pollId);
  });

   socket.on('startGame', function(d){;
    console.log("updateGameInfo")
    socket.emit('getInfo', data.startGame(d.pollId));
   }); 

   socket.on('startForAll', function(d){;
    console.log("start for all", d.pollId)
    io.to(d.pollId).emit('startGameForAll');
   });
   
   socket.on('moveToScoreboard', function(d){;
    console.log("sending players to scoreboard", d.pollId)
    io.to(d.pollId).emit('movingAllToScoreboard');
   });

   socket.on('moveToResult', function(d){;
    console.log("sending players to resultview", d.pollId)
    io.to(d.pollId).emit('movingAllToResult');
   });

   socket.on('submitTheAnswers', function(d){;
    console.log("submit answers", d)
    data.submitAnswer(d.pollId, d.answer, d.name)
    io.to(d.pollId).emit('getAnswers', data.getPlayers(d.pollId));
   });

   socket.on("giveScore", function(d){  
    console.log("give score", d)
    data.giveScore(d.pollId, d.players, d.isChecked)
   });
   

   
}

export { sockets };