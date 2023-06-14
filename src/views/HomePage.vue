<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "../store/user";
import { Preferences } from '@capacitor/preferences';

import { ref, onMounted } from "vue";

const userStore = useUserStore();

const router = useRouter();

const getAccessToken = ref(false);
const getBankLink = ref(false);

const checkHomeAccess = (accessToken) => {
  accessToken == null ? router.push({ name: "Login" }) : getAccessToken.value = true;
}

const accessToken = async () => {
  const { value } = await Preferences.get({ key: 'accessToken' })
  checkHomeAccess(value);
}

const getCheckBank = async () => {
  const { value } = await Preferences.get({ key: "linkBank" });
  if(value) {
    getBankLink.value = true;
  }
};

getCheckBank();

const logout = () => {
  Preferences.remove({ key: 'accessToken' });
  Preferences.remove({ key: 'linkBank' });
  getAccessToken.value = false;
  checkHomeAccess(null);
}

onMounted(() => {
  accessToken()
})
</script>

<template>
  <h1>hello world</h1>
  <div v-if="getBankLink">
    <h2>Compte lié à une banque</h2>
  </div>
  <div v-else>
    <h2>Connectez votre compte à votre banque.</h2>
  </div>
  <button @click="logout">Logout</button>
</template>
