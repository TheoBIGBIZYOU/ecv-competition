<script setup>
import Logout from "../components/Logout.vue";
import { Preferences } from "@capacitor/preferences";
import { ref } from "vue";

const accessTokenKey = ref("");
const firstName = ref("");

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
};

const getUserName = async () => {
  const { value } = await Preferences.get({ key: "userName" });
  firstName.value = value;

  firstName.value === null ? (firstName.value = "John Doe") : "";
};

const editUser = () => {};

getUserName();

accessToken();
</script>

<template>
  <div class="profil">
    <div class="userInfos">
      <h1>Profil</h1>
      <div class="userInfos__header">
        <div class="user_image">
          <img src="../assets/img/coco_little.png" alt="" />
        </div>
        <div class="userInfos__header-content" @click="editUser">
          <p class="firstname">{{ firstName }}</p>
          <span>Editer le profil</span>
        </div>
      </div>
    </div>
    <div class="profil__banks">
      <div class="profil__banks-item">
        <div class="profil__banks-item-card">
          <img src="../assets/img/demo-bank.png">
          <div class="profil__banks-item-card-content">
            <p class="name">Demo bank</p>
            <p class="status">Connectée</p>
          </div>
        </div>
        <button class="addNewBank" disabled><span>Ajouter un compte bancaire</span></button>
      </div>
    </div>
    <div class="profil__links">
      <Logout :accesstoken="accessTokenKey" />
      <button class="deleteAccount">Supprimer mon compte</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profil {
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

    &-item {
      &-card {
        display: flex;
        gap: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #EFF5FF;

        &-content {
          .name {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .status {
            font-size: 12px;
            color: #2DBC5D;
          }
        }

        img {
          width: 38px;
          height: 38px;
        }
      }
      .addNewBank {
        margin-top: 16px;
        background-color: #3B63DB;
        color: #fff;
        font-size: 14px;
        line-height: 16px;

        &:disabled {
          opacity: .5;
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
}
</style>