<template>
  <div>
    <header>
      <h1>Game leader is casting the mantle of judgment upon you</h1>
    </header>
    <body>
      <section id="Section1">
          <div class="wrapper">

            <div v-for="player in players" :key="player.id" class="player-item">
              <h2>{{ player.nameId }} </h2>
              {{ player.answers }}

          <ul>
            <li v-for="(answer, category) in player.answers[0]" :key="category"> <!--Istället för nolla så ska det vara roundnumber-->
              <div class="answerContainer">
                <div class="answerLabel"> {{ category }}: {{ answer }} </div>
              </div>
            </li>
          </ul>
            </div>

          </div>
        </section>

      <div><img id="hamster" src="../../public/img/Hamster.gif" alt="Animated GIF" /></div>
    </body>

    <hr>
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
import { ssrContextKey } from 'vue';
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
    this.name = this.$route.params.name;

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
      console.log("getAnswers", players)
     this.players = players;
     this.isAnswered = true;
   })
   socket.on('movingAllToScoreboard', () => {
    console.log("moved players to scorebaord")
    this.$router.push('/participantleaderboard/'+ this.pollId +'/'+ this.name);
  })
    socket.on('movingAllToResult', () => {
    console.log("moved players to result")
    this.$router.push('/result/' + this.pollId);
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

.player-item:hover {
  transform: scale(1.4);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
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
#hamster{
  height: 100px;
  width: 100px;
}
ul {
  list-style: none;
}
</style>