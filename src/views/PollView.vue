<template>
<div>
    {{pollId}}
    <QuestionComponent v-bind:question="question" v-on:answer="submitAnswer($event)" />

    <span>{{submittedAnswers}}</span>
</div>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
    name: 'PollView',
    components: {
        QuestionComponent
    },
    data: function () {
        return {
            question: {
                q: "",
                a: []
            },
            pollId: "inactive poll",
            submittedAnswers: {}
        }
    },
    created: function () {
        this.pollId = this.$route.params.id
        socket.emit('joinPoll', this.pollId)
        socket.on("newQuestion", q =>
            this.question = q
        )
        socket.on("dataUpdate", answers =>
            this.submittedAnswers = answers
        )
    },
    methods: {
        submitAnswer: function (answer) {
            socket.emit("submitAnswer", {
                pollId: this.pollId,
                answer: answer
            })
        }
    }
}
</script>
