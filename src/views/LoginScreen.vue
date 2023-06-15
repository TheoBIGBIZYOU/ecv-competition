<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { ref } from "vue";
import { useUserStore } from "../store/user";
import { Preferences } from "@capacitor/preferences";
import { CapacitorHttp } from "@capacitor/core";

const mail = ref("admin@admin.fr");
const password = ref("adminadmin");

const home = "http://localhost:5173/";

const userStore = useUserStore();

const router = useRouter();

const loginForm = () => {
  // const options = {
  //   method: "POST",
  //   headers: {
  //     accept: "application/json",
  //     "Client-Id": import.meta.env.VITE_CLIENT_ID,
  //     "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
  //     "Bridge-Version": "2021-06-01",
  //     "content-type": "application/json",
  //   },
  //   data: { email: mail.value, password: password.value },
  // };

  //   fetch('https://api.bridgeapi.io/v2/authenticate', options)
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Request failed");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     userStore.setupAccessToken(data.access_token);
  //     Preferences.set({
  //       key: "accessToken",
  //       value: data.access_token,
  //     });
  //     bridgeConnectCheck();
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Bridge-Version": "2021-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ email: mail.value, password: password.value }),
  };

  fetch("https://api.bridgeapi.io/v2/authenticate", options)
    .then((response) => response.json())
    .then((data) => {
      userStore.setupAccessToken(data.access_token);
      Preferences.set({
        key: "accessToken",
        value: data.access_token,
      });
      bridgeConnectCheck();
      router.push({ name: "Home" });
    })
    .catch((err) => console.error(err));
};

function bridgeConnect() {
  const options = {
    method: "POST",
    url: "https://api.bridgeapi.io/v2/connect/items/add",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${userStore.accessToken}`,
      "Bridge-Version": "2021-06-01",
      "content-type": "application/json",
    },
    data: { prefill_email: mail.value, redirect_url: home },
  };

  axios
    .request(options)
    .then(function (response) {
      window.location.href = response.data.redirect_url;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function bridgeConnectCheck() {
  const options = {
    method: "GET",
    url: "https://api.bridgeapi.io/v2/items",
    params: { limit: "50" },
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${userStore.accessToken}`,
      "Bridge-Version": "2021-06-01",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      if (response.data.resources.length === 0) {
        bridgeConnect();
      } else {
        Preferences.set({
          key: "linkBank",
          value: true,
        });
        router.push({ name: "Home" });
      }
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