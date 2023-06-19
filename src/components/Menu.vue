<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goTo = (href) => {
  router.push({name : href})
}
</script>

<template>
  <div class="menu">
    <nav>
      <ul>
        <li @click="goTo('Home')">
          <img src="../assets/img/menu/home.svg" alt="">
        </li>
        <li @click="goTo('Transaction')">
          <img src="../assets/img/menu/stats.svg" alt="">
        </li>
        <li @click="goTo('Home')">
          <img src="../assets/img/menu/card.svg" alt="">
        </li>
        <li @click="goTo('Transaction')">
          <img src="../assets/img/menu/profil.svg" alt="">
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss">
.menu{
  box-shadow: 0px -2px 30px rgba(0, 0, 0, 0.07);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  padding: 25px 0;
  nav{
    width: 80%;
    margin: 0 auto;
    ul{
      display: flex;
      list-style-type: none;
      padding: 0;
      justify-content: space-between;
    }
  }
}
</style>