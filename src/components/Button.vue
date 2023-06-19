<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  label: String,
  url: String,
  textAlign: String,
  noArrow: String
});

const goTo = (href) => {
  console.log(href);
  router.push({name : href})
}
</script>

<template>
    <button v-if="noArrow === 'true'" class="buttonClass" :class="textAlign" @click="goTo(url)">{{ label }}</button>
    <button v-else class="buttonClass arrow" :class="textAlign" @click="goTo(url)">{{ label }}</button>
</template>

<style lang="scss">
.buttonClass {
  all: unset;
  padding-top: 16px;
  border-top: 1px solid #eff5ff;
  //width: 100%;
  width: -webkit-fill-available;
  position: relative;
  background-color: white;
  color: black;
  box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  &.left{
    text-align: left;
  }
  &.arrow{
    &::after {
      content: "";
      width: 6px;
      height: 11px;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      background: url('data:image/svg+xml,<svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.66821 5.29272L0.275681 8.68525C-0.0918939 9.05282 -0.0918939 9.64947 0.275681 10.017C0.643257 10.3846 1.2399 10.3846 1.60748 10.017L5.70408 5.92044C6.05123 5.57329 6.05123 5.01127 5.70408 4.665L1.60748 0.568406C1.2399 0.20083 0.643256 0.20083 0.275681 0.568406C-0.0918942 0.935981 -0.0918942 1.53262 0.275681 1.9002L3.66821 5.29272Z" fill="%23C2C3CA"/></svg>');
    }
  }
}
</style>