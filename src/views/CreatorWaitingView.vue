<template>
    <header>
        <h1> {{uiLabels.gameCode}}: {{ pollId }}</h1>
    </header>
<br>

<h2 class="shareCode"> {{uiLabels.shareCode}}! </h2>

    {{uiLabels.players}}:
<div class="wrapper">

          <div v-for="player in players" :key="player.id" class="player-item">
            <h1>{{ player.nameId }} 
              <div id="playerAvatar"> 
                <img :src="player.avatar" alt="Animated GIF" >
              </div>
            </h1>

</div></div>

 <footer>
    <router-link v-bind:to="'/create/'">
    <button id= "tillbakaButton" v-on:click="tillbaka">{{uiLabels.backButton}} </button>      <!-- göra så att man kan justera språk-->
    </router-link>
    <button id= "startaSpelButton" v-on:click="startaSpel">{{uiLabels.startGame}} </button>      <!-- göra så att man kan justera språk-->
</footer>


</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
import { ssrContextKey } from 'vue';
const socket = io(sessionStorage.getItem("dataServer")); 

// Get the full URL
const currentURL = window.location.href;

// Extract the path from the URL
const pathArray = window.location.pathname.split('/');

// Get the last part of the path
const gameId = pathArray[pathArray.length - 1];

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
     submittedAnswers: {},
     pollId: "",
     rounds: "0",
     roundCounter: "0",
     categories: [],
     uiLabels: {},
     players: [],
     firstSelectedLetter: "",
     selectedLetter: ""
   }
 },

 created: function () {
    this.pollId = this.$route.params.id;
    socket.emit("pageLoaded", this.lang);
    socket.emit('startGame', {pollId: this.pollId});

    socket.emit('joinSocket', {pollId: this.pollId})
  
    socket.on('getInfo', (poll) => {
        this.rounds = poll.rounds;
        this.categories = poll.categories;
        this.players = poll.players;
        this.roundCounter=poll.roundCounter;
        this.firstSelectedLetter = poll.firstSelectedLetter;
        this.selectedLetter = poll.selectedLetter;
      })
    
    socket.on('playersUpdate', (players) => {
      console.log("playersUpdate creatorwaitingview")
        this.players = players;
      })
    
    socket.on('startGameForAll', () => {
        console.log("start for all participants creatorwaitingview")
        this.$router.push('/creatorgame/' + this.pollId);
      })

    socket.on("init", (labels) => {
     this.uiLabels = labels
   })
  },


 methods: {
   submitAnswer: function (answer) {
     socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
   },
   startaSpel: function () {
    if (this.players.length < 1) {
      alert(this.uiLabels.noPlayers) 
    } 
    else {
    console.log("starta spel creatorwaitingview")
    socket.emit('startForAll', {pollId: this.pollId});
    }
 } 
}
}
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Creates 10 equal-width columns */
  
}

.shareCode {
    text-align: center;
    color:rgb(0, 0, 0);
    font-size: 200%;
    }

  #tillbakaButton {
  background-color: rgb(255, 206, 114);
  height: 10%;
  width: 12em;
  margin: 2%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}


#tillbakaButton:hover {
  background-color:rgb(254, 195, 86);
}

#startaSpelButton {
  background-color: rgb(113, 255, 113);
  height: 10%;
  width: 12em;
  margin: 2%;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
#startaSpelButton:hover {
  background-color: #70e070;;
}
h1 { 
    color:rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 300%; 
    }

h2 {font-weight: normal;
  text-align: center;
    color:rgb(0, 0, 0);
    font-size: 200%}

  ul {
    list-style: none;
  }

  li {
    font-size: 150%;
    text-align: center;
  }
  #playerAvatar {
  width: 30%; /* Adjust as needed */
  
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 2px solid black; /* Adds a black border */
  border-radius: 10px; /* Makes corners rounded */
  padding: 10px;
  margin-left: 30%;
  margin-top: 10px;
}

#playerAvatar img {
  width: 100%;
  height: auto;
}

</style>
