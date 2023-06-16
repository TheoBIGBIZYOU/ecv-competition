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
const totalEmission = ref(128.8);
const purcentGoal = ref(0);

const checkHomeAccess = (accessToken) => {
  accessToken == null ? router.push({ name: "Login" }) : "";
};

const getGoal = async () => {
  const value = await Preferences.get({ key: "goal" });
  goalNumber.value = value.value;
  purcentGoal.value = (totalEmission.value / goalNumber.value) * 100;
};

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
  checkHomeAccess(value);
  getGoal();
};

const getCheckBank = async () => {
  const { value } = await Preferences.get({ key: "linkBank" });
  if (value) {
    getBankLink.value = true;
  }
  console.log(value);
  console.log(getBankLink.value);
};

getCheckBank();

const defineGoal = () => {
  router.push({ name: "DefineGoal" });
};

accessToken();

function goToTransaction() {
  router.push({ name: "Transaction" });
}

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
      <h2>Mon objectif du mois : {{ goalNumber }}g CO2</h2>
      <div class="progressBar">
        <div class="progressBar__progress" :style="{width: purcentGoal.toFixed(2) + '%'}">{{ totalEmission }}kg CO2</div>
      </div>
      <div class="define__goal" @click="defineGoal">Modifier mon objectif</div>
    </div>
    <h2>Les émissions de CO2 de vos dépenses du mois</h2>
    <p>{{ totalEmission }}kg CO2</p>
  </div>
  <Logout
    @update-access-token="checkHomeAccess"
    :accesstoken="accessTokenKey"
  />
  <p @click="goToTransaction()">transaction</p>
</template>


<style scoped>
  .progressBar {
    background-color: #D9D9D9;
  }
  .progressBar__progress {
    background-color: #505050;
    padding: 5px 10px;
    text-align: right;
    color: #fff;
    max-width: 100%;
  }
</style>