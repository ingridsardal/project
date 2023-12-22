<template>

    <header id="round">
      <h1> {{ uiLabels.round }} {{ roundCounter }} </h1>
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
              {{ uiLabels[category] }}:   <input v-model="submittedAnswers[category]" :placeholder="uiLabels[category]">
            </li>
        </ul>

      </div>

      <div class="letterInfo">
        <h2>{{uiLabels.letter}} {{ this.firstSelectedLetter.toUpperCase() }}</h2>
      </div>
      <div class="countdown" v-if="gotFirstAnswer">
       {{ startCountdown() }}
        <p>{{ countdown }}</p>
      </div>
    </div>
    
    <!--<button id="lockAnswers" class="lockButton">Lås in svar!</button>-->

        <button id="lockAnswers" class="lockButton" v-on:click="submitTheAnswers">      <!-- måste skapa en write poll id number så att det funkar-->
          {{uiLabels.lockAnswer}}</button>

  </template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
import { useRouter } from 'vue-router';
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
     name: "",
     categories: [],
     roundCounter: 0,
     selectedLetter:'',
     firstSelectedLetter: '',
     gotFirstAnswer: false,
     countdown: 8,
     isSent: false,
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
     this.roundCounter = poll.roundCounter;
     this.selectedLetter = poll.selectedLetter;
     this.firstSelectedLetter = poll.selectedLetter;
   })

   socket.on('getAnswers', (players) => {
      this.gotFirstAnswer = true;
   })
   
 },

 methods: {
   submitTheAnswers: function () {
    if (!this.isSent) {
     console.log("submitTheAnswers", this.submittedAnswers)
     socket.emit("submitTheAnswers", {pollId: this.pollId, answer: this.submittedAnswers, name: this.name})
     this.$router.push('/participantlivescore/' + this.pollId +'/'+ this.name);
     this.isSent = true;
    }
    return
   },
   startCountdown() {
    // Only start the countdown if it's not already running
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.intervalId);
          this.submitTheAnswers();
        }
      }, 1000);
    }
  },
}
}


</script>


  
  <style scoped>

h1 { 
    color:rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 50px; 
    }



  h2{font-weight: normal;
  text-align: center;
    color:rgb(0, 0, 0);
    font-size: 30px}


h3{font-weight: bold;}
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
.countdown {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.countdown p {
  font-size: 7em; /* Adjust the font size as needed */
  color: red;
}
  </style>