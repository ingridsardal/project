<template>
    <header>
        <h2> Spelkod: {{ pollId }}</h2>
    </header>
<br>

<p id = "shareCode">
    Dela koden med dina vänner!
</p>

<p>
    Spelare:
    <ul>
        <li v-for="player in players">
          {{ player.nameId }}
        </li>
    </ul>
</p>

 <footer>
    <router-link v-bind:to="'/create/'">
    <button id= "tillbakaButton" v-on:click="tillbaka">Tillbaka </button>      <!-- göra så att man kan justera språk-->
    </router-link>
    <router-link v-bind:to="'/creatorgame/'">
    <button id= "startaSpelButton" v-on:click="startaSpel">Starta spel </button>      <!-- göra så att man kan justera språk-->
    </router-link>
</footer>


</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

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
     categories: [],
     players: []
   }
 },

 created: function () {
    // Listen for the pollId event
    this.pollId = this.$route.params.id;

    socket.emit('startGame', {pollId: this.pollId});
  
    socket.on('getInfo', (poll) => {
        this.rounds = poll.rounds;
        this.categories = poll.categories;
        this.players = poll.players;
      })
    
    socket.on('playersUpdate', (players) => {
        this.players = players;
      })
      
  },


 methods: {
   submitAnswer: function (answer) {
     socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
   },
   startaSpel: function () {
    socket.emit("startForAll", {pollId: this.pollId})
 }
}
}
</script>

<style scoped>

#shareCode {
    text-align: center;
    color:rgb(0, 0, 0);
    font-size: 30px
    }

#tillbakaButton {
  background-color: rgb(255, 206, 114);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  left: 0;
}

#startaSpelButton {
  background-color: rgb(113, 255, 113);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  right: 0;
}

 h2 { 
    color:rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 50px; 
    }
  
  ul {
    list-style: none;
  }

  li {
    font-size: 20px;
  }

</style>
