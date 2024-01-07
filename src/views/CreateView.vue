<template>
  <body class="background">
    <!--<div class="centered-content">-->
  <header>
        <h1> {{uiLabels.createOwnGame}} </h1>
  </header>

        <h3>{{uiLabels.chooseCategory}}: </h3>

    <div class="grid-container">

  <div class="grid-item">
    <input type="checkbox" id="cities" value="cities" v-model="categories">
    <label for="cities">{{uiLabels.cities}}</label>
  </div>

    <div class="grid-item">
      <input type="checkbox" id="countries" value="countries" v-model="categories">
      <label for="countries">{{uiLabels.countries}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="rivers"  value="rivers" v-model="categories">
      <label for="rivers">{{uiLabels.rivers}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="dishes"  value="dishes" v-model="categories">
      <label for="dishes">{{uiLabels.dishes}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="fruits"  value="fruits" v-model="categories">
      <label for="fruits">{{uiLabels.fruits}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="carBrands"  value="carBrands" v-model="categories">
      <label for="carBrands">{{uiLabels.carBrands}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="celebrities"  value="celebrities" v-model="categories">
      <label for="celebrities">{{uiLabels.celebrities}}</label>
    </div>

    <div class="grid-item">
      <input type="checkbox" id="clothingBrands"  value="clothingBrands" v-model="categories">
      <label for="clothingBrands">{{uiLabels.clothingBrands}}</label>
    </div>

    <div class="grid-item">
    <input type="checkbox" id="touristAttractions" value="touristAttractions" v-model="categories">
    <label for="touristAttractions">{{uiLabels.touristAttractions}}</label>
  </div>
  </div> 
<br>

    <div class="numberOfRounds">
      <label for="rounds">{{uiLabels.NumberOfRounds}}   </label>
      <select id="rounds" v-model="rounds" style="overflow-y: auto;">
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
    <div class="container">
      <div class="firstRoundLetter">
        <p>{{uiLabels.firstRoundLetter}}</p>
      </div>

      <div class="textWindow">
        <!-- Textrutan för att skriva in valfri bokstav -->
        <input v-model="inputLetter" placeholder="" maxlength="1" @input="filterInput" />
      </div>

      <div class="shuffleButton" @click="shuffleRandomLetter">
      <div class="image-crop"></div>
      </div>
  </div>


      <!-- 
      <div class="content">
      <button id= "generateRandomLetter" v-on:click="generateRandomLetter">Lock In Letter</button>
      
      <input v-model="inputLetter" placeholder="" maxlength="1" @input="filterInput" />
      {{randomLetter}}
    </div> 
    -->
  

   <!-- </div>-->
  </body>
  
  <footer>
      <router-link v-bind:to="'/'">
      <button id= "goBackButton" v-on:click="goBack">{{uiLabels.backButton}} </button>      <!-- göra så att man kan justera språk-->
    </router-link>
    <button id= "createButton" v-on:click="createPoll">{{uiLabels.createGame}}</button>      <!-- göra så att man kan justera språk-->
  </footer>


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
const socket = io(sessionStorage.getItem("dataServer")); 

export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      rounds: "3",
      data: {},
      uiLabels: {},
      categories: [],
      randomLetter: "",
      inputLetter: this.shuffleRandomLetter(),
      firstSelectedLetter: "",
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
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
      if (this.categories.length == 0) {
        alert(this.uiLabels.noCategories) //lägg till uilabel
        return
      }
      else {
      console.log("CreatorView")
      this.pollId = Math.floor(1000 + Math.random() * 9000)
      console.log(this.categories);
      this.firstSelectedLetter = this.inputLetter;
      console.log('Startar nästa omgång med bokstaven:', this.firstSelectedLetter);
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang, rounds: this.rounds, categories: this.categories, firstSelectedLetter: this.firstSelectedLetter})
      this.$router.push('/creatorwaiting/'+this.pollId)
    }
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
    shuffleRandomLetter() {
      for (var i = 1; i < 1000; i++) {
      setTimeout(() => {
        this.inputLetter = this.generateRandomLetter();
      }, 100);
    }
    for (var i = 1; i < 6; i++) {
      setTimeout(() => {
        this.inputLetter = this.generateRandomLetter();
      }, 100 * i * i);
    }
  }
}
}

</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');
    
body,header,footer {font-family: 'Open Sans', sans-serif;
color: rgb(0, 88, 117);
}

body {
  margin: -32px;
  padding: 0;
}



header {
  color: orange;
}

.background {
  /* Stilen för att göra bilden till bakgrund på hela sidan */
  background-image: url('/img/bluebg.png'); 
  background-size: cover !important; /* Anpassar storleken på bilden så att den täcker hela sidan */
  background-position: center; /* Centrerar bakgrundsbilden på sidan */
  height: 100vh; /* Gör elementet lika högt som fönstret (hela sidan) */
  margin-top: -33px;
}

h1 { 
    color:rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 300%; 
    }

h3 {font-weight: bold;
    font-size: 150%;
}

.numberOfRounds {
  margin-top: 2%;
  margin-right: 15%;
  transform: scale(1.2); /* Adjust the scale factor for larger or smaller checkboxes */
  padding: 5%;
  text-align: center;
  margin-left: 15%;
}

.numberOfRounds label {
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
      margin: 7% 30% 7% 30%;
      ;
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
      margin-right: 5%;
      cursor: pointer;
    }

  #createButton {
  background-color: rgb(113, 255, 113);
  color: rgb(0, 88, 117);
  height: 10%;
  width: 12em;
  margin: 2%;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
}
#createButton:hover {
  background-color: #70e070;}

