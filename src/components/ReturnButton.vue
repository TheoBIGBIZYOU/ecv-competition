<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  label: String,
  returnBtn: Boolean
});

const href = () => {
  router.go(-1);
};
</script>

<template>
  <div class="returnButton">
    <div v-if="returnBtn" class="returnButton_img" @click="href">
      <svg
        width="17"
        height="15"
        viewBox="0 0 17 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 7.56699C17 7.94668 16.7178 8.26048 16.3518 8.31014L16.25 8.31699L1.25 8.31699C0.835787 8.31699 0.5 7.9812 0.5 7.56699C0.5 7.18729 0.782154 6.8735 1.14823 6.82383L1.25 6.81699L16.25 6.81699C16.6642 6.81699 17 7.15277 17 7.56699Z"
          fill="#191B1F"
        />
        <path
          d="M7.82899 13.0599C8.12251 13.3522 8.12353 13.8271 7.83127 14.1206C7.56558 14.3874 7.14897 14.4125 6.85489 14.1953L6.77061 14.1229L0.720614 8.09886C0.452977 7.83237 0.42863 7.41426 0.647584 7.12019L0.72057 7.03596L6.77057 1.01096C7.06407 0.718676 7.53894 0.719659 7.83123 1.01316C8.09694 1.27998 8.12029 1.69669 7.90182 1.98985L7.82903 2.07382L2.313 7.56769L7.82899 13.0599Z"
          fill="#191B1F"
        />
      </svg>
    </div>
    <h1 v-if="label">{{ label }}</h1>
  </div>
</template>

<style lang="scss" scoped>
.returnButton {
  margin-top: 77px;
  &_img {
    display: block;
    margin-bottom: 30px;
    img {
      height: 20px;
      object-fit: cover;
      width: 100%;
    }
  }
  h1 {
    font-size: 24px;
    font-weight: 700;
  }
}
</style>