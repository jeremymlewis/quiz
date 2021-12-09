<template>
<div class="admin">
  <router-link v-if="!loggedIn" to="/account">Log In</router-link>
  <div class="userInfo" v-if="user">
    <div class="circle">{{loggedIn[0]}}</div>
    <router-link v-if="loggedIn" to="/account">{{loggedIn}}</router-link>
    <h2>You have completed {{user.quizzesTaken}} quizzes!</h2>
    <h2>In total you have earned {{user.pointsEarned}} points!</h2>
    </div>
  <h1>Quiz!</h1>
  <p v-if="previousCorrect">You got the last one right!</p>
  <div v-if="(position < questions.length)" class="activeQ">
    <h2>{{questions[position].text}}</h2>
    <input type="radio" id="true" name="answer" value="true">
    <label for="true">True</label><br>
    <input type="radio" id="false" name="answer" value="false">
    <label for="false">False</label><br>
    <button @click="goToNext()">Submit</button>
  </div>
  <div v-if="(position >= questions.length)">
    <h2>Quiz Complete!</h2>
    <button @click="returnHome()">Return to home</button>
  </div>
</div>

</template>

<style scoped>
.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.add,
.edit {
  display: flex;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

#true {
  padding-bottom: 6px;
}
#false {
  padding-bottom: 6px;
}


.activeQ {
    border: 3px solid black;
    background-color: #B7918C;
    padding-left: 16px;
    padding-bottom: 6px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}

.userInfo {
  background-color: #B7918C;
  padding: 5px;
  border: 3px solid black;
  margin-bottom: 5px;
}

</style>

<script>
import axios from 'axios';
export default {
  name: 'Questions',
  data() {
    return {
      currentId: "",
      questions: [],
      position: 0,
      previousCorrect: 0,
      loggedIn: "",
      user: null,
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    async getItems() {
      try {
        let tile = this.currentId
        let response = await axios.get("/api/questions/" + tile);
        this.questions = response.data;
        return true;
      } catch (error) {
        return false
      }
    },
    goToNext() {
      const rbs = document.querySelectorAll('input[name="answer"]');
        let correctAns = this.questions[this.position].answer
        for (const opt of rbs) {
          if (opt.checked) {
            if (correctAns == opt.value) {
              this.previousCorrect = 1;
              if (this.user) {
                  this.user.pointsEarned += 1;
              }   
            } else {
              this.previousCorrect = 0;
            }
          }
        }
      this.position += 1;
    },
    returnHome() {
      if (this.user) {
        //console.log("hay user")
        axios.put("/api/account", {
          quizzesTaken: this.user.quizzesTaken+1,
          pointsEarned: this.user.pointsEarned,
          username: this.user.username
        });
      }
      //UPDATE USER IN DB
      this.$router.push("/")
    }
  },

  async beforeMount() {
    this.currentId = localStorage.getItem('QuestionsId')
    this.getItems();
    let currentUser = localStorage.getItem('CurrentUser')
    let response = await axios.get("/api/account/" + currentUser);
    if (currentUser) {
      this.loggedIn = currentUser
      this.user = response.data
    }
  },
}
</script>
