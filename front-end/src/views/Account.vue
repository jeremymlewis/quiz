<template>
<div class="admin">
  <h1>Account Page</h1>
  <p>click on the home icon to return</p>
    <div v-if="loggedIn == ''">
        <div>
          <h2>Enter A Username to continue</h2>
          <input v-model="username" placeholder="Username">
          <button @click="login(username)">Login</button>
        </div>
    </div>

    <div v-if="loggedIn != ''">
    <button @click="logout">Logout</button>
    <div>
    <div class="userInfo" v-if="user">
    <div class="circle">{{loggedIn[0]}}</div>
    <h2>Welcome {{loggedIn}}!</h2>
    <h2>You have completed {{user.quizzesTaken}} quizzes!</h2>
    <h2>In total you have earned {{user.pointsEarned}} points!</h2>
    </div>
    </div>
    <button v-if="!newQuiz" @click="toggleNewQuiz()">Make a New Quiz</button>
    <button v-if="!addQuestions" @click="toggleAddQuestions()">Add Questions to an Existing Quiz</button>
    <div v-if="newQuiz" class="newQuiz">
      <button @click="toggleNewQuiz()">Hide New Quiz Form</button>
      <div>
        <p>Choose a title for your quiz:</p>
        <input v-model="title" placeholder="Title">
        <p></p>
        <p>Upload a cover photo for your quiz:</p>
        <input type="file" name="photo" @change="fileChanged">
        <button @click="upload">Upload</button>
      </div>
      <div v-if="addItem">
        <h2>{{addItem.title}}</h2>
        <img :src="addItem.path" />
      </div>
    </div>
    <div v-if="addQuestions" class="newQuiz">
    <div>
      <button @click="toggleAddQuestions()">Hide Question Add Form</button>
      <h2>Add Questions to a quiz!</h2>
    </div>
      <p>select a quiz from the list</p>
    <div>
      <div>
        <input v-model="findTitle" placeholder="Search">
        <div class="suggestions" v-if="suggestions.length > 0">
          <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">{{s.title}}
          </div>
        </div>
      </div>
      <div v-if="findItem">
        <p>Input New Question for {{findItem.title}}:</p>
        <input v-model="findItem.text">
        <p>What is the correct answer?</p>
        <input type="radio" id="true" name="answer" value="true">
        <label for="true">True</label><br>
        <input type="radio" id="false" name="answer" value="false">
        <label for="false">False</label><br>
        <p></p>
      </div>
      <div v-if="findItem">
        <button @click="addQuestion()">Add Question</button>
        <p></p>
        <button @click="deleteItem(findItem)">Delete Entire Quiz "{{findItem.title}}"</button>
      </div>
    </div>
    </div>
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

.userInfo {
  background-color: #B7918C;
  padding: 5px;
  border: 3px solid black;
  margin-bottom: 5px;
}

.newQuiz {
  background-color: #DDC67B;
  padding: 5px;
  border: 3px solid black;
  margin-bottom: 5px;
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
 h1 {
   padding-bottom: 0px !important;
 }
 
.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

img {
  max-width: 300px;
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

</style>

<script>
import axios from 'axios';
export default {
  name: 'Account',
  data() {
    return {
      newQuiz: null,
      addQuestions: null,
      loggedIn: "",
      user: null,
      items: [],
      title: "",
      file: null,
      text: "",
      currentId: "",
      addItem: null,
      findTitle: "",
      findItem: null,
      username: "",
    }
  },
  computed: {
    suggestions() {
      let items = this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return items.sort((a, b) => a.title > b.title);
    }
  },
  created() {
    this.getItems();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
      //  console.log(error);
      }
    },
    async deleteItem(item) {
      try {
        await axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async editItem(item) {
      //console.log(this.findItem.text)
      try {
        await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          text: this.findItem.text
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
      this.currentId = item._id;
      console.log(item._id)
    },
    async login(username) {
        let response = await axios.get("/api/account/" + username);
        //console.log(response);
        if (response.data == "") {//IF NOT FOUND THEN ADD THE USERNAME TO THE DB
          let logginSuccess = await axios.post("/api/account", {
            username: username,
          });
          //console.log(logginSuccess);
          if (logginSuccess) {
            this.user = logginSuccess;
            this.loggedIn = username;
          }
        } else {
          this.user = response.data
          this.loggedIn = username;
        }
        localStorage.setItem('CurrentUser', this.loggedIn)
        //console.log(this.user)
    },
    async logout() {
      localStorage.removeItem('CurrentUser');
      this.user = null;
      this.loggedIn = "";
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/items', {
          title: this.title,
          text: this.text,
          path: r1.data.path
        });
        this.addItem = r2.data;
      } catch (error) {
        //console.log(error);
      }
    },
    async addQuestion() {
        const rbs = document.querySelectorAll('input[name="answer"]');
        let correctAns = "false"; //FALSE BY DEFAULT
        for (const opt of rbs) {
          if (opt.checked) {
            correctAns = opt.value; 
            break;
          }
        }
        //console.log(this.currentId)
        await axios.post('/api/question', {
            tile: this.currentId,
            answer: correctAns,
            text: this.findItem.text
        })
        this.findItem.text = ""
    },
    toggleNewQuiz() {
      if (this.newQuiz == null) {
        this.newQuiz = "on"
      } else {
        this.newQuiz = null
      }
    },
    toggleAddQuestions() {
      if (this.addQuestions == null) {
        this.addQuestions = "on"
      } else {
        this.addQuestions = null
      }
    },
  },
  async beforeMount() {
    let currentUser = localStorage.getItem('CurrentUser')
    let response = await axios.get("/api/account/" + currentUser);
    if (currentUser) {
      this.loggedIn = currentUser
      this.user = response.data
      //SET USER TO THE DB CALL FROM THIS
    }
  },
}
</script>
