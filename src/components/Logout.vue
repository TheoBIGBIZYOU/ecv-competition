<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { getCurrentInstance } from "vue";

const props = defineProps({
  accesstoken: String,
});

const { emit } = getCurrentInstance();

const logout = async () => {
  Preferences.remove({ key: "accessToken" });
  Preferences.remove({ key: "linkBank" });

  const options = {
    url: "https://api.bridgeapi.io/v2/logout",
    headers: {
      accept: "text/plain",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${props.accesstoken}`,
      "Bridge-Version": "2021-06-01",
    },
  };

  const response = await CapacitorHttp.post(options);

  if (response.status === 200) {
    emit("update-access-token", null);
  } else {
    console.log("ERROR Request FAIL");
  }
};
</script>

<template>
  <button @click="logout">Logout</button>
</template>

<style>
</style>