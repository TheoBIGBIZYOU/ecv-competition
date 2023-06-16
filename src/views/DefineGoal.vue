<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useTransactionsStore } from "../store/transactions.js";
import { Preferences } from "@capacitor/preferences";

const router = useRouter();
const goalNumber = ref(0);
const accessTokenKey = ref('');

const defineGoal = (token) => {
  Preferences.set({
    key: "goal",
    value: JSON.stringify({
      accessToken: token,
      number: goalNumber.value
    }),
  });
  router.push({ name: "Home" })
}

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
  defineGoal(value);
};

const getGoal = async () => {
  const value = await Preferences.get({ key: "goal" });
  const data = JSON.parse(value.value);
  goalNumber.value = data.number;
};

getGoal();

</script>

<template>
  <h1>CO2 Goal</h1>
  <form @submit.prevent="accessToken">
    <input type="number" id="goal" v-model="goalNumber" placeholder="0"/>
    <p>Je définis mon objectif à {{ goalNumber }} g CO2</p>
    <button type="submit">Valider mon objectif</button>
  </form>
</template>