<script setup>

import axios from 'axios';
import {useUserStore} from "../store/user.js";
import {useTransactionsStore} from "../store/transactions.js";
import {onBeforeMount} from "vue";

const userStore = useUserStore();
const transactionsStore = useTransactionsStore();

onBeforeMount(() => {
  function transation (){
    const options = {
      method: 'GET',
      url: 'https://api.bridgeapi.io/v2/transactions',
      params: {limit: 50},
      headers: {
        accept: 'application/json',
        'Client-Id': import.meta.env.VITE_CLIENT_ID,
        'Client-Secret': import.meta.env.VITE_CLIENT_SECRET,
        Authorization: `Bearer ${userStore.accessToken}`,
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
            transactionsStore.setupTransations(response.data.resources);
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

  transation();
});

</script>

<template>
  <h1>Transaction User</h1>
  <ul>
    {{transactionsStore.categories}}
    <li v-for="item in transactionsStore.transactions" :key="item.id">
      <p>amount : {{ item.amount }} {{ item.currency_code }} </p>
      <p>date : {{ item.date }}</p>
      <p>banque : {{ item.clean_description }}</p>
      <p v-if="item.category">categ : {{ item.category }} </p>
    </li>
  </ul>
</template>