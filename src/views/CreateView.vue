<template>
    <div class="centered-content">
  <header>
        <h1> {{uiLabels.createOwnGame}} </h1>
  </header>

  <div class="textWindow">
      <!-- Textrutan för att skriva in valfri bokstav -->
      <input v-model="inputLetter" placeholder="" maxlength="1" @input="filterInput" />
    </div>

    <div class="firstRoundLetter">
      <p>Välj bokstav för första omgången:</p>
    </div>

  <body>
        <h3 style="font-weight: normal;">
          {{uiLabels.chooseCategory}}:
        </h3>

    <div class="grid-container">
  <div class="grid-item">
    <input type="checkbox" id="städer" value="städer" v-model="categories">
    <label for="städer">{{uiLabels.städer}}</label>
  </div>

    <div class="grid-item">
      <input type="checkbox" id="länder" value="länder" v-model="categories">
      <label for="länder">{{uiLabels.länder}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="floder"  value="floder" v-model="categories">
      <label for="floder">{{uiLabels.floder}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="maträtter"  value="maträtter" v-model="categories">
      <label for="maträtter">{{uiLabels.maträtter}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="frukter"  value="frukter" v-model="categories">
      <label for="frukter">{{uiLabels.frukter}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="bilmärken"  value="bilmärken" v-model="categories">
      <label for="bilmärken">{{uiLabels.bilmärken}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="kändisar"  value="kändisar" v-model="categories">
      <label for="kändisar">{{uiLabels.kändisar}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="klädmärken"  value="klädmärken" v-model="categories">
      <label for="klädmärken">{{uiLabels.klädmärken}}</label>
    </div>

    <div class="grid-item">
    <input type="checkbox" id="sevärdheter" value="sevärdheter" v-model="categories">
    <label for="sevärdheter">{{uiLabels.sevärdheter}}</label>
  </div>
  </div> <br>

    <div class="antalomgångar">
      <label for="rounds">{{uiLabels.NumberOfRounds}}</label>
      <select id="rounds" v-model="rounds" style="overflow-y: auto;">
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
    </div>

      <!-- 
      <div class="content">
      <button id= "generateRandomLetter" v-on:click="generateRandomLetter">Lock In Letter</button>
      
      <input v-model="inputLetter" placeholder="" maxlength="1" @input="filterInput" />
      {{randomLetter}}
    </div> 
    -->
    

  </body>

  <footer>
      <router-link v-bind:to="'/'">
      <button id= "tillbakaButton" v-on:click="tillbaka">{{uiLabels.backButton}} </button>      <!-- göra så att man kan justera språk-->
    </router-link>
    <router-link v-bind:to="'/creatorwaiting/'+pollId">
    <button id= "skapaButton" v-on:click="createPoll">{{uiLabels.createGame}}</button>      <!-- göra så att man kan justera språk-->
    </router-link>
  </footer>
    </div>
  </template>

   <!--<style>
  .centered-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  </style>-->





<!--
  <div>
    Poll link: 
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Create poll
    </button>
    <div>
      {{uiLabels.question}}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-for="(_, i) in answers" 
               v-model="answers[i]" 
               v-bind:key="'answer'+i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">
    <button v-on:click="runQuestion">
      Run question
    </button>
    {{data}}
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
  </div>
  -->
  <!--<p v-if="randomNumber">Generated Number: {{ randomNumber }}</p>-->
<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      rounds: "3",
      roundCounter:0,
      data: {},
      uiLabels: {},
      categories: [],
      randomLetter: "",
      inputLetter: this.generateRandomLetter(),
      firstSelectedLetter: "",
    }
  },
  created: function () {
    this.id = this.$route.params.id;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
      this.data = data
    )
    socket.on("pollCreated", (data) =>
      this.data = data)

  },
  methods: {
    createPoll: function () {
      this.roundCounter=this.roundCounter+1
      console.log("CreatorView")
      this.pollId = Math.floor(1000 + Math.random() * 9000)
      console.log(this.categories);
      this.firstSelectedLetter = this.inputLetter;
      console.log('Startar nästa omgång med bokstaven:', this.firstSelectedLetter);
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang, rounds: this.rounds, categories: this.categories, roundCounter:this.roundCounter,firstSelectedLetter: this.firstSelectedLetter})
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },
    filterInput() {
      this.inputLetter = this.inputLetter.replace(/[^a-zA-ZåäöÅÄÖ]/g, '');
    },
    generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  
  },
  }
}

</script>

<style scoped>
header {
  color: orange;
}

.antalomgångar {
  margin-top: 2%;
  margin-right: 15%;
  transform: scale(1.2); /* Adjust the scale factor for larger or smaller checkboxes */
  padding:20px;
}

.antalomgångar label {
  margin-right: 1.5%;
}

#rounds {
  transform: scale(1.3); /* Adjust the scale factor for larger or smaller checkboxes */
  cursor: pointer;
}

.grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-row-gap: 60%;
      grid-column-gap: 25%;
      margin: 100px 30% 100px 30%;
    }

    .grid-item {
      display: flex;
      align-items: center;
      transform: scale(1.3); /* Adjust the scale factor for larger or smaller checkboxes */
    }

    .grid-item input[type="checkbox"] {
    cursor: pointer;
    }

    .grid-item label {
      margin-right: 5px;
    }

  #skapaButton {
  background-color: rgb(113, 255, 113);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  right: 0;
}

#tillbakaButton {
  background-color: rgb(255, 206, 114);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  left: 0;
}


button:hover {
    background-color: grey;
    cursor: pointer;
}

.textWindow input {
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

.textWindow:hover input {
  opacity: 1;
  border-color: rgb(249, 192, 86);
  outline: none;
}

.firstRoundLetter {
    color: black;
    font-size: 45px;
    right: 400px;
    position: absolute;
    bottom: 0;
    padding: 10px;
    font-style: italic; 
  }


/*
    nav {
width:100%;
height: 4em;
display: grid;
grid-template-columns: repeat(auto-fit, 10em);
}

nav ::v-slotted(a) {
text-transform: uppercase;
font-size: 0.8rem;
letter-spacing: 0.1em;
text-decoration: none;
color: gray;
display: grid;
align-items: center;
justify-content: center;
border-left: 1px solid gray;
}

@media screen and (max-width:50em) {
nav {
position: absolute;
height:100vh;
top: 3em;
left: 0;
width:12em;
display: grid;
grid-template-rows: repeat(auto-fit, 2em);
transition: 0.5s;
}
nav ::v-slotted(a) {
justify-content: left;
padding-left: 1em;
}
.hide {
left:-12em;
}
}
*/

</style>

