<script setup>
import Logout from "../components/Logout.vue";
import { Preferences } from "@capacitor/preferences";
import { ref } from "vue";


const accessTokenKey = ref('');
const firstName = ref('');

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
};

const getUserName = async () => {
  const { value } = await Preferences.get({ key: "userName" });
  firstName.value = value;
  
  firstName.value === null ? firstName.value = "John Doe" : ''
};

getUserName();

accessToken();
</script>

<template>
  <div class="userInfos">
    <h1>Profil</h1>
    <div class="userInfos__photo">
      <img src="../assets/img/coco_little.png" alt="" />
    </div>
    <div class="userInfos__content">
      <p class="firstname">{{ firstName }}</p>
      <span>Editer le profil</span>
    </div>
  </div>
  <Logout :accesstoken="accessTokenKey"/>
</template>

<style lang="scss" scoped>
  .userInfos {
    background-color: #fff;
    padding: 24px;
  }
</style>