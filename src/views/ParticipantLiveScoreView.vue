<template>
  <div>
    <header>
      <h1>{{uiLabels.liveScoreTile}}</h1>
      <h2>{{uiLabels.roundNumber}} {{ roundCounter }}</h2>
    </header>
    <body>
      <section id="Section1">
          <div class="wrapper">

            <div v-for="player in players" :key="player.id" class="player-item">
              <h1>{{ player.nameId }} </h1>
          <ul>
            <li v-for="(answer, category) in player.answers[roundCounter-1]" :key="category"> <!--Istället för nolla så ska det vara roundnumber-->
              <div class="answerContainer">
                <div class="answerLabel"> {{ uiLabels[category] }}: {{ answer }} </div>
              </div>
            </li>
          </ul>
            </div>

          </div>
        </section>
<br><br>
      <div><img id="hamster" src="../../public/img/Hamster.gif" alt="Animated GIF" /></div>
    </body>
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
import { ssrContextKey } from 'vue';
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
      uiLabels: {},
    };
  },
  created() {
    this.pollId = this.$route.params.id;
    this.name = this.$route.params.name;

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    
    }),

    socket.emit('startGame', {pollId: this.pollId});

    socket.emit('joinSocket', {pollId: this.pollId})

    socket.on('getInfo', (poll) => {
    console.log("getinfo", poll.players)
     this.rounds = poll.rounds;
     this.categories = poll.categories;
     this.roundCounter = poll.roundCounter;
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
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  font-size: 50px; 
  /*opacity: 0;
  animation: fadeIn 4s forwards;*/
}
h2{font-weight: bold;
  text-align: center;
    color:rgb(0, 0, 0);
    font-size: 30px}

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