#goBackButton {
  background-color: rgb(255, 206, 114);
  color: rgb(0, 88, 117);

  height: 10%;
  width: 12em;
  margin: 2%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
}


#goBackButton:hover {
  background-color:rgb(254, 195, 86);
}

.textWindow input {
    border: none;
    position: absolute;
    bottom: 0;
    right: 20%; 
    height: 120px;
    width: 110px;
    border: none;
    font-size: 100px; 
    color: rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;  
    text-transform: uppercase; 
    /*opacity: 0.1; Delvis genomskinlig från början */
    /*transition: opacity 0.3s ease, border-color 0.3s ease;*/
    outline: none;
    background-color: rgba(0, 0, 0, 0)
}
.shuffleButton {
  position: absolute;
  bottom: 0;
  right: 15%; 
  cursor: pointer;
  margin-bottom: 20px;
}

.image-crop {
  width: 75px;  /* Adjust as needed */
  height: 75px;  /* Adjust as needed */
  background-image: url('../../public/img/dice2.png');
  background-position: center;  /* Adjust as needed */
  background-size: cover;  /* Adjust as needed */
}

.textWindow:hover input {

  border-color: rgb(249, 192, 86);
  outline: none;
  
}

.firstRoundLetter {
    font-size: 40px;
    right: 30%;
    position: absolute;
    bottom: 0;
    font-style: italic; 
  }


@media screen and (max-width: 50em) {
  .background {
    margin-top: -13px;
    height: 108vh;
    
  }

  h1{font-size: 30px; margin-top: 13px;}
  /* Justera stilen för mindre skärmstorlekar */
  h3{font-size:18px; margin-bottom: 50px;}
  .textWindow input {
    font-size: 54px; /* Justera storleken som passar bäst för mindre skärmar */
    left: 73%;
    margin-bottom: 100px;
    height: 6%;
    width: 80px;
  }
  .image-crop {
    left: 80%;
    margin-top: 100px;
    height: 40px;
    width: 40px;
  }
  .firstRoundLetter {
    font-size: 14px;
    right: 30%;
    position: absolute;
    margin-left: 1px;
    margin-bottom: 100px;;
   
  }

  .container {
margin-top: -100px;
  }
  .grid-container{
    font-size: 13px;
    margin-left: 15%;
    margin-bottom:120px;
  }
  .grid-item{
    margin-right: -30px;
    margin-bottom: -10px;
  }

  .numberOfRounds {
  margin-top: 2%;
  margin-right: 15%;
  transform: scale(1.2); /* Adjust the scale factor for larger or smaller checkboxes */
  padding: 5%;
  text-align: center;
  margin-left: 15%;
}



.numberOfRounds label {
  margin-right: 1.5%;
}

.shuffleButton {
  position: absolute;
  bottom: 0;
  right: 5%; 
  margin-bottom: 100px;
  cursor: pointer;
  width: 10%;
}
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