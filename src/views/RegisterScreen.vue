<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";

import { ref } from "vue";

const userStore = useUserStore();

const mail = ref("");
const password = ref("");

const router = useRouter();

const registerForm = async () => {
  const options = {
    url: "https://api.bridgeapi.io/v2/users",
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
    authUser(response.data.email, password.value);
  } else {
    console.log("ERROR Request FAIL");
  }
};

const authUser = async (mail, password) => {
  const options = {
    url: "https://api.bridgeapi.io/v2/authenticate",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Bridge-Version": "2021-06-01",
      "content-type": "application/json",
    },
    data: { email: mail, password: password },
  };

  const response = await CapacitorHttp.post(options);

  if (response.status === 200) {
    userStore.setupAccessToken(response.data.access_token);
    router.push({ name: "Home" });
  } else {
    console.log("ERROR Request FAIL");
  }
};

const alreadyAccount = () => {
  router.push({ name: "Login" });
}

</script>

<template>
  <div class="registerForm">
    <div class="registerForm_title">
      <h1>S'inscrire</h1>
    </div>
    <div class="form">
      <form ref="register" @submit.prevent="registerForm">
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
          <button type="submit">Suivant</button>
        </div>
      </form>
      <div class="alreadyAccount" @click="alreadyAccount()">J’ai déjà un compte, je me connecte</div>
    </div>
  </div>
</template>

<style lang="scss">
.registerForm{
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
        width: 100%;
        background: #FFFFFF;
        box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
        border: none;
        border-radius: 8px;
        height: 50px;
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
  .alreadyAccount{
    margin-top: 1rem;
    text-align: center;
    font-weight: 700;
    text-decoration: underline;
  }
}

</style>