<script setup>
import Logout from "../components/Logout.vue";
import { useRouter } from "vue-router";
import { Preferences } from "@capacitor/preferences";
import { ref } from "vue";

const router = useRouter();

const accessTokenKey = ref("");
const firstName = ref("");
const editUserInfo = ref(false);
const userMail = ref("");
const uuid = ref("");
const showCurrentPassword = ref(false);
const showPassword = ref(false);
const currentPassword = ref("");
const currentPasswordInput = ref("");
const newPassword = ref("");
const newFirstName = ref("");
const errorPass = ref(false);

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
};

const getUserName = async () => {
  const { value } = await Preferences.get({ key: "userName" });
  firstName.value = value;

  firstName.value === null ? (firstName.value = "John Doe") : "";
};

const getUserUuid = async () => {
  const { value } = await Preferences.get({ key: "uuid" });
  uuid.value = value
  getUserInfos(uuid.value);
};

const getUserInfos = (uuidVal) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Bridge-Version": "2021-06-01",
    },
  };

  fetch(`https://api.bridgeapi.io/v2/users/${uuidVal}`, options)
    .then((response) => response.json())
    .then((response) => (userMail.value = response.email))
    .catch((err) => console.error(err));
};

const getUserPassword = async () => {
  const { value } = await Preferences.get({ key: "password" });
  currentPassword.value = value;
};

const changePassword = (current, newPass) => {
  const options = {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Bridge-Version": "2021-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({new_password: newPass, current_password: current})
  };

  fetch(`https://api.bridgeapi.io/v2/users/${uuid.value}/password`, options)
    .then((response) => response.json())
    .then((response) => {
      Preferences.set({
        key: "password",
        value: newPass,
      });
      Preferences.remove({ key: "accessToken" });
      Preferences.remove({ key: "linkBank" });
      Preferences.remove({ key: "storyAlreadySee" });
      Preferences.remove({key: "accessToken" });
      Preferences.remove({key: "userName" });
      Preferences.remove({key: "uuid"});
      Preferences.set({
        key: "goal",
        value: 0
      });
      router.push({name : "Login"})
    })
    .catch((err) => console.error(err));
};

const editUser = () => {
  if (newFirstName.value !== "") {
    Preferences.set({
      key: "userName",
      value: newFirstName.value,
    });
    firstName.value = newFirstName.value;
    editUserInfo.value = false;
  }

  if (newPassword.value !== "") {
    if (currentPassword.value === currentPasswordInput.value) {
      changePassword(currentPassword.value, newPassword.value);
    } else {
      errorPass.value = true;
    }
  }
};

getUserName();
getUserUuid();
getUserPassword();

accessToken();
</script>

<template>
  <div class="profil">
    <div class="userInfos">
      <h1>Profil</h1>
      <div class="userInfos__header">
        <div class="user_image">
          <img src="../assets/img/user_avatar.png" alt="" />
        </div>
        <div
          class="userInfos__header-content"
          @click="editUserInfo = !editUserInfo"
        >
          <p class="firstname">{{ firstName }}</p>
          <span>Editer le profil</span>
        </div>
      </div>
    </div>
    <div class="profil__banks">
      <div class="profil__banks-item">
        <div class="profil__banks-item-card">
          <img src="../assets/img/demo-bank.png" />
          <div class="profil__banks-item-card-content">
            <p class="name">Demo bank</p>
            <p class="status">Connectée</p>
          </div>
        </div>
        <button class="addNewBank" disabled>
          <span>Ajouter un compte bancaire</span>
        </button>
      </div>
    </div>
    <div class="profil__links">
      <Logout :accesstoken="accessTokenKey" />
      <button class="deleteAccount">Supprimer mon compte</button>
    </div>
    <div :class="editUserInfo ? 'userInfosEdit modalFromBottom active' : 'userInfosEdit modalFromBottom'">
      <div class="userInfosEdit__header">
        <span @click="editUserInfo = !editUserInfo"
          ><svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.60229 13.1367C7.41029 13.1367 7.21829 13.0637 7.07229 12.9167C6.77929 12.6237 6.77929 12.1497 7.07229 11.8567L11.8643 7.06469C12.1573 6.77169 12.6313 6.77169 12.9243 7.06469C13.2173 7.35769 13.2173 7.83169 12.9243 8.12469L8.13229 12.9167C7.98629 13.0637 7.79429 13.1367 7.60229 13.1367Z"
              fill="#191B1F"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.3963 13.1396C12.2043 13.1396 12.0123 13.0666 11.8663 12.9196L7.07034 8.12261C6.77734 7.82961 6.77734 7.35562 7.07034 7.06261C7.36434 6.76961 7.83834 6.76961 8.13034 7.06261L12.9263 11.8596C13.2193 12.1526 13.2193 12.6266 12.9263 12.9196C12.7803 13.0666 12.5873 13.1396 12.3963 13.1396Z"
              fill="#191B1F"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.665 1.5C3.135 1.5 1.5 3.233 1.5 5.916V14.084C1.5 16.767 3.135 18.5 5.665 18.5H14.333C16.864 18.5 18.5 16.767 18.5 14.084V5.916C18.5 3.233 16.864 1.5 14.334 1.5H5.665ZM14.333 20H5.665C2.276 20 0 17.622 0 14.084V5.916C0 2.378 2.276 0 5.665 0H14.334C17.723 0 20 2.378 20 5.916V14.084C20 17.622 17.723 20 14.333 20Z"
              fill="#191B1F"
            />
          </svg>
        </span>
      </div>
      <div class="userInfosEdit__content">
        <div class="user_image">
          <img src="../assets/img/user_avatar.png" alt="" />
        </div>

        <h2>Votre profil</h2>
        <p>
          Les informations que vous transmettrez seront utilisées sur Colibri
          pour calculer votre empreinte carbone et ainsi mieux vous conseiller.
        </p>
        <form @submit.prevent="editUser">
          <div class="form_field">
            <label for="name">Prénom</label>
            <input name="name" type="text" :placeholder="firstName" v-model="newFirstName"/>
          </div>
          <div class="form_field">
            <label for="email">Email</label>
            <input name="email" type="email" :value="userMail" disabled />
          </div>
          <div class="form_field">
            <label for="password">Mot de passe</label>
            <div class="passwordInput">
              <input
                name="password"
                :type="showCurrentPassword ? 'text' : 'password'"
                v-model="currentPasswordInput"
                :class="errorPass ? 'error' : ''"
              />
              <button
                class="showPassword"
                @click.prevent="showCurrentPassword = !showCurrentPassword"
              >
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
          <div class="form_field">
            <label for="password">Nouveau mot de passe</label>
            <div class="passwordInput">
              <input
                name="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="newPassword"
              />
              <button
                class="showPassword"
                @click.prevent="showPassword = !showPassword"
              >
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
          <button>Terminé</button>
        </form>
      </div>
    </div>
    <div class="modalOverlay"></div>
  </div>
