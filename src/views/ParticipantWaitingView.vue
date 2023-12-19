<template>
    <header>
        <h1> {{uiLabels.gameCode}}: {{ pollId }}</h1>
    </header>
<br>

<h3> {{uiLabels.shareCode}}! </h3>

<p>
    {{uiLabels.players}}:
    <ul> 
        <li v-for="player in players">
          {{ player.nameId }} 
        </li>
    </ul>
</p>


    
    <button id= "tillfälligPG">{{uiLabels.waitInfo}} </button>      <!-- göra så att man kan justera språk-->


 <!-- 
<div id="waitingButton">Väntar på spelledaren...</div>
 -->
<!--
 <router-link v-bind:to="'/participantlivescore/'">
        <button id="next" v-on:click="joinButton">            måste skapa en write poll id number så att det funkar
          {{uiLabels.joinGame}}
        Victors knapp till nästa sida</button>
    </router-link>-->
 
 <footer>
    <router-link v-bind:to="'/participate/'">
    <button id= "tillbakaButton" v-on:click="tillbaka">{{uiLabels.backButton}} </button>      <!-- göra så att man kan justera språk-->
    </router-link>
</footer>


</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

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

   socket.emit('joinSocket', {pollId: this.pollId})

   socket.emit('getPlayers', {pollId: this.pollId})

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
     socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
   }
 }
}
</script>

<style scoped>

h1 { 
    color:rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 50px; 
    }

h3{font-weight: normal;
  text-align: center;
    color:rgb(0, 0, 0);
    font-size: 30px}

#tillbakaButton {
  background-color: rgb(255, 206, 114);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 5px;
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

#tillfälligPG {
  background-color: rgb(255, 206, 114);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 5px;
}



  ul {
    list-style: none;
  }
  li {
    font-size: 20px;
  }
</style>
