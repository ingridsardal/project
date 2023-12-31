<template>
  <body>
    <header>
      <div v-bind:class="['hamburger', {'close': !hideNav}]" 
           v-on:click="toggleNav">
      </div>
      <div class="logo">
        <img src="/img/logo.gif">
      </div>
    </header>

    <div class = "container">

    <h1>{{ uiLabels["sales-pitch"] }}</h1>
    <h2>{{ uiLabels.subHeading }}</h2>
  
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
  </div>

  </body>
  <footer>
  <ResponsiveNav v-bind:hideNav="hideNav">
      <button v-on:click="switchLanguage" :class="{ 'english': lang === 'en', 'swedish': lang === 'sv' }" ></button> 
      <button v-on:click="aboutFunction" id="navButtons"> {{uiLabels.about}} </button>   
      <button v-on:click="FAQFunction" id="navButtons"> {{uiLabels.faq}} </button>    
    </ResponsiveNav>
  </footer>
  </template>
  
  <script>
  import ResponsiveNav from '@/components/ResponsiveNav.vue';
  import io from 'socket.io-client';
  //sessionStorage.setItem("dataServer", "192.168.1.119:3000"); //Ingrids (change to your own ip adress)
  sessionStorage.setItem("dataServer", "localhost:3000");
  const socket = io(sessionStorage.getItem("dataServer")); 
  
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
        alert(this.uiLabels.aboutInfo)
      },
      FAQFunction: function() {
        alert(this.uiLabels.aboutInfo)
      },
  
      toggleNav: function () {
        this.hideNav = ! this.hideNav;
      }
    }
  }
  </script>
  <style scoped>
    header {
      background-color: rgb(255, 255, 255);
      width: 100%;
      display: grid;
      grid-template-columns: 2em auto;
      margin-bottom: 20px;
    }
    
    .container {
      background-color: rgb(249, 192, 86);
      border-radius: 10px;
      padding: 40px;
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50%; /* Ändra storleken till 50% av sidan */
      max-width: 700px;
      color: white;
    }

  #participateButton,
  #createButton {
    height: 100px;
    width: 100%;
    margin: 10px;
    margin-left: 0px;
    border-radius: 10px;
    background-color: white;
    color: rgb(249, 192, 86);
    border: 2px solid rgba(249, 192, 86, 0.6); /* Lägg till en border med lite mörkare orange */
    cursor: pointer;
    font-size: 20px;
  }
  #participateButton:hover, #createButton:hover {
    background-color:rgba(209, 136, 0, 0.761);
    color: white;
  }
    .logo {
      text-transform: uppercase;
      letter-spacing: 0.25em;
      font-size: 2.5rem;
      color: white;
      padding-top:0.2em;
      position: relative; /* Required for z-index to work */
      z-index: 0; /* Any number less than the z-index of .hamburger */
    }
    .logo img {
      height:400px;
      vertical-align: bottom;
      margin-left:-30px;
      padding-bottom: 20px;
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
      position: relative; /* Required for z-index to work */
      z-index: 1; /* Any number greater than the z-index of .logo */
    }
   /* #participateButton {
      height: 100px;
      width: 33%;
      margin:19px;
    }
    #createButton {
      height: 100px;
      width: 33%;
      margin:19px;
    }

    */

    body {
    min-height: 90vh;
  }
  footer {
    margin-top: auto; /* This pushes the footer to the bottom */
    padding: 20px;
    text-align: center;
  }
  .english {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    background-image: url('../../public/img/Flag_of_Sweden.png');  
  }
  .english:hover, .swedish:hover{
    opacity: 0.85;
  }
  
  .swedish {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    background-image: url('../../public/img/englishFlag.jpg');  
  }
  #navButtons {
    background-color: rgb(249, 192, 86);
    cursor: pointer;
    color: white;
    font-size: 20px;
    
  
  }
  #navButtons:hover {
    background-color:rgba(209, 136, 0, 0.761);
    color: white;
  } 
  @media screen and (max-width:50em) {

  #participateButton,
  #createButton {
    height: 80px;
    width: 100%;
  }
    .logo {
      font-size: 5vw;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hamburger::before {
      content: "☰";
      font-size: 46px;
      color: rgb(249, 192, 86); 
    }
    .close::before {
      content: "✕";
      color: rgb(249, 192, 86);
    }
    .hide {
      left:-12em;
    }

    .container {
      top: 67%;
      padding-top:100px;
      padding-bottom: 15px;
    }
    h1{
      font-size: 28px;
    }
    h2{font-size: 20px;}
  
  }


  </style>