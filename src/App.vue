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
    showMenu.value = !["Login", "Register", "Transaction", "SingleTransaction"].includes(newName);
    linkActive.value = router.currentRoute.value.name;
  }
);
</script>

<template>
  <div :class="showMenu ? 'main menuVisible' : 'main'">
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

.main {
  background-color: #F8F8F8;
  &.menuVisible {
    padding-bottom: 100px;
  }
}

.flex {
  display: flex;
}

.flex-center {
  align-items: center;
  justify-content: center;
}

button:not(.showPassword):not(.closeStory):not(.logoutBtn):not(.deleteAccount) {
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

.user_image {
        width: 45px;
        height: 45px;
        background-color: var(--grey);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 23px;
        position: relative;

        &::before {
          content: '';
          width: calc(100% + 6px);
          height: calc(100% + 6px);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: url('data:image/svg+xml,<svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.37256" y="0.978973" width="37.098" height="37.098" rx="18.549" stroke="url(%23paint0_linear_184_1879)" stroke-width="0.78815" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2.53 2.53"/><defs><linearGradient id="paint0_linear_184_1879" x1="19.9216" y1="0.978973" x2="19.9216" y2="38.077" gradientUnits="userSpaceOnUse"><stop stop-color="%2369D38C"/><stop offset="1" stop-color="%233B63DB"/></linearGradient></defs></svg>');
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }

        img {
          width: 100%;
        }
      }
</style>