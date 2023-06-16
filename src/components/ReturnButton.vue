<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

  defineProps({
    label: String
  })

const href = () => {
  router.go(-1)
}
</script>

<template>
  <div class="returnButton" @click="href">
    <div class="returnButton_img">
      <img src="../assets/img/arrow.svg" alt="">
    </div>
    <div class="returnButton_label">
      <p>{{ label }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.returnButton{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  &_img{
    img{
      height: 20px;
      object-fit: cover;
      width: 100%;
    }
  }
  &_label{
    p{
      font-size: 12px;
    }
  }
}
</style>