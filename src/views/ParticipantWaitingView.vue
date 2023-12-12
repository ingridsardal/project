<template>
    <header>
        <h2 id = "gamecode"> {{uiLabels.gameCode}}: {{ pollId }}</h2>
    </header>
<br>

<p id = "shareCode">
    {{uiLabels.shareCode}}! 
</p>

<p>
    {{uiLabels.players}}:
    <ul>
        <li v-for="player in players">
          {{ player.nameId }} 
        </li>
    </ul>
</p>


    <router-link v-bind:to="'/participantgame/'">
    <button id= "tillfälligPG" v-on:click="tillfälligPG">Tillfällig PG </button>      <!-- göra så att man kan justera språk-->
    </router-link>


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
     nameId: "",
     players: []
   }
 },
 created: function () {
   this.pollId = this.$route.params.id
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
  socket.emit("joinGame", {pollId: this.pollId, nameId: this.nameId})

  socket.on("playersUpdate", players => {
        this.players = players
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

 #gamecode { 
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
