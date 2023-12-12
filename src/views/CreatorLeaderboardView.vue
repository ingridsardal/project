<template>
  <body id="apa">
    <header>
      <h2>ScOrEBoaRD</h2>
    </header>
    <div>
      <h3>Var du för snabb?</h3>
    </div>

    <div class="wrapper"> 
      <div class="content">
        <!-- Textrutan för att skriva in valfri bokstav -->
        <input v-model="inputLetter" placeholder="Välj bokstav för nästa omgång" />
      </div>

      <footer> 
        <router-link v-bind:to="'/creatorgame/'">
          <button id="startRound" v-on:click="startRound"> Starta nästa omgång </button>
        </router-link>
      </footer>
    </div>

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
          <td>{{ player.name }}</td>
          <td>{{ index + 1 }}</td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
    </table>

    <div class="message">
      <p>{{ lastPlacePlayer.name }} ligger supermega sist...</p>
    </div>
  </body>
</template>

<script>
export default {
  data() {
    return {
      players: [
        { id: 1, name: 'John', points: 15, answers: {} },
        { id: 2, name: 'Anna', points: 13 },
        { id: 3, name: 'Simon', points: 7 },
        { id: 4, name: 'pimon', points: 8 },
        { id: 5, name: 'dimon', points: 17 },
      ],
      inputLetter: this.generateRandomLetter(), // Förinställd random bokstav
    };
  },
  computed: {
    sortedPlayers() {
      return this.players.slice().sort((a, b) => b.points - a.points);
    },
    lastPlacePlayer() {
      return this.sortedPlayers[this.sortedPlayers.length - 1];
    },
  },
  methods: {
    startRound() {
      console.log('Startar nästa omgång med bokstaven:', this.inputLetter);
    },
    generateRandomLetter() {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      return alphabet[randomIndex];
    },
  },
};
</script>


<style scoped>


  h2 {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    color: rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 50px;
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
    background-color: rgb(249, 192, 86);
    color: white;
    position: absolute;
  }

  th, td {
    border: 1px solid #edecec;
    padding: 15px;
    text-align: left;
  }

  th {
    color: white;
  }

  .message {
    color: white;
    font-size: 40px;
    text-align: center;
    margin-top: 150px;
    padding: 20px;
    border: 2px solid black;
    position: absolute;
    top: 500px;
    left: 50%;
    transform: translateX(-50%);
    background-color: orange;
  }

  .image img {
    width: 200px; /* Ange önskad bredd här */
    height: auto;
    position: absolute;
    right: 125px;
    bottom:0; /* Säkerställ proportionell höjd */
  }


  #apa {
    background-color: blue;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .content input {
    height: 140px;
    width: 120px;
    margin: 5px;
    background-color: blue;
    border: none;
    font-size: 140px; /* Ändra textstorlek här */
  }

  #startRound {
    background-color: rgb(113, 255, 113);
    height: 80px;
    width: auto;
    margin: 5px;
  }
</style>


    