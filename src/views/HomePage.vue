<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";

import { ref, onMounted } from "vue";

const userStore = useUserStore();

const router = useRouter();

onMounted(() => {
  userStore.accessToken == null ? router.push({ name: "Login" }) : "";
});

</script>

<template>
  <h1>hello world</h1>
</template>
