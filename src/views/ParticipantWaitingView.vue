<template>
  <body class="background">
    <header>
      <h1> {{ uiLabels.gameCode }}: {{ pollId }}</h1>
    </header>

    <h3> {{ uiLabels.shareCode }}! </h3>

    <div class="wrapper">

      <div v-for="player in players" :key="player.id" class="player-item">

        <div id="playerAvatar">
          <h2>{{ player.nameId }} </h2>
          <img :src="player.avatar" alt="Animated GIF">
        </div>


      </div>
    </div>

    <button id="waitButton">{{ uiLabels.waitInfo }} </button> <!-- göra så att man kan justera språk-->


    <!-- 
  <div id="waitingButton">Väntar på spelledaren...</div>
   -->
    <!--
   <router-link v-bind:to="'/participantlivescore/'">
          <button id="next" v-on:click="joinButton">            måste skapa en write poll id number så att det funkar
            {{uiLabels.joinGame}}
          Victors knapp till nästa sida</button>
      </router-link>-->

  </body>

  <footer>
    <router-link v-bind:to="'/participate/'">
      <button id="goBackButton" v-on:click="goBack">{{ uiLabels.backButton }} </button>
      <!-- göra så att man kan justera språk-->
    </router-link>
  </footer>
</template>
  
<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'ParticipateView',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      players: [],
      name: ""
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    this.name = this.$route.params.name

    socket.on("newQuestion", q =>
      this.question = q
    )
    socket.on("dataUpdate", answers =>
      this.submittedAnswers = answers
    )
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    socket.emit('joinSocket', { pollId: this.pollId })

    socket.emit('getPlayers', { pollId: this.pollId })

    socket.on("playersUpdate", players => {
      this.players = players
    })

    socket.on('startGameForAll', () => {
      console.log("start for all participants participantwaitingview")
      this.$router.push('/participantgame/' + this.pollId + '/' + this.name);
    })

  },

  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", { pollId: this.pollId, answer: answer })
    }
  }
}
</script>
  
<style scoped>
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
  height: 100vh;
  /* Gör elementet lika högt som fönstret (hela sidan) */
  top: 0;
  margin-top: -32px;
}

h1 {
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  font-size: 300%;
}

h3 {
  font-weight: normal;
  text-align: center;
  font-size: 200%;
  margin-bottom: 0px;
}

h2 {
  font-weight: bold;
  text-align: center;
  color: rgb(255, 183, 0);
  font-size: 20px
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-left:30px;
  margin-right:30px;
  /* Creates 10 equal-width columns */

}

#goBackButton {
  background-color: rgb(255, 206, 114);
  color: rgb(0, 88, 117);
  height: 10%;
  width: 12em;
  margin: 2%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;

}


#goBackButton:hover {
  background-color: rgb(254, 195, 86);
}


/*
  #waitingButton {
    background-color: rgb(197, 255, 248);
    height: 80px;
    width: 12em;
    margin: 25px;
    position: absolute;
    bottom: 0;
    right: 0;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  */

#waitButton {
  background-color: rgb(255, 206, 114);
  color: rgb(0, 88, 117);
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



ul {
  list-style: none;
}

li {
  font-size: 150%;
  text-align: center;
}

#playerAvatar {
  width: 30%;
  /* Adjust as needed */
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 2px solid black;
  /* Adds a black border */
  border-radius: 10px;
  /* Makes corners rounded */
  padding: 20px;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: 30%;
  margin-top: 10px;
  background-color: rgb(240, 248, 255, 0.6);
}

#playerAvatar img {
  width: 100%;
  height: auto;
}

@media screen and (max-width:50em) {

  .background{margin-top:-21px;}

  .wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Creates 10 equal-width columns */

  }

  #playerAvatar {
    margin-left: 10%;
    height: 120px;
    margin-right: -40px;
  }

  h1 {
    font-size: 200%;
  }

  h2 {
    font-weight: bold;
    text-align: center;
    color: rgb(255, 183, 0);
    font-size: 14px
  }

  h3 {
    font-size: 120%;
    margin-bottom: 20%;;
  }
}</style>