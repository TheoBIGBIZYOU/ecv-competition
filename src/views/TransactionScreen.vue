<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { useUserStore } from "../store/user.js";
import { useTransactionsStore } from "../store/transactions.js";
import { Preferences } from "@capacitor/preferences";
import { onBeforeMount } from "vue";

const userStore = useUserStore();
const transactionsStore = useTransactionsStore();

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  transaction(value);
};

accessToken();

const transaction = async (token) => {
  const options = {
    url: "https://api.bridgeapi.io/v2/transactions",
    params: { limit: 50 },
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${token}`,
      "Bridge-Version": "2021-06-01",
      "Accept-Language": "FR",
    },
  };

  const response = await CapacitorHttp.get(options);

  if (response.status === 200) {
    response.data.resources.forEach((e) => {
      getCategories(e.category_id, e);
    });
    setTimeout(function () {
      transactionsStore.setupTransactions(response.data.resources);
    }, 100);
  } else {
    console.log("ERROR Request FAIL");
  }
};

const getCategories = async (idCateg, e) => {
  const options = {
    url: "https://api.bridgeapi.io/v2/categories/" + idCateg,
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Accept-Language": "fr",
      "Bridge-Version": "2021-06-01",
    },
  };

  const response = await CapacitorHttp.get(options);

  if (response.status === 200) {
    e.category = response.data.name;
  } else {
    console.log("ERROR Request FAIL");
  }
};
</script>

<template>
  <h1>Transaction User</h1>
  <ul>
    {{
      transactionsStore.categories
    }}
    <li v-for="item in transactionsStore.transactions" :key="item.id">
      <router-link :to="`/transaction/${item.id}`">
        <p>amount : {{ item.amount }} {{ item.currency_code }}</p>
        <p>date : {{ item.date }}</p>
        <p>banque : {{ item.clean_description }}</p>
        <p v-if="item.category">categ : {{ item.category }}</p>
      </router-link>
    </li>
  </ul>
</template>