<template>
       <div class="background">
        <h1>
          {{ uiLabels.headerJoinGame }}
        </h1>

        <label>
      <br>
      {{uiLabels.gameId}}: 
      <input type="text" v-model="pollId">
    </label>
    <br>
    <br>
    <label>
        {{uiLabels.name}}: 
        <input type="text" v-model="nameId" maxlength="8">
    </label>
    <br>
    <br>
    <label>
      {{uiLabels.selectAvatar}}: 
    </label>

    <section>
      <div class="wrapper">
      <button class="avatars" :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/xT9IgM7SyNjzZBxvDG/giphy.gif'}" 
       @click="selectedGif = 'https://media.giphy.com/media/xT9IgM7SyNjzZBxvDG/giphy.gif'">
      <img src="https://media.giphy.com/media/xT9IgM7SyNjzZBxvDG/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars" :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/etKPlfE85HW8udMMDl/giphy.gif'}" 
      @click="selectedGif = 'https://media.giphy.com/media/etKPlfE85HW8udMMDl/giphy.gif'">
      <img src="https://media.giphy.com/media/etKPlfE85HW8udMMDl/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars" :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/w0hpqElNgofh1bdUD3/giphy.gif'}"
      @click="selectedGif = 'https://media.giphy.com/media/w0hpqElNgofh1bdUD3/giphy.gif'">
      <img src="https://media.giphy.com/media/w0hpqElNgofh1bdUD3/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars" :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/u7e9QxCHnNzWxswBZJ/giphy.gif'}"
      @click="selectedGif = 'https://media.giphy.com/media/u7e9QxCHnNzWxswBZJ/giphy.gif'">
      <img src="https://media.giphy.com/media/u7e9QxCHnNzWxswBZJ/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars" 
        :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/fkdMDbf18tqkamTnnZ/giphy.gif'}" 
        @click="selectedGif = 'https://media.giphy.com/media/fkdMDbf18tqkamTnnZ/giphy.gif'">
  <img src="https://media.giphy.com/media/fkdMDbf18tqkamTnnZ/giphy.gif" alt="Animated GIF">
</button>
<button class="avatars" 
        :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/l4FGFHiVod82HC2ly/giphy.gif'}" 
        @click="selectedGif = 'https://media.giphy.com/media/l4FGFHiVod82HC2ly/giphy.gif'">
  <img src="https://media.giphy.com/media/l4FGFHiVod82HC2ly/giphy.gif" alt="Animated GIF">
</button>
<button class="avatars" 
        :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/3oKIPhxtCqLe49VI08/giphy.gif'}" 
        @click="selectedGif = 'https://media.giphy.com/media/3oKIPhxtCqLe49VI08/giphy.gif'">
  <img src="https://media.giphy.com/media/3oKIPhxtCqLe49VI08/giphy.gif" alt="Animated GIF">
</button>
<button class="avatars" 
        :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/3oKIPBYGLy6qk8bdrq/giphy.gif'}" 
        @click="selectedGif = 'https://media.giphy.com/media/3oKIPBYGLy6qk8bdrq/giphy.gif'">
  <img src="https://media.giphy.com/media/3oKIPBYGLy6qk8bdrq/giphy.gif" alt="Animated GIF">
</button>
<button class="avatars" 
        :class="{'selected-avatar': selectedGif === 'https://media.giphy.com/media/3kMiS4AA4P4L2Z6TT7/giphy.gif'}" 
        @click="selectedGif = 'https://media.giphy.com/media/3kMiS4AA4P4L2Z6TT7/giphy.gif'">
  <img src="https://media.giphy.com/media/3kMiS4AA4P4L2Z6TT7/giphy.gif" alt="Animated GIF">
