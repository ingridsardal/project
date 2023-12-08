<template>
       <div>
        <h1>
          {{ uiLabels.headerJoinGame }}
        </h1>

        <label>
      <br>
      Write poll id: 
      <input type="text" v-model="pollId">
    </label>
    <br>
    <label>
      Name: 
      <input type="text" v-model="nameId">
    </label>
   <br>
    <router-link v-bind:to="'/participantwaiting/'+pollId">
        <button id="joinButton" v-on:click="joinButton">           <!-- måste skapa en write poll id number så att det funkar-->
          {{uiLabels.joinGame}}
        </button>
    </router-link>
    </div>

    <footer>
    <nav>
  <ResponsiveNav v-bind:hideNav="hideNav">

    <router-link v-bind:to="'/'">
      <button id= "tillbakaButton" v-on:click="tillbaka">{{uiLabels.backButton}}  </button>      <!-- göra så att man kan justera språk-->
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
        nameId: ""
      }
    },
    created: function () {
      this.pollId = this.$route.params.id
      socket.emit('joinPoll', this.pollId)
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
      
    },

    methods: {
      submitAnswer: function (answer) {
        socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      },
      joinButton: function () {
      socket.emit("joinGame", {pollId: this.pollId, nameId: this.nameId})
    }
    }
  }
  </script>
   <style scoped>
    #joinButton {
      height: 100px;
      width: 33%;
      margin:19px;
      font-size: 30px;
      background-color: lightgreen;
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
    h1 {color:rgb(249, 192, 86)}
</style>
  