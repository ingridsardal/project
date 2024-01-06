<template>
  <div>
    <body class="background">
    <header>
      <h1> {{uiLabels.giveScore}} </h1>
      <h3  style="font-weight: bold;">{{uiLabels.roundNumber}} {{ roundCounter }}, {{uiLabels.letter}}{{ selectedLetter.toUpperCase() }}</h3>
    </header>
      <h3>{{uiLabels.markScore}} </h3>

      <section id="Section1">
        <div class="wrapper">

          <div v-for="player in players" :key="player.id" class="player-item">
            <h2>{{ player.nameId }} 
              <div id="playerAvatar"> 
                <img :src="player.avatar" alt="Animated GIF" >
              </div>
            </h2>

  <ul>
    <li v-for="(answer, category) in player.answers[roundCounter-1]" :key="category">
      <div class="answerContainer">
        <input type="checkbox" :checked="checkedAnswers[player.id] && checkedAnswers[player.id][answer]" @change="handleCheckboxChange(player.nameId, category, answer, $event)">
        <div class="answerLabel"> {{ uiLabels[category] }}: {{ answer }} </div>
      </div>
      
    </li>
  </ul>
          </div>

        </div>
      </section>
      <!--<div><img id="hamster" src="../../public/img/Hamster.gif" alt="Animated GIF" /></div>

      <br />
-->
    </body>
    <footer>

      <!--<router-link v-bind:to="'/creatorleaderboard/' + pollId">-->
        <button id="showScoreboardButton" v-on:click="giveScore">{{uiLabels.showScoreboard}}</button>
        <!-- göra så att man kan justera språk-->
      <!--</router-link>-->
    </footer>
  </div>
</template>

<script>
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer")); 

export default {
  data() {
    return {
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      pollId: "inactive poll",
      players: [],
      categories: [],
      roundCounter: 0,
      checkedAnswers: {},
      isChecked: false,
      selectedLetter: "",
    };
  },


  created() {
    this.pollId = this.$route.params.id;
    socket.emit("pageLoaded", this.lang);

    socket.emit('startGame', {pollId: this.pollId});

    socket.emit('joinSocket', {pollId: this.pollId})

    socket.on('getInfo', (poll) => {
    console.log("getinfo", poll.players)
     this.rounds = poll.rounds;
     this.categories = poll.categories;
     this.roundCounter = poll.roundCounter;
     this.players = poll.players
     this.selectedLetter = poll.selectedLetter;
     
   })
   socket.on('getAnswers', (players) => {
      console.log("getAnswers", players)
     this.players = players;
     this.isAnswered = true;
   })
   socket.on('movingAllToScoreboard', () => {
    console.log("moved players to scorebaord")
    this.$router.push('/creatorleaderboard/' + this.pollId);
  })
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },

  methods: {
    startAnimation(playerId) {
      this.animatedPlayer = playerId;
    },

    handleCheckboxChange(playerName, category, answer, event) {
    // Initialize this player's checked answers object if it doesn't exist yet
    if (!this.checkedAnswers[playerName]) {
      this.checkedAnswers = { ...this.checkedAnswers, [playerName]: {} };
    }
    // Update the checked state of this answer for this player
    this.checkedAnswers = {
      ...this.checkedAnswers,
      [playerName]: { ...this.checkedAnswers[playerName], [answer+category]: event.target.checked },
    };
  },

    giveScore() {
    // Update each player's points with the count from checkedAnswers
    this.players.forEach(player => {
      if (this.checkedAnswers[player.nameId]) {
        player.points = Object.values(this.checkedAnswers[player.nameId]).filter(checked => checked).length;
      console.log(this.checkedAnswers, "poäng")
      this.isChecked = true;

      }
    });
      console.log("giveScore", this.players, this.checkedAnswers)
      if (this.players.every(player => player.hasAnswered === true)) {
      socket.emit('giveScore', {pollId: this.pollId, players: this.players, isChecked: this.isChecked})
      socket.emit('moveToScoreboard', {pollId: this.pollId})
      }
      else {
        alert("Alla spelare har inte svarat än") //uilabel
      }

      
    }
  },
};
</script>

<style scoped>
/* Add your styles here */

.background {
  /* Stilen för att göra bilden till bakgrund på hela sidan */
  background-image: url('/img/bluebg.png'); 
  background-size: cover !important; /* Anpassar storleken på bilden så att den täcker hela sidan */
  background-position: center; /* Centrerar bakgrundsbilden på sidan */
  height: 100vh; /* Gör elementet lika högt som fönstret (hela sidan) */
  top: 0;
}
.wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; /* Adjust as needed */
}

.player-item {
  flex: 0 0 30%; /* Adjust width as needed */
  margin: 10px;
  padding: 10px;
  border: 2px solid black; /* Adds a black border */
  border-radius: 10px; /* Makes corners rounded */
  transition: transform 1s ease-in-out;
}
#playerAvatar img{
  width:150px;
}

.answerContainer {
  display: flex;
  align-items: center;
}

.answerLabel {
  margin-right: 10px;
}
/*
h1 {
  color: rgb(203, 60, 50);
  text-shadow: rgb(255, 0, 0) 1px 0 10px;
  font-size: 50px;
  opacity: 0;
  animation: fadeIn 4s forwards;
}*/

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.title {
  margin: 0;
}
#hamster {
  height: 100px;
  width: 100px;
}
h1 { 
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  font-size: 50px; 
}
h2{font-weight: bold;
  text-align: center;
    color:rgb(255, 183, 0);
    font-size: 200%}

h3{font-weight: normal;
  text-align: center;
    color:rgb(0, 0, 0);
    font-size: 30px}


#showScoreboardButton {
  background-color: rgb(113, 255, 113);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: static;
  margin-left:88%;

  border: none;
  border-radius: 10px;
}

#showScoreboardButton:hover {
  background-color: #70e070;
}
ul {
  list-style: none;
}
</style>