<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { Preferences } from '@capacitor/preferences';
import Logout from '../components/Logout.vue';

import { ref, onMounted } from "vue";

const userStore = useUserStore();

const router = useRouter();
const accessTokenKey = ref('');
const getBankLink = ref(false);

const checkHomeAccess = (accessToken) => {
  accessToken == null ? router.push({ name: "Login" }) : '';
}

const accessToken = async () => {
  const { value } = await Preferences.get({ key: 'accessToken' })
  accessTokenKey.value = value;
  checkHomeAccess(value);
}

const getCheckBank = async () => {
  const { value } = await Preferences.get({ key: "linkBank" });
  if(value) {
    getBankLink.value = true;
  }
};

getCheckBank();

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
  <Logout @update-access-token="checkHomeAccess" :accesstoken="accessTokenKey" />
  <router-link to="/transaction">Transactions</router-link>
</template>
