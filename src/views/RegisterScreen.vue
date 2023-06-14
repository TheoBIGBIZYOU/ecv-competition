<script setup>
import axios from "axios";
import { useRouter } from "vue-router";

import { ref } from "vue";

const mail = ref("");
const password = ref("");

const router = useRouter();

const registerForm = () => {
  console.log(router)
  router.push('/homepage');
  // const options = {
  //   method: "POST",
  //   url: "https://api.bridgeapi.io/v2/users",
  //   headers: {
  //     accept: "application/json",
  //     "Client-Id": import.meta.env.VITE_CLIENT_ID,
  //     "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
  //     "Bridge-Version": "2021-06-01",
  //     "content-type": "application/json",
  //   },
  //   data: { email: mail.value, password: password.value },
  // };

  // axios
  //   .request(options)
  //   .then(function (response) {
  //     console.log(response.data);
  //     // const router = useRouter();
  //     // router.push({ name: 'Home' });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
}
</script>

<template>
  <form ref="register" @submit.prevent="registerForm">
    <input type="email" v-model="mail" />
    <input type="password" v-model="password" />
    <button type="submit">S'enregistrer</button>
  </form>
</template>