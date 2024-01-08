<template>
<body class="background">
    <header>
        <br>
        <h1> {{ uiLabels.gameCode }}: {{ pollId }}</h1>
    </header>
    <h3 class="shareCode"> {{ uiLabels.shareCode }}! </h3>

    <div class="wrapper">

        <div v-for="player in players" :key="player.id" class="player-item">

            <div id="playerAvatar">
                <h2>{{ player.nameId }} </h2>
                <img :src="player.avatar" alt="Animated GIF">
            </div>

        </div>
    </div>
</body>
<footer>
    <router-link v-bind:to="'/create/'">
        <button id="goBackButton" v-on:click="goBack">{{ uiLabels.backButton }} </button>
    </router-link>
    <button id="startGameButton" v-on:click="startGame">{{ uiLabels.startGame }} </button>
</footer>
</template>

<script>
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

const currentURL = window.location.href;

const pathArray = window.location.pathname.split('/');

const gameId = pathArray[pathArray.length - 1];

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
            submittedAnswers: {},
            pollId: "",
            rounds: "0",
            roundCounter: "0",
            categories: [],
            uiLabels: {},
            players: [],
            firstSelectedLetter: "",
            selectedLetter: ""
        }
    },

    created: function () {
        this.pollId = this.$route.params.id;
        socket.emit("pageLoaded", this.lang);
        socket.emit('startGame', {
            pollId: this.pollId
        });

        socket.emit('joinSocket', {
            pollId: this.pollId
        })

        socket.on('getInfo', (poll) => {
            this.rounds = poll.rounds;
            this.categories = poll.categories;
            this.players = poll.players;
            this.roundCounter = poll.roundCounter;
            this.firstSelectedLetter = poll.firstSelectedLetter;
            this.selectedLetter = poll.selectedLetter;
        })

        socket.on('playersUpdate', (players) => {
            console.log("playersUpdate creatorwaitingview")
            this.players = players;
        })

        socket.on('startGameForAll', () => {
            console.log("start for all participants creatorwaitingview")
            this.$router.push('/creatorgame/' + this.pollId);
        })

        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
    },

    methods: {
        submitAnswer: function (answer) {
            socket.emit("submitAnswer", {
                pollId: this.pollId,
                answer: answer
            })
        },
        startGame: function () {
            if (this.players.length < 1) {
                alert(this.uiLabels.noPlayers)
            } else {
                console.log("starta spel creatorwaitingview")
                socket.emit('startForAll', {
                    pollId: this.pollId
                });
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

body {
    margin-top: -32px;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
    color: rgb(0, 88, 117);
}

.background {
    background-image: url('/img/bluebg.png');
    background-size: cover !important;
    background-position: center;
    height: 110vh;

}

.wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

#goBackButton {
    background-color: rgb(255, 206, 114);
    color: rgb(0, 88, 117);
    height: 10%;
    width: 12em;
    margin: 2%;
    position: fixed;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'Open Sans', sans-serif;
}

#goBackButton:hover {
    background-color: rgb(254, 195, 86);
}

#startGameButton {
    background-color: rgb(113, 255, 113);
    color: rgb(0, 88, 117);
    height: 10%;
    width: 12em;
    margin: 2%;
    position: fixed;
    bottom: 0;
    right: 0;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'Open Sans', sans-serif;
}

#startGameButton:hover {
    background-color: #70e070;
    ;
}

h1 {
    color: rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 300%;
}

h3 {
    font-weight: normal;
    text-align: center;
    font-size: 200%;
    margin-bottom: 0px;
}

h2 {
    font-weight: bold;
    text-align: center;
    color: rgb(255, 183, 0);
    font-size: 20px
}

ul {
    list-style: none;
}

li {
    font-size: 150%;
    text-align: center;
}

#playerAvatar {
    width: 30%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 2px solid black;
    border-radius: 10px;
    padding: 20px;
    padding-left: 30px;
    padding-right: 30px;
    margin-left: 30%;
    margin-top: 10px;
    background-color: rgb(240, 248, 255, 0.6);
}

#playerAvatar img {
    width: 100%;
    height: auto;
}

@media screen and (max-width:50em) {

    body {
        margin-top: -22px;
        padding: 0;
    }

    .wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-left: 30px;
        margin-right: 30px;

    }

    #playerAvatar {
        margin-left: 10%;
        height: 120px;
        margin-right: -40px;
    }

    h1 {
        font-size: 200%;
    }

    h2 {
        font-weight: bold;
        text-align: center;
        color: rgb(255, 183, 0);
        font-size: 14px
    }

    h3 {
        font-size: 120%;
    }

}
</style>
