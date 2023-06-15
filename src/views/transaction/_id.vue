<script setup>
import axios from "axios";
import { Preferences } from '@capacitor/preferences';
import { useRoute } from "vue-router";
import { ref } from "vue";


const route = useRoute();

const data = ref([]);

const accessToken = async () => {
  const { value } = await Preferences.get({ key: 'accessToken' })
  singleData(value)
}

accessToken();

const singleData = (token) => {
    // console.log($route.params.id)
    const options = {
  method: 'GET',
  url: `https://api.bridgeapi.io/v2/transactions/${route.params.id}`,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Bridge-Version': '2021-06-01',
    'Client-Id': import.meta.env.VITE_CLIENT_ID,
    'Client-Secret': import.meta.env.VITE_CLIENT_SECRET,
  }
};

axios
  .request(options)
  .then(function (response) {
    data.value = response.data;
    console.log(data.value);
  })
  .catch(function (error) {
    console.error(error);
  });
};
</script>

<template>
  <h1>{{data.bank_description}}</h1>
  <p>{{ data.clean_description }}</p>
  <p>{{ data.amount }}</p>
  <p>{{ data.date }}</p>
</template>