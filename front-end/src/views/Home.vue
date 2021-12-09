<template>
<div class="home">
  <div class="userInfo" v-if="!user">
  <h2>Welcome to The AmericanJeremy True or False Quiz Page!</h2>
  <h2>Login to record your scores, and be able to add quizzes of your own</h2>
  <h2>User accounts are free, and are not even password protected... for your convenience</h2>
  <h2>All logged in users can also submit new questions to existing quizzes!</h2>
  <router-link v-if="!loggedIn" to="/account">Log In</router-link>
  </div>
  <div class="userInfo" v-if="user">
    <div class="userBox">
    <router-link v-if="loggedIn" to="/account"><div class="circle">{{loggedIn[0]}}</div><h3>{{loggedIn}}</h3></router-link>
    </div>
    <h2>You have completed {{user.quizzesTaken}} quizzes!</h2>
    <h2>In total you have earned {{user.pointsEarned}} points!</h2>
    </div>
  <section class="image-gallery">
    <div class="image" v-for="item in items" :key="item.id">
      <h2>{{item.title}}</h2>
      <button @click="goToQuiz(item)">Play Quiz</button>
      <img :src="item.path" />
    </div>
  </section>
</div>
</template>

<script>
import axios from 'axios';
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
     items: [],
     loggedIn: "",
     user: null
    }
  },
  async created() {
    this.getItems();
    let currentUser = localStorage.getItem('CurrentUser')
    let response = await axios.get("/api/account/" + currentUser);
    if (currentUser) {
      this.loggedIn = currentUser
      this.user = response.data
    }
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
//        console.log(error);
      }
    },
    async goToQuiz(item) {
      //console.log(item._id);
      localStorage.setItem('QuestionsId', item._id)
      this.$router.push("/questions")
    }
  }
}
</script>

<style scoped>
.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.userInfo {
  background-color: #B7918C;
  padding: 5px;
  border: 3px solid black;
  margin-bottom: 5px;
  text-align: left;
}
.userInfo h3 {
  text-align: left !important;
  margin-top: 0;
}
.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center;
}
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 2em;
  margin-right: 20%;
  margin-left: 20%;
  min-width: 60%;

  margin-bottom: 4px;
}
.image h2 {
  text-align: center;
}

.image p {
  font-style: italic;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1.5em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 60%;
  margin-left: 20%;
  margin-right: 20%;
  background-color: #C5A48A;
  border: 3px solid black;
}

.image img {
  width: 100%;
}
.image-gallery {
  column-count: 1;
}
.userBod {
    border: 3px solid black;
}


</style>
