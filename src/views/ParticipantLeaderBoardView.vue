<template>
  <body id="apa" class="background">
    <header>
      <h1>{{ uiLabels.scoreboard }} {{ roundCounter }}</h1>
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

    <div v-if="players.length > 1" class="message"
      :class="{ 'super-mega-last': isSuperMegaLastPlace, 'dominating': isDominating }"> <br>
      <p>
        <span v-if="isDominating">{{ firstPlacePlayer.nameId }} {{ uiLabels.dominating }}</span>
        <span v-else-if="isSuperMegaLastPlace">{{ lastPlacePlayer.nameId }} {{ uiLabels.superMegaLast }}</span>
        <span v-else>{{ uiLabels.note }} {{ lastPlacePlayer.nameId }} {{ uiLabels.last }}</span>
        <!--lastPlacePlayer funkar ej-->
      </p>
    </div>

  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  data() {
    return {
      players: [],
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      pollId: "inactive poll",
      roundCounter: 0,
    };
  },

  created() {

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels

    }),
      this.pollId = this.$route.params.id;
    this.name = this.$route.params.name;

    socket.emit('startGame', { pollId: this.pollId });

    socket.emit('joinSocket', { pollId: this.pollId });

    socket.on('getInfo', (poll) => {
      console.log(poll)
      this.players = poll.players;
      this.roundCounter = poll.roundCounter;
      console.log(this.roundCounter)
    });
    socket.on('moveToNextRound', () => {
      console.log("moved players to scorebaord")
      this.$router.push('/participantgame/' + this.pollId + '/' + this.name);
    })

  },

  computed: {
    sortedPlayers() {
      if (this.players.length >= 2) {
        return this.players.slice().sort((a, b) => b.points - a.points);
      }
      else {
        return this.players;
      }
    },
    lastPlacePlayer() {
      if (this.players.length > 1) {
        const lastIndex = this.sortedPlayers.length - 1;
        console.log("sista spelaren är:", this.sortedPlayers[lastIndex]);
        // console.log("alt 2 sista spelarens poäng är:", this.players[-1].points)
        return this.sortedPlayers[lastIndex];
      } else {
        return this.players;
      }
    },
    firstPlacePlayer() {
      return this.sortedPlayers[0];
    },
    isSuperMegaLastPlace() {
      if (this.players.length >= 3) {
        const lastPlacePoints = this.lastPlacePlayer.points;
        const secondLastPlacePoints = this.sortedPlayers[this.sortedPlayers.length - 2].points;
        return secondLastPlacePoints - lastPlacePoints >= 7;
      }
      else {
        return false;
      }
    },
    isDominating() {
      if (this.players.length >= 3) {
        const firstPlacePoints = this.sortedPlayers[0].points;
        const secondPlacePoints = this.sortedPlayers[1].points;
        console.log("sorted players", this.sortedPlayers[0])
        return firstPlacePoints - secondPlacePoints >= 5;
      }
      else {
        return false;
      }

    }
  },
  methods: {
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

.background {
  /* Stilen för att göra bilden till bakgrund på hela sidan */
  background-image: url('/img/bluebg.png');
  background-size: cover !important;
  /* Anpassar storleken på bilden så att den täcker hela sidan */
  background-position: center;
  /* Centrerar bakgrundsbilden på sidan */
  height: 100vh;
  /* Gör elementet lika högt som fönstret (hela sidan) */
  margin-top: 0px;

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
  font-size: 50px;
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

.message {
  color: black;
  text-shadow: rgb(184, 0, 0) 1px 0 10px;
  font-size: 120px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-style: italic;
  opacity: 0;
  /* Gör meddelandet osynligt från början */
  animation: fadeIn 7s ease-out forwards;
  /* Använd en fadeIn-animation med 2 sekunders varaktighet och stanna kvar på slutet (forwards) */
}

@keyframes fadeIn {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

/* Lägg till en ny animation för att hålla meddelandet synligt */
@keyframes holdVisible {
  from {
    opacity: 1;
  }

  to {
    opacity: 1;
  }
}

/* Använd holdVisible-animationen efter fadeIn är klar */
.message.animationend {
  animation: holdVisible 1s ease-in-out;
}

.message.super-mega-last {
  color: red;
  text-shadow: rgb(184, 0, 0) 1px 0 10px;
  font-weight: bold;
  font-size: 120px;
}

.message.dominating {
  color: rgb(19, 209, 19);
  text-shadow: rgb(21, 174, 21) 1px 0 7px;
  font-size: 120px;
  font-weight: bold;
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
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
}

@media screen and (max-width:50em) {

  .message {
    color: black;
    text-shadow: rgb(184, 0, 0) 1px 0 10px;
    font-size: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-style: italic;
    opacity: 0;
    /* Gör meddelandet osynligt från början */
    animation: fadeIn 7s ease-out forwards;
    /* Använd en fadeIn-animation med 2 sekunders varaktighet och stanna kvar på slutet (forwards) */
  }

  .message.super-mega-last {
    color: red;
    text-shadow: rgb(184, 0, 0) 1px 0 10px;
    font-weight: bold;
    font-size: 40px;
  }

  .message.dominating {
    color: rgb(19, 209, 19);
    text-shadow: rgb(21, 174, 21) 1px 0 7px;
    font-size: 40px;
    font-weight: bold;
  }



}</style>