<template>

    <header id="round">
      <h1> Omgång {{ roundNumber }} </h1>
    </header>

    <h3 id="infoText"> 
      {{uiLabels.infotext}}
    </h3>

    <div class="contentWrapper">
      <div class="categories">

        <h2>
          {{ uiLabels.categories }}
        </h2>

        <ul style="list-style: none;">
            <li v-for="(category,ans) in categories" :key="ans">
              {{ category }}:   <input v-model="submittedAnswers[category]" :placeholder="category">

            </li>
        </ul>

      </div>

      <div class="letterInfo">
        <h2>{{uiLabels.letter}} {{ this.firstSelectedLetter }}</h2>
      </div>
      <div v-if="gotFirstAnswer">
       {{ startCountdown() }}
        <p>{{ countdown }}</p>
      </div>
    </div>
    
    <!--<button id="lockAnswers" class="lockButton">Lås in svar!</button>-->

        <button id="lockAnswers" class="lockButton" v-on:click="submitTheAnswers">      <!-- måste skapa en write poll id number så att det funkar-->
          {{uiLabels.lock-answer}}</button>

  </template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
import { useRouter } from 'vue-router';
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
     selectedLetter:'',
     firstSelectedLetter: '',
     gotFirstAnswer: false,
     countdown: 8,
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
     this.selectedLetter = poll.selectedLetter;
     this.firstSelectedLetter = poll.selectedLetter;
   })

   socket.on('getAnswers', (players) => {
      this.gotFirstAnswer = true;
   })
   
 },

 methods: {
   submitTheAnswers: function () {
     console.log("submitTheAnswers", this.submittedAnswers)
     socket.emit("submitTheAnswers", {pollId: this.pollId, answer: this.submittedAnswers, name: this.name})
     this.$router.push('/participantlivescore/' + this.pollId);
   },
 startCountdown() {
      if (this.countdown > 0) {
        setTimeout(() => {
          this.countdown--;
        }, 1000);
      } else {
        this.submitTheAnswers();
      }
    },
  },
};


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