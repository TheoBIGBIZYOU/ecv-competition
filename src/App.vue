<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import Stories from "./components/Stories.vue";
import Menu from "./components/Menu.vue";
import QuestionnaireScreen from "./views/QuestionnaireScreen.vue";

const showMenu = ref(true);
const router = useRouter();
const linkActive = ref('');

watch(
  () => router.currentRoute.value.name,
  (newName) => {
    showMenu.value = !["Login", "Register", "Transaction", "Single Transaction"].includes(newName);
    linkActive.value = router.currentRoute.value.name;
    console.log(linkActive.value)
  }
);
</script>

<template>
  <div class="main">
    <!--    <Stories />-->
    <router-view></router-view>
    <Menu v-if="showMenu" :linkActive="linkActive" />
    <!--    <QuestionnaireScreen />-->
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
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
  font-family: "Work Sans", sans-serif;
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
  //width: 100%;
  width: -webkit-fill-available;
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  padding: 18px 24px;
  border-radius: 8px;
  border: none;
  border-radius: 8px;
}
</style>