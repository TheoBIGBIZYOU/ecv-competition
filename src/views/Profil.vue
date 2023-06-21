<script setup>
import Logout from "../components/Logout.vue";
import { Preferences } from "@capacitor/preferences";
import { ref } from "vue";


const accessTokenKey = ref('');

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
};

accessToken();
</script>

<template>
    <Logout :accesstoken="accessTokenKey"/>
</template>
