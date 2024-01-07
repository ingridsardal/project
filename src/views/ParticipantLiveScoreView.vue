<template>
  <body class="background">
    <header>
      <h1>{{ uiLabels.liveScoreText }}</h1>
    </header>
      <div class="wrapper">

        <div v-for="player in players" :key="player.id" class="player-item">
          <h2>{{ player.nameId }}
            <div id="playerAvatar">
              <img :src="player.avatar" alt="Animated GIF">
            </div>
          </h2>
          <ul>
            <li v-for="(answer, category) in player.answers[roundCounter - 1]" :key="category">
              <!--Istället för nolla så ska det vara roundnumber-->
              <div class="answerContainer">
                <div class="answerLabel"> {{ uiLabels[category] }}: {{ answer }} </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <button id="waitButton">{{ uiLabels.waitInfoLiveScore }} </button>
    <!--<div><img id="hamster" src="../../public/img/Hamster.gif" alt="Animated GIF" /></div>-->
  </body>
</template>

<script>
// @ is an alias to /src
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

      socket.emit('startGame', { pollId: this.pollId });

    socket.emit('joinSocket', { pollId: this.pollId })

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
      this.$router.push('/participantleaderboard/' + this.pollId + '/' + this.name);
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
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
  color: rgb(0, 88, 117);
}

.background {
  /* Stilen för att göra bilden till bakgrund på hela sidan */
  background-image: url('/img/bluebg.png');
  background-size: cover;
  /* Anpassar storleken på bilden så att den täcker hela sidan */
  background-position: center;
  /* Centrerar bakgrundsbilden på sidan */
  height: 157vh;
  /* Gör elementet lika högt som fönstret (hela sidan) */

}

.wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  /* Adjust as needed */

}

.player-item {
  flex: 0 0 30%;
  /* Adjust width as needed */
  margin: 10px;
  padding: 10px;
  border: 2px solid black;
  /* Adds a black border */
  border-radius: 10px;
  /* Makes corners rounded */
  transition: transform 1s ease-in-out;
  background-color: rgb(240, 248, 255, 0.6);
}

/* Kanske lite för mycket animation?
.player-item:hover {
  transform: scale(1.4);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
*/

h1 {
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  font-size: 40px;
  /*opacity: 0;
  animation: fadeIn 4s forwards;*/
}

h2 {
  font-weight: bold;
  text-align: center;
  color: rgb(255, 183, 0);
  font-size: 200%
}

h3 {
  font-weight: bold;
  text-align: center;
  font-size: 30px
}



@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

#hamster {
  height: 100px;
  width: 100px;
}

ul {
  list-style: none;
}

/*  
#playerAvatar {

  width: 15%; 
  height: 15%; 
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 2px solid black; 
  border-radius: 10px; 
  padding: 10px;
}*/

#waitButton {
  background-color: rgb(255, 206, 114);
  color: rgb(0, 88, 117);
  opacity: 0.8;
  height: 10%;
  width: 12em;
  margin: 2%;
  position: fixed;
  bottom: 0;
  right: 0;
  border-radius: 10px;
  border: none;
  font-family: 'Open Sans', sans-serif;
}

#playerAvatar img {
  width: 150px;
  height: auto;
}

@media screen and (max-width:50em) {
  h1 {
    font-size: 25px;
  }
  .player-item{  
  /* Adjust width as needed */
  margin: 7px;
  padding: 7px;}
  #playerAvatar img{width: 100px;}
  .answerContainer{ margin-left:-30px;font-size: 12px;}
}

.background {
  margin-top: -17px;
  height:212vh;
}</style>