<template>
<div id="app">
  <div class="header">
    <router-link to="/">
      <div class="logo">
        <img src="/home.png">
      </div>
    </router-link>
    <div class="title">
      <h1>True or False</h1>
    </div>
  </div>
  <div class="content">
    <router-view />
  </div>
  <div class="footer">
    <p><a href="https://github.com/jeremymlewis/quiz">github repo (2021 jeremymlewis)<a></p>
  </div>
</div>
</template>

<style>
html {
  box-sizing: border-box;
}

body {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  padding: 0px;
  margin: 0px;
}

/* Header */
.header {
  justify-content: center;
  display: flex;
  padding: 10px 100px 0px 100px;
  background-color: #DDC67B;
  color: #291F1E;
}

.logo img {
  max-height: 64px;
}

.title {
  margin-top: 5px;
}



.content {
  background-color: #B38CB4;
  padding: 20px 100px;
  min-height: 500px;
}

/* Footer */
.footer {
  height: 50px;
  padding: 20px 100px 0px 100px;
  background: #F8F272;
  font-size: 12px;
}

.footer a {
  color: #000;
}

h2 {
  font-size: 18px;
}


</style>
