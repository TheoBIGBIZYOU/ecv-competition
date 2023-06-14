<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { ref } from "vue";
import { useUserStore } from "../store/user";

const mail = ref("admin@admin.fr");
const password = ref("adminadmin");

const userStore = useUserStore();

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
    .then((response) => {
      userStore.setupAccessToken(response.data.access_token);
      console.log(response.data);
      bridgeConnectCheck();
    })
    .catch((error) => {
      console.error(error);
    });
}

function bridgeConnect(){
  const options = {
    method: 'POST',
    url: 'https://api.bridgeapi.io/v2/connect/items/add',
    headers: {
      accept: 'application/json',
      'Client-Id': import.meta.env.VITE_CLIENT_ID,
      'Client-Secret': import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${userStore.accessToken}`,
      'Bridge-Version': '2021-06-01',
      'content-type': 'application/json'
    },
    data: {prefill_email: mail.value, redirect_url: 'http://localhost:5173/'}
  };

  axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        window.location.href = response.data.redirect_url
      })
      .catch(function (error) {
        console.error(error);
      });
}

function bridgeConnectCheck(){

  const options = {
    method: 'GET',
    url: 'https://api.bridgeapi.io/v2/items',
    params: {limit: '50'},
    headers: {
      accept: 'application/json',
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${userStore.accessToken}`,
      'Bridge-Version': '2021-06-01'
    }
  };

  axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if(response.data.resources.length === 0) bridgeConnect();
        else router.push({ name: "Home" });
      })
      .catch(function (error) {
        console.error(error);
      });
}
</script>

<template>
  <form ref="login" @submit.prevent="loginForm" style="margin-top: 300px">
    <input type="email" v-model="mail" />
    <input type="password" v-model="password" />
    <button type="submit">Se connecter</button>
  </form>
</template>