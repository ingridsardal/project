<template>
<body>
    <div class="background">

        <h1>
            {{ uiLabels.headerJoinGame }}
        </h1>

        <label>
            <br>
            {{ uiLabels.gameId }}:
            <input type="text" v-model="pollId">
        </label>
        <br>
        <br>
        <label>
            {{ uiLabels.name }}:
            <input type="text" v-model="nameId" maxlength="8">
        </label>
        <br>
        <br>
        <label>
            {{ uiLabels.selectAvatar }}:
        </label>

        <section>
            <div class="wrapper">
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/xT9IgM7SyNjzZBxvDG/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/xT9IgM7SyNjzZBxvDG/giphy.gif'">
                    <img src="https://media.giphy.com/media/xT9IgM7SyNjzZBxvDG/giphy.gif" alt="Animated GIF">
                </button>
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/etKPlfE85HW8udMMDl/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/etKPlfE85HW8udMMDl/giphy.gif'">
                    <img src="https://media.giphy.com/media/etKPlfE85HW8udMMDl/giphy.gif" alt="Animated GIF">
                </button>
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/w0hpqElNgofh1bdUD3/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/w0hpqElNgofh1bdUD3/giphy.gif'">
                    <img src="https://media.giphy.com/media/w0hpqElNgofh1bdUD3/giphy.gif" alt="Animated GIF">
                </button>
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/u7e9QxCHnNzWxswBZJ/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/u7e9QxCHnNzWxswBZJ/giphy.gif'">
                    <img src="https://media.giphy.com/media/u7e9QxCHnNzWxswBZJ/giphy.gif" alt="Animated GIF">
                </button>
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/fkdMDbf18tqkamTnnZ/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/fkdMDbf18tqkamTnnZ/giphy.gif'">
                    <img src="https://media.giphy.com/media/fkdMDbf18tqkamTnnZ/giphy.gif" alt="Animated GIF">
                </button>
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/l4FGFHiVod82HC2ly/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/l4FGFHiVod82HC2ly/giphy.gif'">
                    <img src="https://media.giphy.com/media/l4FGFHiVod82HC2ly/giphy.gif" alt="Animated GIF">
                </button>
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/3oKIPhxtCqLe49VI08/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/3oKIPhxtCqLe49VI08/giphy.gif'">
                    <img src="https://media.giphy.com/media/3oKIPhxtCqLe49VI08/giphy.gif" alt="Animated GIF">
                </button>
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/3oKIPBYGLy6qk8bdrq/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/3oKIPBYGLy6qk8bdrq/giphy.gif'">
                    <img src="https://media.giphy.com/media/3oKIPBYGLy6qk8bdrq/giphy.gif" alt="Animated GIF">
                </button>
                <button class="avatars" :class="{ 'selected-avatar': selectedGif === 'https://media.giphy.com/media/3kMiS4AA4P4L2Z6TT7/giphy.gif' }" @click="selectedGif = 'https://media.giphy.com/media/3kMiS4AA4P4L2Z6TT7/giphy.gif'">
                    <img src="https://media.giphy.com/media/3kMiS4AA4P4L2Z6TT7/giphy.gif" alt="Animated GIF">
                </button>
            </div>
        </section>
        <br>
        <button id="joinButton" v-on:click="joinButton">
            {{ uiLabels.joinGame }}
        </button>

        <footer>
            <router-link v-bind:to="'/'">
                <button id="goBackButton" v-on:click="goBack">{{ uiLabels.backButton }} </button>
            </router-link>
        </footer>
    </div>
</body>
</template>

<script>
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
            selectedGif: "https://media.giphy.com/media/aYKTYtCYb2ECSKfyal/giphy.gif",
            tooMany: false
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
                console.log("socket on else", this.tooMany)
            }
        })

    },

    methods: {
        joinButton: function () {
            new Promise((resolve) => {
                    socket.emit("getNumOfPlayers", this.pollId)
                    socket.on("numOfplayers", (players) => {
                        console.log("socket on", players.length)
                        if (players.length >= 6) {
                            this.tooMany = true
                            console.log("socket emit", this.tooMany)
                        }
                        resolve()
                    })
                })
                .then(() => {
                    if (!this.tooMany) {
                        console.log("socket emit igen", this.tooMany)
                        socket.emit("joinGame", {
                            pollId: this.pollId,
                            nameId: this.nameId,
                            avatar: this.selectedGif
                        })
                    } else {
                        alert("Too many players")
                    }
                })
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');

body {
    font-family: 'Open Sans', sans-serif;
    color: rgb(0, 88, 117);
}

h1 {
    color: rgb(249, 192, 86);
    text-shadow: rgb(255, 183, 0) 1px 0 10px;
    font-size: 50px;
}

h3 {
    font-weight: bold;
}

.selected-avatar {
    border: 6px solid green;
}

.background {
    background-image: url('/img/bluebg.png');
    background-size: cover;
    background-position: center;
    height: 110vh;
    margin-top: -34px
}

#joinButton {
    height: 80px;
    width: 12em;
    margin: 25px;
    position: absolute;
    bottom: 0;
    right: 0;

    background-color: lightgreen;
    color: rgb(0, 88, 117);
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'Open Sans', sans-serif;
}

#joinButton:hover {
    background-color: #70e070;

}

#goBackButton {
    background-color: rgb(255, 206, 114);
    color: rgb(0, 88, 117);
    height: 80px;
    width: 12em;
    margin: 25px;
    position: absolute;
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

section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px;
}

.wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 40%;
    margin: auto;
    padding-left: 50px;
    padding-right: 50px;
    margin-bottom: 40px;
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
    width: 15%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 2px solid black;
    border-radius: 10px;
    padding: 10px;
    margin-left: 40%;
    margin-top: 5%;

}

#selectedAvatar img {
    width: 100%;
    height: auto;
}

@media screen and (max-width:50em) {

    h1 {
        font-size: 40px;
    }

    #joinButton,
    #goBackButton {
        height: 80px;
        width: 10em;
    }

    .wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 80%;
        margin-left: -4%;
    }

    .avatars img {
        width: 80%;
        height: auto;
    }

    #selectedAvatar {
        margin-top: 45%;
    }
}
</style>
