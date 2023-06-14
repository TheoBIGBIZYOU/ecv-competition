<script setup>
import axios from "axios";
import { useRouter } from 'vue-router';

import { ref } from "vue";
import accessTokenStore from "../store/accessTokenStore.js";

const mail = ref("admin@admin.fr");
const password = ref("adminadmin");

const router = useRouter();

function loginForm() {
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
    data: { email: mail.value, password: password.value },
  };

  axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        accessTokenStore.commit('updateAccessToken', response.data.access_token);
        router.push({ name: 'Home' });
      })
      .catch(function (error) {
        console.error(error);
      });
}
</script>

<template>
  <form ref="login" @submit.prevent="loginForm">
    <input type="email" v-model="mail" />
    <input type="password" v-model="password" />
    <button type="submit">Se connecter</button>
  </form>
</template>