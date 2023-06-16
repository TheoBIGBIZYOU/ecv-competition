<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { useRoute } from "vue-router";
import { ref } from "vue";
import ReturnButton from "../../components/ReturnButton.vue";

const route = useRoute();

const data = ref([]);

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  singleData(value);
};

accessToken();

const singleData = async (token) => {
  const options = {
    url: `https://api.bridgeapi.io/v2/transactions/${route.params.id}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Bridge-Version": "2021-06-01",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
    },
  };

  const response = await CapacitorHttp.get(options);

  if (response.status === 200) {
    data.value = response.data;
    getCategories(data.value.category_id, data.value);
  } else {
    console.log("ERROR Request FAIL");
  }
};

const getCategories = async (idCateg, e) => {
  const options = {
    url: "https://api.bridgeapi.io/v2/categories/" + idCateg,
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      "Accept-Language": "fr",
      "Bridge-Version": "2021-06-01",
    },
  };

  const response = await CapacitorHttp.get(options);

  if (response.status === 200) {
    e.category = response.data.name;
  } else {
    console.log("ERROR Request FAIL");
  }
};

</script>

<template>
  <div class="transaction_single">
    <div class="transactions_single_header">
      <ReturnButton label="Retour à toutes mes dépenses"/>
      <div class="transactions_single_header_title">
        <h1>{{ data.bank_description }}</h1>
      </div>
      <div class="transactions_single_header_date">
        <p>{{ data.date }}</p>
      </div>
    </div>
    <div class="transactions_single_main">
      <ul class="transactions_single_main_list">
        <li class="transactions_single_main_list_item">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/car.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>{{data.category}}</p>
          </div>
        </li>
        <li class="transactions_single_main_list_item">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/car.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>{{data.amount}}€</p>
          </div>
        </li>
        <li class="transactions_single_main_list_item">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/car.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>{{data.date}}</p>
          </div>
        </li>
        <li class="transactions_single_main_list_item">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/car.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>0.2g de CO2</p>
          </div>
        </li>
      </ul>
      <div class="transactions_single_main_alternatives">
        <h2 class="title">Alternatives</h2>
        <p class="description">At vero eos et accusamus et iusto odio dignissimos</p>
        <ul class="transactions_single_main_alternatives_list">
          <li class="transactions_single_main_alternatives_list_item"></li>
          <li class="transactions_single_main_alternatives_list_item"></li>
          <li class="transactions_single_main_alternatives_list_item"></li>
          <li class="transactions_single_main_alternatives_list_item"></li>
          <li class="transactions_single_main_alternatives_list_item"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.transactions_single{
  &_header{
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 1px solid #D9D9D9;
    width: 90%;
    padding: 0 5% 1rem;
    z-index: 2;
    overflow: hidden;
    background-color: white;
  }
  &_main{
    padding-top: 13rem;
    &_list{
      list-style-type: none;
      padding: 0;
      &_item{
        display: flex;
        align-items: center;
        gap: 1rem;
        &_image{
          width: 40px;
          height: 40px;
          background-color: grey;
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: 60%;
          }
        }
      }
    }
    &_alternatives{
      &_list{
        display: flex;
        flex-direction: row;
        overflow: scroll;
        gap: 1rem;
        list-style-type: none;
        padding: 0;
        &_item{
          background-color: grey;
          flex: 0 0 35%;
          height: 100px;
        }
      }
    }
  }
}
</style>