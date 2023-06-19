<script setup>
import Stories from "./components/Stories.vue";
import Menu from "./components/Menu.vue";
import QuestionnaireScreen from "./views/QuestionnaireScreen.vue";
</script>

<template>
  <div class="main">
    <!--    <Stories />-->
    <router-view></router-view>
    <!--    <Menu />-->
    <!--    <QuestionnaireScreen />-->
  </div>
</template>

<style lang="scss">
:root {
  --blue: #3b63db;
  --green: #69d38c;
  --black: #191b1f;
  --grey: #cbcbdd;
  --grey-dark: #877777;
}

*,
html,
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.flex {
  display: flex;
}

.flex-center {
  align-items: center;
  justify-content: center;
}

button:not(.showPassword) {
  display: block;
  margin-inline: auto;
  width: 100%;
  font-weight: 700;
  text-align: center;
  font-size: 14px;
  padding: 18px 24px;
  border-radius: 8px;
  border: none;
  border-radius: 8px;
}
</style>