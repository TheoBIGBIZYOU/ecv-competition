<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useUserStore } from "../store/user";
import { Preferences } from "@capacitor/preferences";
import { CapacitorHttp } from "@capacitor/core";
import Stories from "../components/Stories.vue";

const mail = ref("admin@admin.fr");
const password = ref("adminadmin");

const home = "http://localhost:5173/";

const userStore = useUserStore();

const router = useRouter();

const loginForm = async () => {
  const options = {
    url: "https://api.bridgeapi.io/v2/authenticate",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Bridge-Version": "2021-06-01",
      "content-type": "application/json",
    },
    data: { email: mail.value, password: password.value },
  };

  const response = await CapacitorHttp.post(options);

  if (response.status === 200) {
    userStore.setupAccessToken(response.data.access_token);
    Preferences.set({
      key: "accessToken",
      value: response.data.access_token,
    });
    bridgeConnectCheck();
  } else {
    console.log("ERROR Request FAIL");
  }
};

const bridgeConnect = async () => {
  const options = {
    url: "https://api.bridgeapi.io/v2/connect/items/add",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${userStore.accessToken}`,
      "Bridge-Version": "2021-06-01",
      "content-type": "application/json",
    },
    data: { prefill_email: mail.value, redirect_url: home },
  };

  const response = await CapacitorHttp.post(options);

  if (response.status === 200) {
    window.location.href = response.data.redirect_url;
  } else {
    console.log("ERROR Request FAIL");
  }
};

const bridgeConnectCheck = async () => {
  const options = {
    url: "https://api.bridgeapi.io/v2/items",
    params: { limit: "50" },
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${userStore.accessToken}`,
      "Bridge-Version": "2021-06-01",
    },
  };

  const response = await CapacitorHttp.get(options);

  if (response.status === 200) {
    if (response.data.resources.length === 0) {
      bridgeConnect();
    } else {
      await Preferences.set({
        key: "linkBank",
        value: true,
      });
      console.log("test");
      router.push({ name: "Home" });
    }
  } else {
    console.log("ERROR Request FAIL");
  }
};

const noAccount = () => {
  router.push({ name: "Register" });
}
</script>

<template>
  <Stories />
  <div class="loginForm">
    <div class="loginForm_title">
      <h1>Connexion</h1>
    </div>
    <div class="form">
      <form ref="login" @submit.prevent="loginForm">
        <div class="form_top">
          <div class="form_field">
            <label for="email">Email</label>
            <input name="email" type="email" v-model="mail" />
          </div>
          <div class="form_field">
            <label for="password">Mot de passe</label>
            <span class="passwordInput">
              <input name="password" type="password" v-model="password" />
            </span>
          </div>
        </div>
        <div class="form_field">
          <button type="submit">Se connecter</button>
        </div>
      </form>
      <div class="noAccount" @click="noAccount()">Je n’ai pas de compte, je m’inscris</div>
    </div>
  </div>
</template>

<style lang="scss">
.loginForm{
  width: 90%;
  margin: 0 auto;
  height: 95vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &_title{
    margin-top: 10rem;
    h1{
      font-weight: 700;
    }
  }
  form{
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 60vh;
    .form_top{
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .form_field{
      display: flex;
      flex-direction: column;
      gap: 1rem;
      label{
        font-weight: 700;
      }
      .passwordInput{
        position: relative;
        &:after{
          content: url('../assets/img/eyes.svg');
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
        }
      }
      input{
        background: #FFFFFF;
        box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
        border: none;
        border-radius: 8px;
        height: 50px;
        width: 100%;
      }
      button{
        display: block;
        margin-inline: auto;
        margin-top: 10px;
        width: 100%;
        padding: 18px 0;
        border-radius: 8px;
        color: #fff;
        background-color: var(--blue);
        border: 0px;
      }
    }
  }
  .noAccount{
    margin-top: 1rem;
    text-align: center;
    font-weight: 700;
    text-decoration: underline;
  }
}
</style>