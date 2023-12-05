<template>
  <header>
    <h1> Skapa ditt eget spel! </h1>
  </header>

  <body>
    <h3 style="font-weight: normal;">
      Välj en eller flera kategorier:
    </h3>

    <div class="grid-container">
    <div class="grid-item">
      <input type="checkbox" id="Städer" name="items" onclick="toggleCheckbox(this)" checked>
      <label for="Städer">{{uiLabels.städer}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="Länder" name="items" onclick="toggleCheckbox(this)">
      <label for="Länder">{{uiLabels.länder}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="Floder" name="items" onclick="toggleCheckbox(this)">
      <label for="Floder">{{uiLabels.floder}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="Maträtter" name="items" onclick="toggleCheckbox(this)">
      <label for="Maträtter">{{uiLabels.maträtter}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="Frukter" name="items" onclick="toggleCheckbox(this)">
      <label for="Frukter">{{uiLabels.frukter}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="Bilmärken" name="items" onclick="toggleCheckbox(this)">
      <label for="Bilmärken">{{uiLabels.bilmärken}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="Kändisar" name="items" onclick="toggleCheckbox(this)">
      <label for="Kändisar">{{uiLabels.kändisar}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="Klädmärken" name="items" onclick="toggleCheckbox(this)">
      <label for="Klädmärken">{{uiLabels.klädmärken}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="Sevärdheter" name="items" onclick="toggleCheckbox(this)">
      <label for="Sevärdheter">{{uiLabels.sevärdheter}}</label>
    </div>
  </div> <br>

  <div class="antalomgångar">
    <label for="omgångar">{{uiLabels.NumberOfRounds}}</label>
    <select id="omgångar" v-model="omgångar" style="overflow-y: auto;">
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
  </div> <br>
</body>
  <footer>
    
    <nav>
  <ResponsiveNav v-bind:hideNav="hideNav">
    <router-link v-bind:to="'/'">
      <button id= "tillbakaButton" v-on:click="tillbaka">{{uiLabels.backButton}} </button>      <!-- göra så att man kan justera språk-->
    </router-link>
    </ResponsiveNav>

    <button id="langButton" v-on:click="switchLanguage" :class="{ 'english': lang === 'en', 'swedish': lang === 'sv' }"></button>  

    <ResponsiveNav v-bind:hideNav="hideNav">
    <router-link v-bind:to="'/creatorwaiting/'">
    <button id= "skapaButton" v-on:click="skapaButton">{{uiLabels.createGame}} </button>      <!-- göra så att man kan justera språk-->
    </router-link>
 </ResponsiveNav>

  </nav>
  
  </footer>



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
  <p v-if="randomNumber">Generated Number: {{ randomNumber }}</p>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      omgångar: "0",
      data: {},
      uiLabels: {},
      randomNumber: null
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
    switchLanguage: function() {
        if (this.lang === "en") {
          this.lang = "sv"
        }
        else {
          this.lang = "en"
        }
        localStorage.setItem("lang", this.lang);
        socket.emit("switchLanguage", this.lang)
      },
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
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
    skapaButton: function () {
      // Generate a random 4-digit number
      this.randomNumber = Math.floor(1000 + Math.random() * 9000);
      console.log(this.randomNumber)
    }
    
  }
}
function toggleCheckbox(checkbox) {
  // Toggle the checked state of the clicked checkbox
  checkbox.checked = !checkbox.checked;
}

</script>

<style>
header {
  color: orange;
}

.antalomgångar {
  margin-top: 2%;
  margin-right: 15%;
  transform: scale(1.2); /* Adjust the scale factor for larger or smaller checkboxes */
}

.antalomgångar label {
  margin-right: 1.5%;
}

#omgångar {
  transform: scale(1.3); /* Adjust the scale factor for larger or smaller checkboxes */
  cursor: pointer;
}

.grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-row-gap: 60%;
      grid-column-gap: 25%;
      margin: 5% 30% 5% 30%;
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
#langButton{
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  left:13em;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.english {
    background-image: url('../../public/img/englishFlag.jpg');  
  }
  .swedish {
    background-image: url('../../public/img/Flag_of_Sweden.png');  
  }

button:hover {
    background-color: grey;
    cursor: pointer;
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