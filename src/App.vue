<script setup>
import Stories from "./components/Stories.vue";
import Menu from "./components/Menu.vue";
</script>

<template>
  <Stories />
  <router-view></router-view>
  <Menu />
</template>