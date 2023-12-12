<template> 

<header>
    <h2> Dags att rätta! </h2>
  </header>

  <body>
    <h3 style="font-weight: normal;">
      Markerar rätt svar:
    </h3>
<div>

  Hej hopp!!!!!!!!!!!!  Här ska spelledare få in alla svar på en gång eller live. Creator rättar alla svar med checkboxes och 
  sedan klickar på vidare, då skickas alla till en leaderboard
</div>
</body>



    <footer>
      <router-link v-bind:to="'/creatorleaderboard/'">
    <button id= "Tillfällig" v-on:click="">Tillfällig knapp som göra att man kommer till Creator scoreboard </button>      <!-- göra så att man kan justera språk-->
    </router-link>
</footer>


</template>
<script>

</script>
<style scoped>
 h2 { 
    color:rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 50px; 
    }
    #Tillfällig {
  background-color: rgb(113, 255, 113);
  height: 80px;
  width: 12em;
  margin: 25px;
  position: absolute;
  bottom: 0;
  right: 0;
}
    </style>