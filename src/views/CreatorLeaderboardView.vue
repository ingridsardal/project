<template>
  <body id="apa">
    <header>
      <h1>SCOREBOARD {{ roundCounter }}</h1>
    </header>

    <div class="content">
      <!-- Textrutan för att skriva in valfri bokstav -->
      <input v-model="inputLetter" placeholder="" maxlength="1" @input="filterInput" />
    </div>

    <footer>
        <button id="startRound" v-on:click="startRound"> Starta nästa omgång </button>
    </footer>

    <table>
      <thead>
        <tr>
          <th>Namn</th>
          <th>Placering</th>
          <th>Poäng</th>
        </tr>
      </thead>

      <tbody>
        <!-- Loop through your sorted data here and create rows for each player -->
        <tr v-for="(player, index) in sortedPlayers" :key="player.id">
          <td>{{ player.nameId }}</td>
          <td>{{ index + 1 }}</td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
    </table>

        <!--
    <div class="message" :class="{ 'super-mega-last': isSuperMegaLastPlace, 'krossar-alla': isKrossarAlla }">
      <p>
        <span v-if="isKrossarAlla">{{ firstPlacePlayer.name }} fullständigt KROSSAR alla!!!!</span>
        <span v-else-if="isSuperMegaLastPlace">{{ lastPlacePlayer.name }} ligger supermega sist!</span>
        <span v-else>Notera! {{ lastPlacePlayer.name }} ligger sist...</span> 
      </p>
    </div>-->

    <div class="nextRound">
      <p>Välj bokstav för nästa omgång:</p>
    </div>
  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  data() {
    return {
      players: [],
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      pollId: "inactive poll",
      inputLetter: this.generateRandomLetter(), // Förinställd random bokstav
      selectedLetter: '',
      roundCounter: 0,
      rounds: 0,
    };
  },

  created() {
    this.pollId = this.$route.params.id;

    socket.emit('startGame', {pollId: this.pollId});

    socket.emit('joinSocket', {pollId: this.pollId});

    socket.on('getInfo', (poll) => {
      console.log(poll)
      this.players = poll.players;
      this.roundCounter = poll.roundCounter;
      this.rounds = poll.rounds;
    });

  },

  computed: {
    sortedPlayers() {
      return this.players.slice().sort((a, b) => b.points - a.points);
    },
    lastPlacePlayer() {
      return this.sortedPlayers[this.sortedPlayers.length - 1];
    },
    firstPlacePlayer() {
      return this.sortedPlayers[0];
    },
    isSuperMegaLastPlace() {
      const lastPlacePoints = this.lastPlacePlayer.points;
      const secondLastPlacePoints = this.sortedPlayers[this.sortedPlayers.length - 2].points;
      return secondLastPlacePoints - lastPlacePoints >= 7;
    },
    isKrossarAlla() {
      const firstPlacePoints = this.sortedPlayers[0].points;
      const secondPlacePoints = this.sortedPlayers[1].points;
      return firstPlacePoints - secondPlacePoints >= 5;

    },
  },
  methods: {
    startRound() {
      this.roundCounter=this.roundCounter+1;
      console.log("hello round counter", this.roundCounter);
      this.selectedLetter = this.inputLetter;
      console.log('Startar nästa omgång med bokstaven:', this.selectedLetter);
      if (this.roundCounter > this.rounds) {
        console.log("last round")
        this.$router.push('/result/' + this.pollId);
      }
      else {
      socket.emit('startRound',{pollId:this.pollId, selectedLetter: this.selectedLetter, roundCounter: this.roundCounter})
      console.log("moved players to next round")
      this.$router.push('/creatorgame/' + this.pollId);
      }
      /*socket.emit('addRoundCount',{roundCounter:this.roundCounter})*/
      /*this.$router.push('/creatorgame/'+pollId);*/
    },
    generateRandomLetter() {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      return alphabet[randomIndex];
    },
    filterInput() {
      this.inputLetter = this.inputLetter.replace(/[^a-zA-ZåäöÅÄÖ]/g, '');
    },
  },
};
</script>

<style scoped>
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
    transform : scale(1.2);
    margin-top: 25px;
    
  }

  th, td {
    border: 1px solid #edecec;
    padding: 15px;
    text-align: left;
  }

  th {
    color: black;
    background-color: white;
  }

  tbody tr:nth-child(1) {
    background-color: gold; /* Set background color for the first row */
  }

  tbody tr:nth-child(2) {
    background-color: silver; /* Set background color for the second row */
  }

  tbody tr:nth-child(3) {
    background-color:#cd7f32; /* Set background color for the third row */
  }

  tbody tr:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)) {
    background-color: darkred; /* Set background color for the rest of the rows */
  }

  .message {
    color: black;
    font-size: 30px;
    text-align: center;
    margin-top: 120px; /* Uppdaterad margin för att anpassa positionen */
    padding: 10px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-style: italic;
    opacity: 0; /* Gör meddelandet osynligt från början */
  animation: fadeIn 2s ease-in forwards; /* Använd en fadeIn-animation med 2 sekunders varaktighet och stanna kvar på slutet (forwards) */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
    font-size: 30px;
}

.message.krossar-alla {
  color: rgb(19, 209, 19);
  text-shadow: rgb(21, 174, 21) 1px 0 7px;
  font-size: 30px;
  font-weight: bold;
}

  .nextRound {
    color: black;
    font-size: 45px;
    right: 400px;
    position: absolute;
    bottom: 0;
    padding: 10px;
    font-style: italic; 
  }

  .image img {
    width: 200px; /* Ange önskad bredd här */
    height: auto;
    position: absolute;
    right: 125px;
    bottom:0; /* Säkerställ proportionell höjd */
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
    opacity: 0.7; /* Delvis genomskinlig från början */
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


</style>