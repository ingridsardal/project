<template>
  <body class="background">
    <div v-if="!readyToStart" class="cover">
      <h1 class="startNum">{{ waitToStartNum }}</h1>
    </div>

    <div v-else>
      <header id="round">
        <h1> {{ uiLabels.round }} {{ roundCounter }} </h1>
      </header>

      <div class="contentWrapper">
        <div class="categories">

          <h2>{{ uiLabels.categories }} </h2>

          <ul style="list-style: none;">
            <li v-for="(category, ans) in categories" :key="ans">
              <div class="input-container"> 
              {{ uiLabels[category] }}: <br> <input class="small-input" v-model="submittedAnswers[category]"
                :placeholder="uiLabels[category]">
              </div>
            </li>
          </ul>

        </div>

        <div class="letterInfo">
          <h2>{{ uiLabels.letter }} </h2>
          <h1 class="letterSize"> {{ this.firstSelectedLetter.toUpperCase() }}</h1>
        </div>
        <div class="countdown" v-if="gotFirstAnswer">
          {{ startCountdown() }}
          <p>{{ countdown }}</p>
        </div>
      </div>
    </div>

    <!--<button id="lockAnswers" class="lockButton">Lås in svar!</button>-->

    <button id="lockAnswers" class="lockButton" v-on:click="submitTheAnswers">
      <!-- måste skapa en write poll id number så att det funkar-->
      {{ uiLabels.lockAnswer }}</button>
  </body>
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
      selectedLetter: '',
      firstSelectedLetter: '',
      gotFirstAnswer: false,
      countdown: 8,
      isSent: false,
      waitToStartNum: 3,
      waitToStartNumHolder: null,
      readyToStart: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    this.name = this.$route.params.name

    this.waitToStart();

    socket.on("dataUpdate", answers =>
      this.submittedAnswers = answers,
      console.log(this.submittedAnswers)
    )
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    socket.emit('joinSocket', { pollId: this.pollId })

    socket.emit('startGame', { pollId: this.pollId })

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
        socket.emit("submitTheAnswers", { pollId: this.pollId, answer: this.submittedAnswers, name: this.name })
        this.$router.push('/participantlivescore/' + this.pollId + '/' + this.name);
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
    waitToStart() {
      this.waitToStartNumHolder = setInterval(() => {
        if (this.waitToStartNum > 0) {
          this.waitToStartNum--;
        } else {
          clearInterval(this.waitToStartNumHolder);
          this.readyToStart = true;
        }
      }, 1000);
    },
  }
}


</script>


  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

.input-container {
    margin-bottom: 10px; /* Add margin as needed */
  }

  .small-input {
    width: 200px; /* Adjust the width as needed */
    height: 22px; /* Adjust the height as needed */
    font-size: 14px; /* Adjust the font size as needed */
    /* Add any other styling properties as needed */
  }
.background {
  /* Stilen för att göra bilden till bakgrund på hela sidan */
  background-image: url('/img/bluebg.png');
  background-size: cover;
  /* Anpassar storleken på bilden så att den täcker hela sidan */
  background-position: center;
  /* Centrerar bakgrundsbilden på sidan */
  height: 110vh;
  /* Gör elementet lika högt som fönstret (hela sidan) */
  margin-top: -34px
}

body {
  font-family: 'Open Sans', sans-serif;
  color: rgb(0, 88, 117);
}

h1 {
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  font-size: 70px;
}

.cover {
  background-color: rgb(249, 192, 86);
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.startNum {
  font-size: 10em;
  color: rgb(255, 255, 255);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
}

h2 {
  font-weight: normal;
  text-align: center;
  font-size: 30px;
  margin-top: -30px;
}


h3 {
  font-weight: bold;
}

#round {
  color: rgb(249, 192, 86);
}

.contentWrapper {
  display: flex;
  justify-content: space-between;
  
}

.categories {
  flex-basis: 50%;
  font-size: 18px;
}



.letterInfo {
  flex-basis: 45%;
}

.letterInfo h2 {
  
}

.letterInfo h2 {
 
}

.lockButton {
  background-color: rgb(113, 255, 113);
  color: rgb(0, 88, 117);

  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  right: 0;

  border: none;
  border-radius: 10px;
  cursor: pointer;

  font-family: 'Open Sans', sans-serif;
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
  font-size: 20em;
  /* Adjust the font size as needed */
  color: red;
}

.letterSize {
  font-size: 20em;
  margin-top: -35px; 
  margin-left: 14px; 
}

@media screen and (max-width:50em) { 

  .input-container {
    margin-bottom: 10px; /* Add margin as needed */
  }

  .small-input {
    width: 150px; /* Adjust the width as needed */
    height: 22px; /* Adjust the height as needed */
    font-size: 14px; /* Adjust the font size as needed */
    /* Add any other styling properties as needed */
  }

  .lockButton {
  
  margin: 25px;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 0;
  width: 10em;
}

  h1 {
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  font-size: 70px;
}

.letterSize {
  font-size: 7em;
  margin-top: -30px;  
}

.countdown p {
  font-size: 7em;
  /* Adjust the font size as needed */
  color: red;
  margin-left: 220px;
  margin-top: 400px;
}

h2 {
  font-weight: normal;
  text-align: center;
  font-size: 30px
}

.contentWrapper {
  display: flex;
  justify-content: space-between;

}

.categories {
  flex-basis: 50%;
  font-size: 14px;
}



.letterInfo {
  flex-basis: 45%;
}

}
</style>