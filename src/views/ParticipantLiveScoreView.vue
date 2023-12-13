<template>
  <div>
    <header>
      <h1>Game leader is casting the mantle of judgment upon you</h1>
    </header>

    <section id="Section1">
      <div class="wrapper">
        <div v-for="player in players" :key="player.id" class="player-item">
          <h2>{{ player.name }}</h2>
          <p>Player ID: {{ player.id }}</p>
          <ul>
            <li v-for="(answer, category) in player.answers" :key="category">
              <strong>{{ category }}:</strong> {{ answer }}
            </li>
          </ul>
        </div>
      </div>
    </section>
    <div><img id="hamster" src="../../public/img/Hamster.gif" alt="Animated GIF" /></div>

    <br />
    <hr>
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
import { ssrContextKey } from 'vue';
const socket = io("localhost:3000");

// Get the full URL
const currentURL = window.location.href;

// Extract the path from the URL
const pathArray = window.location.pathname.split('/');

// Get the last part of the path
const gameId = pathArray[pathArray.length - 1];
export default {
  data() {
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
     uiLabels: {},
      players: [
        { id: 1, name: 'John', answers: { city: 'New York', country: 'USA', animal: 'Lion' } },
        { id: 2, name: 'Anna', answers: { city: 'Paris', country: 'France', animal: 'Elephant' } },
        { id: 3, name: 'Simon', answers: { city: 'Tokyo', country: 'Japan', animal: 'Panda' } },
        { id: 4, name: 'Pimon', answers: { city: 'Berlin', country: 'Germany', animal: 'Giraffe' } },
        { id: 5, name: 'Dimon', answers: { city: 'Sydney', country: 'Australia', animal: 'Kangaroo' } },
      ],
      animatedPlayer: null,
    };
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.name = this.$route.params.name
    socket.emit("pageLoaded", this.lang);

    socket.on('submitAnswer', (players) => {
      console.log("svar mottaget")
        this.players = players;
      })
  },

  methods: {
    startAnimation(playerId) {
      this.animatedPlayer = playerId;
    },
    
  },
};
</script>

<style scoped>
/* Add your styles here */
.wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; /* Adjust as needed */
}

.player-item {
  flex: 0 0 30%; /* Adjust width as needed */
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: transform 1s ease-in-out;
}

.player-item:hover {
  transform: scale(1.4);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

h1 {
  color: rgb(203, 60, 50);
  text-shadow: rgb(255, 0, 0) 1px 0 10px;
  font-size: 50px;
  opacity: 0;
  animation: fadeIn 4s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.title {
  margin: 0;
}
#hamster{
  height: 100px;
  length: 100px;
}
</style>