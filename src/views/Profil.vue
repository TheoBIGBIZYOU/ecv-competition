<script setup>
import Logout from "../components/Logout.vue";
import { Preferences } from "@capacitor/preferences";
import { ref } from "vue";


const accessTokenKey = ref('');
const name = ref('');

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
};

const userName = async () => {
  const { value } = await Preferences.get({ key: "userName" });
  console.log(value)
};

accessToken();
userName();
</script>

<template>
    <Logout :accesstoken="accessTokenKey"/>
</template>
