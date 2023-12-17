<template>
  <div>
    <header>
      <h2> Dags att rätta! </h2>
    </header>

    <body>
      <h3 style="font-weight: normal;">Markerar rätt svar:</h3>

      <section id="Section1">
        <div class="wrapper">

          <div v-for="player in players" :key="player.id" class="player-item">
            <h2>{{ player.nameId }} </h2>

  <ul>
    <li v-for="(answer, category) in player.answers[0]" :key="category">
      <div class="answerContainer">
        <input type="checkbox" :checked="checkedAnswers[player.id] && checkedAnswers[player.id][answer]" @change="handleCheckboxChange(player.nameId, answer, $event)">
        <div class="answerLabel"> {{ category }}: {{ answer }} </div>
      </div>
    </li>
  </ul>
          </div>

        </div>
      </section>
      <div><img id="hamster" src="../../public/img/Hamster.gif" alt="Animated GIF" /></div>

      <br />
      <hr>
    </body>
    <footer>
      <router-link v-bind:to="'/creatorleaderboard/' + pollId">
        <button id="Tillfällig" v-on:click="giveScore">Tillfällig knapp som gör att man kommer till Creator scoreboard </button>
        <!-- göra så att man kan justera språk-->
      </router-link>
    </footer>
  </div>
</template>

<script>
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  data() {
    return {
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      pollId: "inactive poll",
      players: [],
      categories: [],
      roundNumber: 0,
      checkedAnswers: {},
    };
  },


  created() {
    this.pollId = this.$route.params.id;

    socket.emit('startGame', {pollId: this.pollId});

    socket.emit('joinSocket', {pollId: this.pollId})

    socket.on('getInfo', (poll) => {
    console.log("getinfo", poll.players)
     this.rounds = poll.rounds;
     this.categories = poll.categories;
     this.roundNumber = poll.roundNumber;
     this.players = poll.players
   })
   socket.on('getAnswers', (players) => {
     this.players = players;
     this.isAnswered = true;
   })
  },

  methods: {
    startAnimation(playerId) {
      this.animatedPlayer = playerId;
    },

    handleCheckboxChange(playerName, answer, event) {
    // Initialize this player's checked answers object if it doesn't exist yet
    if (!this.checkedAnswers[playerName]) {
      this.checkedAnswers = { ...this.checkedAnswers, [playerName]: {} };
    }

    // Update the checked state of this answer for this player
    this.checkedAnswers = {
      ...this.checkedAnswers,
      [playerName]: { ...this.checkedAnswers[playerName], [answer]: event.target.checked },
    };
  },
    giveScore() {
    // Update each player's points with the count from checkedAnswers
    this.players.forEach(player => {
      if (this.checkedAnswers[player.nameId]) {
        player.points = Object.values(this.checkedAnswers[player.nameId]).filter(checked => checked).length;
      }
    });
      console.log("giveScore", this.players, this.checkedAnswers)
      socket.emit('giveScore', {pollId: this.pollId, players: this.players})
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
.wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; /* Adjust as needed */
}

.player-item {
  flex: 0 0 30%; /* Adjust width as needed */
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: transform 1s ease-in-out;
}

.answerContainer {
  display: flex;
  align-items: center;
}

.answerLabel {
  margin-right: 10px;
}

h1 {
  color: rgb(203, 60, 50);
  text-shadow: rgb(255, 0, 0) 1px 0 10px;
  font-size: 50px;
  opacity: 0;
  animation: fadeIn 4s forwards;
}

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
h2 { 
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  font-size: 50px; 
}

#Tillfällig {
  background-color: rgb(113, 255, 113);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  right: 0;
}

ul {
  list-style: none;
}
</style>