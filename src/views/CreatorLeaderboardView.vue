<template>
  <body id="apa">
    <header>
      <h2>ScOrEBoaRD</h2>
    </header>
    <div>
      <h3>Var du för snabb?</h3>
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
        <!-- Loop through your data here and create rows for each player -->
        <tr v-for="(player, index) in players" :key="player.id">
          <td>{{ player.name }}</td>
          <td>{{ index + 1 }}</td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
    </table>

    <div class="image">
      <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L2pvYjY4NC0xOTQtcF8xLnBuZw.png" alt="Hand Image">
    </div>

    <!-- Additional div for the message -->
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
        { id: 2, name: 'Anna', points: 10 },
        { id: 3, name: 'Simon', points: 12 },
        { id: 4, name: 'pimon', points: 8 },
        { id: 5, name: 'dimon', points: 5 },
      ],
    };
  },
  computed: {
    lastPlacePlayer() {
      return this.players.reduce((prev, current) =>
        prev.points < current.points ? prev : current
      );
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
</style>

    