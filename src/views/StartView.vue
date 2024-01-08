<template>
  <body class="background">
    <header>
      <div v-bind:class="['hamburger', {'close': !hideNav}]" 
           v-on:click="toggleNav" ref="hamburgerMenu">
      </div>
      <div class="logo">
        <img src="/img/logga2.gif">
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
      <button v-on:click="FAQFunction" id="navButtons"> {{uiLabels.rules}} </button>    
    </ResponsiveNav>
  </footer>
  </template>
  
  <script>
  import ResponsiveNav from '@/components/ResponsiveNav.vue';
  import io from 'socket.io-client';
  //sessionStorage.setItem("dataServer", "localhost:3000"); //Ingrids (change to your own ip adress)
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
        alert(this.uiLabels.howToPlay)
      },
      closeMenu(event) {
        if (this.$refs.hamburgerMenu && !this.$refs.hamburgerMenu.contains(event.target)) {
        this.hideNav = true;
  }
  },
      toggleNav: function () {
        this.hideNav = ! this.hideNav;
      }
    },
    mounted() {
  window.addEventListener('click', this.closeMenu);
},
beforeDestroy() {
  window.removeEventListener('click', this.closeMenu);
}
  }
  </script>
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');
    
    body {font-family: 'Open Sans', sans-serif;}
    .background {
  /* Stilen för att göra bilden till bakgrund på hela sidan */
  background-image: url('/img/bluebg.png');
  background-size: cover;
  /* Anpassar storleken på bilden så att den täcker hela sidan */
  background-position: center;
  /* Centrerar bakgrundsbilden på sidan */
  height: 90vh;
  /* Gör elementet lika högt som fönstret (hela sidan) */
  top: 0;
}
    header {
      background-color: rgb(255, 255, 255);
      height: 0;
      display: grid;
      grid-template-columns: 0em auto;
    }
    
    .container {
      background-color: rgb(249, 192, 86);
      border-radius: 10px;
      padding: 40px;
      /* Ta bort absolut positionering */
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%); 
      width: 50%; /* Använd procentuell bredd */
      max-width: 700px;
      color: white;
      /*margin: 0 auto; /*Centrera horisontellt */
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
    font-family: 'Open Sans', sans-serif;
    font-size: 1.5rem;
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
      /*padding-top: 0.1em;*/
      position: relative; /* Required for z-index to work */
      z-index: 0; /* Any number less than the z-index of .hamburger */
    }
    .logo img {
      max-width: 20%;
      /*vertical-align: bottom;*/
      margin-top: 20px;
    /*.logo {
      font-size: 5vw;
      display: flex;
      align-items: center;
      justify-content: center;
    }*/
    }
    .hamburger {
      color:white;
      width:1em;
      display: flex;
      align-items: center;
      justify-content: left;
      padding: 0.5rem;
      top: 0;
      left: 0;
      height: 2rem;
      cursor: pointer;
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
    margin-bottom: 0%; /* This pushes the footer to the bottom */
    padding: 1%;
    text-align: center;
    background-color:#84D4E1;
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
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    background-color: rgb(249, 192, 86);
    color: white; 
    border: 2px solid rgba(255, 226, 173, 0.6); /* Lägg till en border med lite mörkare orange */
    cursor: pointer;
    box-shadow: none;
   
 
  }
  #navButtons:hover {
    background-color:rgba(209, 136, 0, 0.761);
    color: white;
  } 
  @media screen and (max-width:50em) {
    .background{height:100vh;}
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
      padding-top:10px;
      padding-bottom: 15px;
    }
    h1{
      font-size: 28px;
    }
    h2{font-size: 20px;}
  
    .logo img {
      max-width: 75%;
      vertical-align: bottom;
      margin-left: 0%;
      margin-top:30px;
  }
  }
  </style>