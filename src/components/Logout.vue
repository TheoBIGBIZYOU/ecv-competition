<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { useRouter } from "vue-router";
import { Preferences } from "@capacitor/preferences";
import { getCurrentInstance } from "vue";

const props = defineProps({
  accesstoken: String,
});

const router = useRouter();

const { emit } = getCurrentInstance();

const logout = async () => {
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

  if (response.status === 200 || response.status === 201 || response.status === 202) {
    Preferences.remove({ key: "accessToken" });
    Preferences.remove({ key: "linkBank" });
    Preferences.remove({ key: "storyAlreadySee" });
    Preferences.remove({key: "accessToken" });
    Preferences.remove({key: "firstName" });
    Preferences.set({
      key: "goal",
      value: 0
    });
    emit("update-access-token", null);
    router.push({name : "Login"})
  } else {
    console.log("ERROR Request FAIL");
  }
};
</script>

<template>
  <button @click="logout">Se déconnecter</button>
</template>

<style>
</style>