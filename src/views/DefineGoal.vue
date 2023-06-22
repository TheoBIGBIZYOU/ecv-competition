<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useTransactionsStore } from "../store/transactions.js";
import { Preferences } from "@capacitor/preferences";

const router = useRouter();
const goalNumber = ref(0);
const accessTokenKey = ref("");

const defineGoal = (token) => {
  Preferences.set({
    key: "goal",
    value: goalNumber.value,
  });
  router.push({ name: "Home" });
};

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
  defineGoal(value);
};

const getGoal = async () => {
  const value = await Preferences.get({ key: "goal" });
  goalNumber.value = value.value;
};

getGoal();
</script>

<template>
  <div class="defineGoal">
    <span>Objectif</span>
    <h1>Quel objectif mensuel voulez-vous définir ?</h1>
    <form @submit.prevent="accessToken">
      <div class="input">
        <input type="number" id="goal" v-model="goalNumber" required min="1" />
      </div>
      <button type="submit">Valider mon objectif</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.defineGoal {
  padding: 30px 24px;
  box-sizing: border-box;
  min-height: calc(100vh - 100px);
  overflow: hidden;

  h1 {
    font-size: 24px;
    line-height: 26.5px;
    margin: 16px 0 32px;
  }
  span {
    font-size: 14px;
    text-transform: uppercase;
    color: #52526b;
    font-weight: 600;
  }
  form {
    .input {
      position: relative;
      border-bottom: 1px solid #52526b;
      margin-bottom: 50px;

      &::after {
        content: "Kg CO2";
        position: absolute;
        top: 0;
        right: 0;
        font-weight: 600;
      }
      input {
        width: 100%;
        border: 0px;
        background-color: transparent;
        padding: 0 0 4px;
        font-size: 20px;
      }
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type="number"] {
        -moz-appearance: textfield;
      }
    }
    button {
      background-color: var(--blue);
      color: #fff;
    }
  }
}
</style>