<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const data = ref([]);

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  singleData(value);
};

accessToken();

const singleData = async (token) => {
  const options = {
    url: `https://api.bridgeapi.io/v2/transactions/${route.params.id}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Bridge-Version": "2021-06-01",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
    },
  };

  const response = await CapacitorHttp.get(options);

  if (response.status === 200) {
    data.value = response.data;
  } else {
    console.log("ERROR Request FAIL");
  }
};
</script>

<template>
  <h1>{{ data.bank_description }}</h1>
  <p>{{ data.clean_description }}</p>
  <p>{{ data.amount }}</p>
  <p>{{ data.date }}</p>
</template>