<script setup>

import axios from 'axios';
import {useUserStore} from "../store/user.js";
import {ref} from "vue";

const userStore = useUserStore();

let transactions = [];

const options = {
  method: 'GET',
  url: 'https://api.bridgeapi.io/v2/transactions',
  params: {limit: 10},
  headers: {
    accept: 'application/json',
    'Client-Id': import.meta.env.VITE_CLIENT_ID,
    'Client-Secret': import.meta.env.VITE_CLIENT_SECRET,
    Authorization: `Bearer ${userStore.accessToken}`,
    'Bridge-Version': '2021-06-01'
  }
};


axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      transactions = response.data.resources
      console.log(transactions);
    })
    .catch(function (error) {
      console.error(error);
    });


</script>

<template>
  <h1>Transaction User</h1>
  <ul>
    <li v-for="item in transactions">
      <p>id : {{ item.id }}</p>
      <p>amount : {{ item.amount }} {{ item.currency_code }} </p>
      <p>date : {{ item.date }}</p>
      <p>banque : {{ item.clean_description }}</p>
    </li>
  </ul>
</template>