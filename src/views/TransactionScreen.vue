<script setup>

import axios from 'axios';
import {useUserStore} from "../store/user.js";
import {useTransactionsStore} from "../store/transactions.js";
import { Preferences } from '@capacitor/preferences';
import {onBeforeMount} from "vue";

const userStore = useUserStore();
const transactionsStore = useTransactionsStore();

const accessToken = async () => {
  const { value } = await Preferences.get({ key: 'accessToken' })
  transaction(value)
}

accessToken();

  const transaction = (token) => {
    const options = {
      method: 'GET',
      url: 'https://api.bridgeapi.io/v2/transactions',
      params: {limit: 50},
      headers: {
        accept: 'application/json',
        'Client-Id': import.meta.env.VITE_CLIENT_ID,
        'Client-Secret': import.meta.env.VITE_CLIENT_SECRET,
        Authorization: `Bearer ${token}`,
        'Bridge-Version': '2021-06-01',
        'Accept-Language': 'FR',
      }
    };


    axios
        .request(options)
        .then(function (response) {
          response.data.resources.forEach((e) =>{
            getCategories(e.category_id,e);
          })
          // console.log(response.data.resources);
          setTimeout((function (){
            transactionsStore.setupTransactions(response.data.resources);
          }),100)
        })
        .catch(function (error) {
          console.error(error);
        });

  }

  function getCategories(idCateg,e){
    const options = {
      method: 'GET',
      url: 'https://api.bridgeapi.io/v2/categories/' + idCateg,
      headers: {
        accept: 'application/json',
        'Client-Id': import.meta.env.VITE_CLIENT_ID,
        'Client-Secret': import.meta.env.VITE_CLIENT_SECRET,
        'Accept-Language': 'fr',
        'Bridge-Version': '2021-06-01'
      }
    };

    axios
        .request(options)
        .then(function (response) {
          e.category = response.data.name;
        })
        .catch(function (error) {
          console.error(error);
        });
  }

</script>

<template>
  <h1>Transaction User</h1>
  <ul>
    {{transactionsStore.categories}}
    <li v-for="item in transactionsStore.transactions" :key="item.id">
      <router-link :to="`/transaction/${item.id}`">
        <p>amount : {{ item.amount }} {{ item.currency_code }} </p>
        <p>date : {{ item.date }}</p>
        <p>banque : {{ item.clean_description }}</p>
        <p v-if="item.category">categ : {{ item.category }} </p>
      </router-link>
    </li>
  </ul>
</template>