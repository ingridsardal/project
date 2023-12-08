<template>
    <header>
        <h2> Spelkod: {{ gameId }}</h2>
    </header>
<br>

<p id = "shareCode">
    Dela koden med dina vänner!  {{ rounds }}
</p>

 <footer>
 <nav>

<ResponsiveNav v-bind:hideNav="hideNav">
    <router-link v-bind:to="'/create/'">
    <button id= "tillbakaButton" v-on:click="tillbaka">Tillbaka </button>      <!-- göra så att man kan justera språk-->
    </router-link>
 </ResponsiveNav>

 <button id="langButton" v-on:click="switchLanguage" :class="{ 'english': lang === 'en', 'swedish': lang === 'sv' }"></button>  

 <ResponsiveNav v-bind:hideNav="hideNav">
    <router-link v-bind:to="'/gamecreator/'">
    <button id= "startaSpelButton" v-on:click="startaSpel">Starta spel </button>      <!-- göra så att man kan justera språk-->
    </router-link>
 </ResponsiveNav>

</nav>
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
     gameId: "",
     rounds: "0"
   }
 },

 beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.updateGameId();
    });
  },

  beforeRouteUpdate(to, from, next) {
    this.updateGameId();
    next();
  },

 created: function () {
    // Listen for the pollId event
    socket.on('createPoll', (pollId) => {
      this.pollId = pollId;
      this.gameId = pollId;
      this.rounds = rounds;
    });

    socket.emit('startGame', (gameId));
      socket.on('getInfo', (rounds) => {
        this.rounds = rounds
      })
  },


 methods: {
  updateGameId() {
      // Extract the path from the URL
      const pathArray = this.$route.path.split('/');
      // Get the last part of the path
      this.gameId = pathArray[pathArray.length - 1];
    },
  
   submitAnswer: function (answer) {
     socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
   }
 }
}
</script>

<style>

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
  #langButton{
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  left:13em;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.english {
    background-image: url('../../public/img/Flag_of_Sweden.png'); 
  }
  .swedish {
    background-image: url('../../public/img/englishFlag.jpg'); 
  }
</style>