</button>
      <!--<button class="avatars" @click="selectedGif = 'https://media.giphy.com/media/ys3xvXRwsdjoYvYR3h/giphy.gif'">
      <img src="https://media.giphy.com/media/ys3xvXRwsdjoYvYR3h/giphy.gif" alt="Animated GIF">
      </button>-->


      </div>
    </section>
    <!--
      <div id="selectedAvatar"> 
        <p>{{uiLabels.selectedAvatar}}</p>
        <br/>
        <img :src="selectedGif" alt="Animated GIF">
      </div>-->

   <br>
        <button id="joinButton" v-on:click="joinButton">           <!-- måste skapa en write poll id number så att det funkar-->
          {{uiLabels.joinGame}}
        </button>
    </div>
    <footer>
    <router-link v-bind:to="'/'">
      <button id= "tillbakaButton" v-on:click="tillbaka">{{uiLabels.backButton}}  </button>      <!-- göra så att man kan justera språk-->
    </router-link>
  </footer>


  </template>
  
  <script>
  // @ is an alias to /src
  import QuestionComponent from '@/components/QuestionComponent.vue';
  import io from 'socket.io-client';
  const socket = io(sessionStorage.getItem("dataServer")); 
  
  export default {
    name: 'ParticipateView',
    components: {
      QuestionComponent
    },
    data: function () {
      return {
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
        question: {
          q: "",
          a: []
        },
        pollId: "inactive poll",
        submittedAnswers: {},
        nameId: "",
        players: [],
        selectedGif: "https://media.giphy.com/media/aYKTYtCYb2ECSKfyal/giphy.gif"
      }
    },
    created: function () {
      this.pollId = this.$route.params.id
      socket.on("dataUpdate", answers =>
        this.submittedAnswers = answers
      )

    socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })

      socket.on("isTaken", (isTaken) => {
        if (!isTaken) {
          alert("Name is taken or invalid poll id")
        } else {
          this.$router.push("/participantwaiting/" + this.pollId + '/' + this.nameId)
        }
      })

    },

    methods: {
      joinButton: function () {
      socket.emit("joinGame", {pollId: this.pollId, nameId: this.nameId, avatar: this.selectedGif})
    }
    }
  }
  </script>

   <style scoped>
   h1 { 
    color:rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 50px; 
    }
h3{
  font-weight: bold;
}
.selected-avatar {
  border: 3px solid green;
} 

.background {
  /* Stilen för att göra bilden till bakgrund på hela sidan */
  background-image: url('/img/bluebg.png'); 
  background-size: cover; /* Anpassar storleken på bilden så att den täcker hela sidan */
  background-position: center; /* Centrerar bakgrundsbilden på sidan */
  height: 100vh; /* Gör elementet lika högt som fönstret (hela sidan) */
  top: 0;
}
#joinButton {
      height: 80px;
      width: 12em;
      margin: 25px;
      position: absolute;
      bottom: 0;
      right: 0;

      background-color: lightgreen;
      border-radius: 10px;
      border: none;
      cursor:pointer;
    }
    #joinButton:hover {
      background-color: #70e070;;
    }
    #tillbakaButton {
  background-color: rgb(255, 206, 114);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}


#tillbakaButton:hover {
  background-color:rgb(254, 195, 86);
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centers content horizontally */
  width: 100%;
  padding: 10px;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Creates 10 equal-width columns */
  gap: 10px;
  width: 40%; /* Adjust as needed */
  margin: auto; /* Centers the wrapper */
  padding-left: 50px; /* Adds 50px of padding to the left */
  padding-right: 50px; /* Adds 50px of padding to the right */
  margin-bottom: 40px; /* Space between the grid and the selected avatar */
  height: 10px;
}

.avatars {
  border-radius: 8px; 
  width: 100%;
  height: 100%;
}
.avatars img {
  width: 80%;
  height: auto;
}

#selectedAvatar {
  width: 15%; /* Adjust as needed */
  height: 15%; /* Adjust as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 2px solid black; /* Adds a black border */
  border-radius: 10px; /* Makes corners rounded */
  padding: 10px;
  margin-left:40%;
  margin-top:5%;

}

#selectedAvatar img {
  width: 100%;
  height: auto;
}
@media screen and (max-width:50em) {
  h1{font-size: 40px;}
#joinButton, #tillbakaButton{  
  height: 80px;
  width: 10em;}
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Creates 10 equal-width columns */
  width: 80%;
  margin-left: -4%; /* Centers the wrapper */}
  .avatars img {
  width: 80%;
  height: auto;
}
#selectedAvatar {  margin-top: 45%; }
  }
</style>
  