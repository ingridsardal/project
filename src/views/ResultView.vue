<template>
  <body id="apa" class="background">
    <header>
      <h1>{{ uiLabels.finalResults }} </h1>
    </header>


    <table>
      <thead>
        <tr>
          <th>{{ uiLabels.scoreboardRanking }}</th>
          <th>{{ uiLabels.scoreboardName }}</th>
          <th>{{ uiLabels.scoreboardPoints }}</th>
        </tr>
      </thead>

      <tbody>
        <!-- Loop through your sorted data here and create rows for each player -->
        <tr v-for="(player, index) in sortedPlayers" :key="player.id">
          <td>{{ index + 1 }}</td>
          <td>{{ player.nameId }}</td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
    </table>

    <footer>
      <button id="startRound" v-on:click="startRound"> {{ uiLabels.anotherGame }}</button>
    </footer>

  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  data() {
    return {
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      players: [],
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      pollId: "inactive poll",
    };
  },

  created() {
    this.pollId = this.$route.params.id;
    this.name = this.$route.params.name;

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    socket.emit('startGame', { pollId: this.pollId });

    socket.emit('joinSocket', { pollId: this.pollId });

    socket.on('getInfo', (poll) => {
      console.log(poll)
      this.players = poll.players;
      this.roundCounter = poll.roundCounter;
      console.log(this.roundCounter)
    });

  },

  computed: {
    sortedPlayers() {
      return this.players.slice().sort((a, b) => b.points - a.points);
    },
  },
  methods: {
    startRound() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

.background {
  /* Stilen för att göra bilden till bakgrund på hela sidan */
  background-image: url('/img/bluebg.png');
  background-size: cover;
  /* Anpassar storleken på bilden så att den täcker hela sidan */
  background-position: center;
  /* Centrerar bakgrundsbilden på sidan */
  height: 100vh;
  /* Gör elementet lika högt som fönstret (hela sidan) */
  top: 0;
  margin-top: -32px;
}

body {
  font-family: 'Open Sans', sans-serif;
}

h1 {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  font-size: 100px;
  margin-top: 10px;
}

h3 {
  color: white;
  position: absolute;
  top: 125px;
  left: 50%;
  transform: translateX(-50%);
}

table {
  width: 50%;
  border-collapse: collapse;
  margin-top: 1px;
  color: white;
  position: absolute;
  transform: scale(1.2);
  margin-top: 25px;

}

th,
td {
  border: 1px solid #edecec;
  padding: 15px;
  text-align: left;
}

th {
  color: rgb(0, 88, 117);
  background-color: white;
}

tbody tr:nth-child(1) {
  background-color: gold;
}

tbody tr:nth-child(2) {
  background-color: silver;
}

tbody tr:nth-child(3) {
  background-color: #cd7f32;
}

tbody tr:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)) {
  background-color: darkred;
}

.image img {
  width: 200px;
  /* Ange önskad bredd här */
  height: auto;
  position: absolute;
  right: 125px;
  bottom: 0;
  /* Säkerställ proportionell höjd */
}


#apa {

  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}



.content input {
  border: none;
  position: absolute;
  bottom: 0;
  right: 250px;
  height: 140px;
  width: 140px;
  border: none;
  font-size: 115px;
  color: rgb(249, 192, 86);
  text-shadow: rgb(255, 183, 0) 1px 0 10px;
  text-transform: uppercase;
  opacity: 0.7;
  /* Delvis genomskinlig från början */
  transition: opacity 0.3s ease, border-color 0.3s ease;
  outline: none;
}

.content:hover input {
  opacity: 1;
  border-color: rgb(249, 192, 86);
  outline: none;
}


#startRound {
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
  font-family: 'Open Sans', sans-serif;
}

#startRound:hover {
  background-color: #70e070;}

@media screen and (max-width:50em) {
    h1 {font-size: 80px;}}
</style>