</template>

<style lang="scss" scoped>
.profil {
  min-height: calc(100vh - 100px);
  .userInfos {
    background-color: #fff;
    padding: 24px;

    h1 {
      font-size: 20px;
      margin-bottom: 18px;
    }

    &__header {
      display: flex;
      align-items: center;
      gap: 18px;

      &-content {
        flex-grow: 1;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          right: 0;
          height: 10px;
          width: 6px;
          transform: translateY(-50%);
          background: url('data:image/svg+xml,<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.66821 5L0.275681 8.39252C-0.0918939 8.7601 -0.0918939 9.35674 0.275681 9.72432C0.643257 10.0919 1.2399 10.0919 1.60748 9.72432L5.70408 5.62772C6.05123 5.28056 6.05123 4.71855 5.70408 4.37228L1.60748 0.275681C1.2399 -0.0918942 0.643256 -0.0918942 0.275681 0.275681C-0.0918942 0.643256 -0.0918942 1.2399 0.275681 1.60748L3.66821 5Z" fill="%23C2C3CA"/></svg>');
        }

        .firstname {
          font-weight: 600;
          font-size: 14px;
        }

        span {
          font-weight: 400;
          font-size: 12px;
          color: #52526b;
        }
      }
    }
  }

  &__banks {
    margin: 24px;
    padding: 16px 24px;
    background-color: #fff;
    border-radius: 8px;

    &-item {
      &-card {
        display: flex;
        gap: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eff5ff;

        &-content {
          .name {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .status {
            font-size: 12px;
            color: #2dbc5d;
          }
        }

        img {
          width: 38px;
          height: 38px;
        }
      }
      .addNewBank {
        margin-top: 16px;
        background-color: #3b63db;
        color: #fff;
        font-size: 14px;
        line-height: 16px;
        padding: 8px !important;

        &:disabled {
          opacity: 0.5;
        }

        span {
          display: block;
          margin-inline: auto;
          max-width: 150px;
        }
      }
    }
  }

  &__links {
    padding: 24px;
    button {
      display: block;
      &.logoutBtn {
        margin-bottom: 30px;
      }
      &.deleteAccount {
        background: unset;
        border: 0px;
        text-decoration: underline;
        font-weight: 600;
      }
    }
  }

  .userInfosEdit {
    top: 60px;
    overflow-y: auto;
    height: calc(100vh - 60px);

    &__header {
      width: 100%;
      padding-bottom: 14px;
      border-bottom: 1px solid #cbcbdd;
      background-color: #fff;
      margin-right: 24px;
      z-index: 99;

      span {
        display: block;
        width: 20px;
        height: 20px;
        margin: 0 24px 0 auto;
      }
    }

    &__content {
      padding: 0 24px;
      .user_image {
        margin: 30px auto 40px;
        width: 130px;
        height: 130px;

        &::before {
          width: calc(100% + 13px);
          height: calc(100% + 13px);
          left: calc(50% - 1.4px);
        }
      }
      h2 {
        font-size: 20px;
        line-height: 24px;
        margin-bottom: 8px;
      }
      p {
        font-size: 18px;
        line-height: 21px;
        color: #52526b;
        margin-bottom: 16px;
      }
      .form_field {
        margin-bottom: 16px;

        input.error {
          border: 1px solid #e95f6a;
        }
      }
      button:not(.showPassword) {
        margin-top: 32px;
        background-color: #3b63db;
        color: #fff;
      }
    }
  }
}
</style>