<template>
    <div>
      {{pollId}}
      <QuestionComponent v-bind:question="question"
                v-on:answer="submitAnswer($event)"/>
  
                <span>{{submittedAnswers}}</span>
    </div>
    <div>
        <h2>
            TEST
        </h2>

        <label>
      <br>
      Write poll id: 
      <input type="text" v-model="id">
    </label>
    <label>
      Name: 
      <input type="text" v-model="id">
    </label>

    <div>{{ uiLabels.joinGame }} <br> {{ uiLabels.createPoll }}</div>
    </div>
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
    socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })
      
    },

    methods: {
      submitAnswer: function (answer) {
        socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      }
    }
  }
  </script>
  