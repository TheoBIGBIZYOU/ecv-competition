<script setup>



import {useRouter} from "vue-router";

const router = useRouter();

const continueBtn = () => {
  router.push({ name: "Home" });
}
</script>

<template>
  <div>
    <p>questionnaire</p>
  </div>
</template>

<style lang="scss">
</style>