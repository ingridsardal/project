<template>
<div>

    <body class="background">
        <header>
            <h1> {{ uiLabels.giveScore }} {{roundCounter}} </h1>
            <h3 style="font-weight: bold;"> {{ uiLabels.letter }}{{
          selectedLetter.toUpperCase() }}</h3>
        </header>

        <section id="Section1">
            <div class="wrapper">

                <div v-for="player in players" :key="player.id" class="player-item">
                    <h2>{{ player.nameId }}
                        <div id="playerAvatar">
                            <img :src="player.avatar" alt="Animated GIF">
                        </div>
                    </h2>

                    <ul>
                        <li v-for="(answer, category) in player.answers[roundCounter - 1]" :key="category">
                            <div class="answerContainer">
                                <input type="checkbox" :checked="checkedAnswers[player.id] && checkedAnswers[player.id][answer]" @change="handleCheckboxChange(player.nameId, category, answer, $event)">
                                <div class="answerLabel"> {{ uiLabels[category] }}: {{ answer }} </div>
                            </div>

                        </li>
                    </ul>
                </div>

            </div>
        </section>
    </body>
    <footer>
        <button id="showScoreboardButton" v-on:click="giveScore">{{ uiLabels.showScoreboard }}</button>
    </footer>
</div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
    data() {
        return {
            lang: localStorage.getItem("lang") || "en",
            data: {},
            uiLabels: {},
            pollId: "inactive poll",
            players: [],
            categories: [],
            roundCounter: 0,
            checkedAnswers: {},
            isChecked: false,
            selectedLetter: "",
        };
    },

    created() {
        this.pollId = this.$route.params.id;
        socket.emit("pageLoaded", this.lang);

        socket.emit('startGame', {
            pollId: this.pollId
        });

        socket.emit('joinSocket', {
            pollId: this.pollId
        })

        socket.on('getInfo', (poll) => {
            console.log("getinfo", poll.players)
            this.rounds = poll.rounds;
            this.categories = poll.categories;
            this.roundCounter = poll.roundCounter;
            this.players = poll.players
            this.selectedLetter = poll.selectedLetter;

        })
        socket.on('getAnswers', (players) => {
            console.log("getAnswers", players)
            this.players = players;
            this.isAnswered = true;
        })
        socket.on('movingAllToScoreboard', () => {
            console.log("moved players to scorebaord")
            this.$router.push('/creatorleaderboard/' + this.pollId);
        })
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
            this.uiLabels = labels
        })
    },

    methods: {
        startAnimation(playerId) {
            this.animatedPlayer = playerId;
        },

        handleCheckboxChange(playerName, category, answer, event) {
            if (!this.checkedAnswers[playerName]) {
                this.checkedAnswers = {
                    ...this.checkedAnswers,
                    [playerName]: {}
                };
            }
            this.checkedAnswers = {
                ...this.checkedAnswers,
                [playerName]: {
                    ...this.checkedAnswers[playerName],
                    [answer + category]: event.target.checked
                },
            };
        },

        giveScore() {
            this.players.forEach(player => {
                if (this.checkedAnswers[player.nameId]) {
                    player.points = Object.values(this.checkedAnswers[player.nameId]).filter(checked => checked).length;
                    console.log(this.checkedAnswers, "poäng")
                    this.isChecked = true;

                }
            });
            console.log("giveScore", this.players, this.checkedAnswers)
            if (this.players.every(player => player.hasAnswered === true)) {
                socket.emit('giveScore', {
                    pollId: this.pollId,
                    players: this.players,
                    isChecked: this.isChecked
                })
                socket.emit('moveToScoreboard', {
                    pollId: this.pollId
                })
            } else {
                alert(this.uiLabels.everyoneHasNotAnswered);
            }
        }
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

body {
    font-family: 'Open Sans', sans-serif;
    color: rgb(0, 88, 117);
}

.background {
    background-image: url('/img/bluebg.png');
    background-size: cover !important;
    background-position: center;
    height: 178vh;
    margin-top: -34px;

}

footer {
    background: #84d4e1;
}

.wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.player-item {
    flex: 0 0 30%;
    margin: 10px;
    padding: 10px;
    border: 2px solid black;
    border-radius: 10px;
    transition: transform 1s ease-in-out;
    background-color: rgb(240, 248, 255, 0.6);
}

#playerAvatar img {
    width: 150px;
}

.answerContainer {
    display: flex;
    align-items: center;
}

.answerLabel {
    margin-right: 10px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.title {
    margin: 0;
}

#hamster {
    height: 100px;
    width: 100px;
}

h1 {
    color: rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 50px;
}

h2 {
    font-weight: bold;
    text-align: center;
    color: rgb(255, 183, 0);
    font-size: 200%
}

h3 {
    font-weight: normal;
    text-align: center;
    font-size: 30px
}

#showScoreboardButton {
    background-color: rgb(113, 255, 113);
    color: rgb(0, 88, 117);
    height: 80px;
    width: 12em;
    margin: 25px;
    position: fixed;
    bottom: 0;
    right: 0;
    font-family: 'Open Sans', sans-serif;
    border: none;
    border-radius: 10px;
}

#showScoreboardButton:hover {
    background-color: #70e070;
}

ul {
    list-style: none;
}

@media screen and (max-width:50em) {
    h1 {
        font-size: 40px;
    }

    h3 {
        font-size: 18px;
    }

    .background {
        height: 264vh;
        margin-top: -27px
    }

    .player-item {
        flex: 0 0 20%;
        margin: 7px;
        padding: 7px;
    }

    #playerAvatar img {
        width: 100px;
    }

    .answerContainer {
        margin-left: -30px;
        font-size: 12px;
    }
}
</style>
