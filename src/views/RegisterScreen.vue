<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";

import { ref } from "vue";

const userStore = useUserStore();

const mail = ref("");
const password = ref("");

const router = useRouter();

const registerForm = async () => {
  const options = {
    url: "https://api.bridgeapi.io/v2/users",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Bridge-Version": "2021-06-01",
      "content-type": "application/json",
    },
    data: { email: mail.value, password: password.value },
  };

  const response = await CapacitorHttp.post(options);

  if (response.status === 200) {
    authUser(response.data.email, password.value);
  } else {
    console.log("ERROR Request FAIL");
  }
};

const authUser = async (mail, password) => {
  const options = {
    url: "https://api.bridgeapi.io/v2/authenticate",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Bridge-Version": "2021-06-01",
      "content-type": "application/json",
    },
    data: { email: mail, password: password },
  };

  const response = await CapacitorHttp.post(options);

  if (response.status === 200) {
    userStore.setupAccessToken(response.data.access_token);
    router.push({ name: "Home" });
  } else {
    console.log("ERROR Request FAIL");
  }
};
</script>

<template>
  <form ref="register" @submit.prevent="registerForm">
    <input type="email" v-model="mail" />
    <input type="password" v-model="password" />
    <button type="submit">S'enregistrer</button>
  </form>
</template>