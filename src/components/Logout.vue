<script setup>
import { Preferences } from "@capacitor/preferences";
import { getCurrentInstance } from 'vue';
import axios from "axios";

const props = defineProps({
  accesstoken: String,
});

const { emit } = getCurrentInstance();

const logout = () => {
  Preferences.remove({ key: "accessToken" });
  Preferences.remove({ key: "linkBank" });

  const options = {
    method: "POST",
    url: "https://api.bridgeapi.io/v2/logout",
    headers: {
      accept: "text/plain",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${props.accesstoken}`,
      "Bridge-Version": "2021-06-01",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      emit('update-access-token', null);
    })
    .catch(function (error) {
      console.error(error);
    });
};
</script>

<template>
  <button @click="logout">Logout</button>
</template>

<style>
</style>