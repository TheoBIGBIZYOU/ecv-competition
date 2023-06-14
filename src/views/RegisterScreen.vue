<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";

import { ref } from "vue";

const userStore = useUserStore();

const mail = ref("");
const password = ref("");

const router = useRouter();

const registerForm = () => {
  const options = {
    method: "POST",
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

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data)
      authUser(response.data.email, password.value)
    })
    .catch(function (error) {
      console.error(error);
    });
};

const authUser = (mail, password) => {
  const options = {
    method: "POST",
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

  axios
    .request(options)
    .then((response) => {
      userStore.setupAccessToken(response.data.access_token);
      router.push({ name: "Home" });
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>

<template>
  <form ref="register" @submit.prevent="registerForm">
    <input type="email" v-model="mail" />
    <input type="password" v-model="password" />
    <button type="submit">S'enregistrer</button>
  </form>
</template>