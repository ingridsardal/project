<template>
       <div>
        <h1>
          {{ uiLabels.headerJoinGame }}
        </h1>

        <label>
      <br>
      Poll id: 
      <input type="text" v-model="pollId">
    </label>
    <br>
    <label>
      {{uiLabels.name}}: 
      <input type="text" v-model="nameId">
    </label>

    <section>
      <div class="wrapper">
      <button class="avatars">
      <img src="https://media.giphy.com/media/2wgTJVY171NU2547b8/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars">
      <img src="https://media.giphy.com/media/etKPlfE85HW8udMMDl/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars">
      <img src="https://media.giphy.com/media/ys3xvXRwsdjoYvYR3h/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars">
      <img src="https://media.giphy.com/media/3oKIPBYGLy6qk8bdrq/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars">
      <img src="https://media.giphy.com/media/TLPC9CGU0FriCc9Bql/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars">
      <img src="https://media.giphy.com/media/X1XORnJ6ErubS/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars">
      <img src="https://media.giphy.com/media/dioml5wsoBZYqJGqip/giphy.gif" alt="Animated GIF">
      </button>
      <button class="avatars">
      <img src="https://media.giphy.com/media/Ii4jfLGmdmWWhcVTG3/giphy.gif" alt="Animated GIF">
      </button>
    </div>
    <!--
    <div id="selectedAvatar"> 
      <p>Your Selected avatar</p>
      <br/>
      <img src="https://media.giphy.com/media/2wgTJVY171NU2547b8/giphy.gif" alt="Animated GIF">
    </div>-->
    </section>


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
  const socket = io("localhost:3000");
  
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
        players: []
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
      socket.emit("joinGame", {pollId: this.pollId, nameId: this.nameId})
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
h3{font-weight: bold;}
    #joinButton {
      height: 100px;
      width: 33%;
      margin:19px;
      font-size: 30px;
      background-color: lightgreen;
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

section{
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
}
.wrapper {
  display: grid;
  grid-template-columns: repeat(10, 7%);
  grid-template-rows: repeat(1, 1fr);
  gap: 10px;
}
.avatars {
  width: 100%;
}
.avatars img {
  width: 100%;
  height: auto;
  border-radius: 8px; /* Optional: Adds rounded corners to avatars */
}
</style>
  