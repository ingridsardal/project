<template>

    <header id="round">
      <h1> Omgång {{ roundNumber }} <span>{{ currentLetter }}</span> </h1>
    </header>

    <h3 id="infoText"> 
        Nu ska du skriva en sak under varje kategori som börjar på den angivna bokstaven. Lycka till king!  
    </h3>

    <div class="contentWrapper">
      <div class="categories">

        <h2>
          Kategorier:
        </h2>

        <p>
          Kategori 1 (variabel)
          <br>
          Kategori 2 (variabel)
          <br>
          Kategori 3 (variabel)
          <br>
          ...
        </p>
      </div>

      <div class="letterInfo">
        <h2>Bokstav:</h2>
        <p>Här kan du skriva information om vilken bokstav som gäller för rundan.</p>
      </div>
    </div>
    
    <button id="lockAnswers" class="lockButton">Lås in svar!</button>
  </template>
  
  <style>
  #round {
    color: rgb(249, 192, 86);
  }
  
  .contentWrapper {
    display: flex;
    justify-content: space-between;
  }
  
  .categories {
    flex-basis: 50%;
  }
  
  .letterInfo {
    flex-basis: 45%;
  }
  
  .letterInfo h2 {
    margin-top: 0;
  }

  #infoText {
    font-size: 15px;
  }

  .lockButton {
  background-color: rgb(113, 255, 113);
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.lockButton:hover {
  background-color: #70e070;
}
  </style>