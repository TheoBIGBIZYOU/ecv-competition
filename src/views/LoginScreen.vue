<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useUserStore } from "../store/user";
import { Preferences } from "@capacitor/preferences";
import { CapacitorHttp } from "@capacitor/core";
import Stories from "../components/Stories.vue";
import ReturnButton from "../components/ReturnButton.vue";

const mail = ref("admin@admin.fr");
const password = ref("adminadmin");

const home = "http://localhost:5173/home";

const userStore = useUserStore();

const router = useRouter();

const showPassword = ref(false);

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
      router.push({ name: "Home" });
    }
  } else {
    console.log("ERROR Request FAIL");
  }
};

const noAccount = () => {
  router.push({ name: "Register" });
};
</script>

<template>
  <Stories />
  <div class="loginForm">
    <ReturnButton label="Connexion" />
    <div class="form">
      <form ref="login" @submit.prevent="loginForm">
        <div class="form_top">
          <div class="form_field">
            <label for="email">Email</label>
            <input name="email" type="email" v-model="mail" />
          </div>
          <div class="form_field">
            <label for="password">Mot de passe</label>
            <div class="passwordInput">
              <input
                name="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
              />
              <button class="showPassword" @click.prevent="showPassword = !showPassword">
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 4.48022C6.4467 4.48022 5.1875 5.73942 5.1875 7.29272C5.1875 8.84603 6.4467 10.1052 8 10.1052C9.5533 10.1052 10.8125 8.84603 10.8125 7.29272C10.8125 5.73942 9.5533 4.48022 8 4.48022ZM6.3125 7.29272C6.3125 6.36074 7.06802 5.60522 8 5.60522C8.93198 5.60522 9.6875 6.36074 9.6875 7.29272C9.6875 8.2247 8.93198 8.98022 8 8.98022C7.06802 8.98022 6.3125 8.2247 6.3125 7.29272Z"
                    fill="#191B1F"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 0.730225C6.39429 0.730225 4.94244 1.52447 3.7638 2.48951C2.57873 3.45982 1.60971 4.65171 0.958562 5.55874L0.90486 5.63342C0.512864 6.1781 0.190186 6.62647 0.190186 7.29272C0.190186 7.95898 0.512864 8.40735 0.90486 8.95203L0.958563 9.02671C1.60971 9.93374 2.57873 11.1256 3.7638 12.0959C4.94244 13.061 6.39429 13.8552 8 13.8552C9.60572 13.8552 11.0576 13.061 12.2362 12.0959C13.4213 11.1256 14.3903 9.93374 15.0414 9.02671L15.0951 8.95204C15.4871 8.40735 15.8098 7.95898 15.8098 7.29272C15.8098 6.62647 15.4871 6.1781 15.0951 5.63342L15.0414 5.55873C14.3903 4.65171 13.4213 3.45982 12.2362 2.48951C11.0576 1.52447 9.60572 0.730225 8 0.730225ZM1.87245 6.21481C2.4944 5.34846 3.39761 4.24333 4.4765 3.35996C5.56183 2.47132 6.76568 1.85522 8 1.85522C9.23433 1.85522 10.4382 2.47132 11.5235 3.35996C12.6024 4.24333 13.5056 5.34846 14.1276 6.21481C14.5955 6.86668 14.6848 7.02383 14.6848 7.29272C14.6848 7.56162 14.5955 7.71877 14.1276 8.37064C13.5056 9.23699 12.6024 10.3421 11.5235 11.2255C10.4382 12.1141 9.23433 12.7302 8 12.7302C6.76568 12.7302 5.56183 12.1141 4.4765 11.2255C3.39761 10.3421 2.4944 9.23699 1.87245 8.37064C1.40448 7.71877 1.31519 7.56162 1.31519 7.29272C1.31519 7.02383 1.40448 6.86668 1.87245 6.21481Z"
                    fill="#191B1F"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="form_field">
          <button type="submit">Se connecter</button>
        </div>
      </form>
      <div class="noAccount" @click="noAccount()">
        Je n’ai pas de compte, je m’inscris
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.loginForm {
  max-height: 100vh;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  &_title {
    h1 {
      font-weight: 700;
    }
  }
  form {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 60vh;
    .form_top {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .form_field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label {
        font-weight: 600;
        font-size: 12px;
      }
      .passwordInput {
        position: relative;
        button {
          background: unset;
          border: 0px;
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
        }
      }
      input {
        background: #ffffff;
        box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
        border: none;
        border-radius: 8px;
        height: 50px;
        width: 100%;
        padding: 16px;
      }
      button[type="submit"] {
        display: block;
        margin-inline: auto;
        width: 100%;
        padding: 18px 0;
        border-radius: 8px;
        color: #fff;
        background-color: var(--blue);
        border: 0px;
      }
    }
  }
  .noAccount {
    margin: 32px 0 66px;
    text-align: center;
    font-weight: 700;
    text-decoration: underline;
  }
}
</style>