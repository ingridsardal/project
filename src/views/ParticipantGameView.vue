<template>

    <header id="round">
      <h1> Omgång {{ roundNumber }} </h1>
    </header>

    <h3 id="infoText"> 
        Nu ska du skriva en sak under varje kategori som börjar på den angivna bokstaven. Lycka till king!  
    </h3>

    <div class="contentWrapper">
      <div class="categories">

        <h2>
          Kategorier:
        </h2>

        <ul style="list-style: none;">
            <li v-for="(category,ans) in categories" :key="ans">
              {{ category }}:   <input v-model="submittedAnswers[ans]" :placeholder="category">
            </li>
        </ul>

      </div>

      <div class="letterInfo">
        <h2>Bokstav:</h2>
        <p>Här kan du skriva information om vilken bokstav som gäller för rundan.</p>
      </div>
    </div>
    
    <!--<button id="lockAnswers" class="lockButton">Lås in svar!</button>-->

    <router-link v-bind:to="'/participantlivescore/'">
        <button id="lockAnswers" class="lockButton" v-on:click="submitTheAnswers">      <!-- måste skapa en write poll id number så att det funkar-->
          Lås in svar!</button>
    </router-link>

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
     name: "",
     categories: [],
     roundNumber: 0,

   }
 },
 created: function () {
   this.pollId = this.$route.params.id
   this.name = this.$route.params.name

   socket.on("dataUpdate", answers =>
     this.submittedAnswers = answers,
      console.log(this.submittedAnswers)
   )
 socket.emit("pageLoaded", this.lang);
   socket.on("init", (labels) => {
     this.uiLabels = labels
   })

   socket.emit('joinSocket', {pollId: this.pollId})

   socket.emit('startGame', {pollId: this.pollId})

   socket.on('getInfo', (poll) => {
    console.log(poll.categories)
     this.rounds = poll.rounds;
     this.categories = poll.categories;
     this.roundNumber = poll.roundNumber;
   })
   
 },

 methods: {
   submitTheAnswers: function () {
     console.log("submitTheAnswers", this.submittedAnswers)
     socket.emit("submitTheAnswers", {pollId: this.pollId, answer: this.submittedAnswers, name: this.name})
   }
 }
}


</script>


  
  <style scoped>
  #round {
    color: rgb(249, 192, 86);
  }
  
  .contentWrapper {
    display: flex;
    justify-content: space-between;
  }
  
  .categories {
    flex-basis: 50%;
  }
  
  .letterInfo {
    flex-basis: 45%;
  }
  
  .letterInfo h2 {
    margin-top: 0;
  }

  #infoText {
    font-size: 15px;
  }

  .lockButton {
  background-color: rgb(113, 255, 113);
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.lockButton:hover {
  background-color: #70e070;
}
  </style>