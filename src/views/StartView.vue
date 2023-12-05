<template>
  <body>
    <header>
      <div v-bind:class="['hamburger', {'close': !hideNav}]" 
           v-on:click="toggleNav">
      </div>
      <div class="logo">
        <img src="/img/logo.png">
        Stad Land Flod  
        <img src="../assets/logo.svg">
      </div>
    </header>
    <h1>{{ uiLabels["sales-pitch"] }}</h1>
    <h2>{{ uiLabels.subHeading }}</h2>
  
  <!--
   <label>
      Write poll id: 
      <input type="text" v-model="id">
    </label>
-->
  
    <router-link to="/create/">
        <button id="createButton">
          {{uiLabels.createGame}}
        </button>
    </router-link>
  
  <br>
  
    <router-link v-bind:to="'/participate/'">
        <button id="participateButton">          
          {{uiLabels.joinGame}}
        </button>
    </router-link>
  
  </body>
  <footer>
  <ResponsiveNav v-bind:hideNav="hideNav">
      <button v-on:click="switchLanguage" >{{uiLabels.changeLanguage}}</button>  <!--:class="{ 'english': lang === 'en', 'swedish': lang === 'sv' }"-->
      <button v-on:click="aboutFunction"> {{uiLabels.about}} </button>    <!-- lägga in about info i uiLabels-->
      <button v-on:click="FAQFunction"> {{uiLabels.faq}} </button>    <!-- lägga in FAQ info i uiLabels-->
    </ResponsiveNav>
  </footer>
  </template>
  
  <script>
  import ResponsiveNav from '@/components/ResponsiveNav.vue';
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    name: 'StartView',
    components: {
      ResponsiveNav
    },
    data: function () {
      return {
        uiLabels: {},
        id: "",
        lang: localStorage.getItem("lang") || "en",
        hideNav: true
      }
    },
    created: function () {
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })
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
      aboutFunction: function() {
        alert("message to ya sir!")
      },
      FAQFunction: function() {
        alert("är du 18? I hope")
      },
  
      toggleNav: function () {
        this.hideNav = ! this.hideNav;
      }
    }
  }
  </script>
  <style scoped>
    header {
      background-color: gray;
      width: 100%;
      display: grid;
      grid-template-columns: 2em auto;
    }
    .logo {
      text-transform: uppercase;
      letter-spacing: 0.25em;
      font-size: 2.5rem;
      color: white;
      padding-top:0.2em;
    }
    .logo img {
      height:2.5rem;
      vertical-align: bottom;
      margin-right: 0.5rem; 
    }
    .hamburger {
      color:white;
      width:1em;
      display: flex;
      align-items: center;
      justify-content: left;
      padding:0.5rem;
      top:0;
      left:0;
      height: 2rem;
      cursor: pointer;
      font-size: 1.5rem;
    }
    #participateButton {
      height: 100px;
      width: 33%;
      margin:19px;
    }
    #createButton {
      height: 100px;
      width: 33%;
      margin:19px;
    }
    body {
    min-height: 90vh;
  }
  footer {
    margin-top: auto; /* This pushes the footer to the bottom */
    padding: 20px;
    text-align: center;
  }
  /*.english {
  background-image: url('"../../public/img/englishFlag.jpg"');  Update with the actual path 
  }

  .swedish {
  background-image: url('/path/to/Flag_of_Sweden.png');  Update with the actual path 
  }
  */
  @media screen and (max-width:50em) {
    .logo {
      font-size: 5vw;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hamburger::before {
      content: "☰";
    }
    .close::before {
      content: "✕";
    }
    .hide {
      left:-12em;
    }
  }
  </style>