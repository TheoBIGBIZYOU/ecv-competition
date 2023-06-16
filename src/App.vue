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