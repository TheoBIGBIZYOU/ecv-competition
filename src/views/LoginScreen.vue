<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useUserStore } from "../store/user";
import { Preferences } from "@capacitor/preferences";
import { CapacitorHttp } from "@capacitor/core";

const mail = ref("admin@admin.fr");
const password = ref("adminadmin");

const home = "http://localhost:5173/";

const userStore = useUserStore();

const router = useRouter();

const loginForm = async () => {
  const options = {
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

  const response = await CapacitorHttp.post(options);

  if (response.status === 200) {
    userStore.setupAccessToken(response.data.access_token);
    Preferences.set({
      key: "accessToken",
      value: response.data.access_token,
    });
    bridgeConnectCheck();
  } else {
    console.log("ERROR Request FAIL");
  }
};

const bridgeConnect = async () => {
  const options = {
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

  const response = await CapacitorHttp.post(options);

  if (response.status === 200) {
    window.location.href = response.data.redirect_url;
  } else {
    console.log("ERROR Request FAIL");
  }
};

const bridgeConnectCheck = async () => {
  const options = {
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

  const response = await CapacitorHttp.get(options);

  if (response.status === 200) {
    if (response.data.resources.length === 0) {
      bridgeConnect();
    } else {
      Preferences.set({
        key: "linkBank",
        value: true,
      });
      router.push({ name: "Home" });
    }
  } else {
    console.log("ERROR Request FAIL");
  }
};
</script>

<template>
  <form ref="login" @submit.prevent="loginForm" style="margin-top: 300px">
    <input type="email" v-model="mail" />
    <input type="password" v-model="password" />
    <button type="submit">Se connecter</button>
  </form>
</template>