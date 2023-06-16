<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { Preferences } from "@capacitor/preferences";
import Logout from "../components/Logout.vue";

import { ref, onMounted } from "vue";

const userStore = useUserStore();

const router = useRouter();
const accessTokenKey = ref("");
const getBankLink = ref(false);
const monthGoal = ref(false);
const goalNumber = ref(0);

const checkHomeAccess = (accessToken) => {
  accessToken == null ? router.push({ name: "Login" }) : "";
};

const getGoal = async (access) => {
  const value = await Preferences.get({ key: "goal" });
  const data = JSON.parse(value.value);
  goalNumber.value = data.number;

  console.log(data.accessToken);
  console.log(access);

  if (data.accessToken === access) {
    goalNumber.value = data.number;
  } else {
    Preferences.set({
      key: "goal",
      value: JSON.stringify({
        accessToken: null,
        number: 0,
      }),
    });
  }
};

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
  checkHomeAccess(value);
  getGoal(value);
};

const getCheckBank = async () => {
  const { value } = await Preferences.get({ key: "linkBank" });
  if (value) {
    getBankLink.value = true;
  }
};

getCheckBank();

const defineGoal = () => {
  router.push({ name: "DefineGoal" });
};

onMounted(() => {
  accessToken();
});
</script>

<template>
  <h1>Bienvenue</h1>
  <div class="header flex flex-center" v-if="!getBankLink">
    <div class="co2__counter flex flex-center">
      <span class="co2__counter-number" style>{{ goalNumber }}</span>
      <span class="co2__counter-txt">grammes(s)<br />de CO2</span>
    </div>
    <h2>liez votre compte à une banque</h2>
  </div>
  <div class="header" v-else>
    <div v-if="goalNumber === '0'" class="flex flex-center">
      <div class="co2__counter">
        <span class="co2__counter-number" style>0</span>
        <span class="co2__counter-txt">grammes(s)<br />de CO2</span>
      </div>
      <div class="define__goal" @click="defineGoal">
        Je définis mon objectif du mois
      </div>
    </div>
    <div v-else>
      Objectif : {{ goalNumber }}
      <div class="define__goal" @click="defineGoal">Modifier mon objectif</div>
    </div>
    <h2>Compte lié à une banque</h2>
  </div>
  <Logout
    @update-access-token="checkHomeAccess"
    :accesstoken="accessTokenKey"
  />
  <router-link to="/transaction">Transactions</router-link>
</template>
