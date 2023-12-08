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

    <br />
    <hr>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: [
        { id: 1, name: 'John', answers: { city: 'New York', country: 'USA', animal: 'Lion' } },
        { id: 2, name: 'Anna', answers: { city: 'Paris', country: 'France', animal: 'Elephant' } },
        { id: 3, name: 'Simon', answers: { city: 'Tokyo', country: 'Japan', animal: 'Panda' } },
        { id: 4, name: 'Pimon', answers: { city: 'Berlin', country: 'Germany', animal: 'Giraffe' } },
        { id: 5, name: 'Dimon', answers: { city: 'Sydney', country: 'Australia', animal: 'Kangaroo' } },
      ],
    };
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
}

h1 { 
    color: rgb(203, 60, 50);
    text-shadow: rgb(255, 0, 0) 1px 0 10px;
    font-size: 50px; 
}
</style>