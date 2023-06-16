<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { useUserStore } from "../store/user.js";
import { useTransactionsStore } from "../store/transactions.js";
import { Preferences } from "@capacitor/preferences";
import {onBeforeMount, watch, ref, reactive, computed} from "vue";
import ReturnButton from "../components/ReturnButton.vue";
import router from "../router/index.js";



const userStore = useUserStore();
const transactionsStore = useTransactionsStore();

const state = reactive({
  depenses: computed(() => transactionsStore.transactions),
})
const search = ref("");
const totalEmissionValue = ref(0);
const depenses = ref(transactionsStore.transactions)
const selectedCategory = ref("")

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  transaction(value);
};

accessToken();

const transaction = async (token) => {
  const options = {
    url: "https://api.bridgeapi.io/v2/transactions",
    params: { limit: 50 },
    headers: {
      accept: "application/json",
      "Client-Id": import.meta.env.VITE_CLIENT_ID,
      "Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      Authorization: `Bearer ${token}`,
      "Bridge-Version": "2021-06-01",
      "Accept-Language": "FR",
    },
  };

  const response = await CapacitorHttp.get(options);

  if (response.status === 200) {
    response.data.resources.forEach((e) => {
      getCategories(e.category_id, e);
    });
    setTimeout(function () {
      transactionsStore.setupTransactions(response.data.resources);
      totalEmission();
    }, 100);
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

const goToSingleTransac = (id) => {
  // router.push({ name: "DefineGoal" })
  router.push(`/transaction/${id}`);
}

function totalEmission(){
  let total = 0;
  let tabEmission = document.querySelectorAll("#totalempreinteC");
  tabEmission.forEach((e,index) => {
    total += parseFloat(e.innerHTML);
  })
  totalEmissionValue.value = total.toFixed(1);
}

function toDepense(depense){
  return (depense.clean_description + " " + depense.category).toLowerCase()
}

function searchDepense(depenses, value){
  return depenses.filter(p => toDepense(p).includes(value.toLowerCase()));
}
watch(search, (newValue , oldValue)=>{
  state.depenses = computed(()=> searchDepense(transactionsStore.transactions,newValue));
  totalEmission();
})

watch(selectedCategory, (newValue , oldValue)=>{
  state.depenses = computed(()=> searchDepense(transactionsStore.transactions,newValue));
  totalEmission();
  openMenuSelect();
})

function openMenuSelect(){
  document.querySelector(".menu_select").classList.toggle("-open")
}

</script>

<template>
  <div class="transactions">
    <div class="menu_select">
      <h2>Selectionnez une catégorie</h2>
      <select v-model="selectedCategory">
        <option value="">Sélectionnez une catégorie</option>
        <option v-for="cat in transactionsStore.categories" :value="cat">{{cat}}</option>
      </select>
    </div>
    <div class="transactions_header">
      <ReturnButton label="Retour à la page d'accueil"/>
      <div class="transactions_header_title">
        <h1>Mes dépenses</h1>
      </div>
      <div class="transactions_header_search">
        <input v-model="search" class="transactions_header_search_filter_bar" type="text" placeholder="Rechercher une dépense">
        <div class="transactions_header_search_filter" @click="openMenuSelect()">
          <img src="../assets/img/bars-filter.svg" alt="">
        </div>
      </div>
    </div>
    <div class="transactions_list">
      <ul>
        <li class="transactions_list_item" v-for="item in state.depenses" :key="item.id" @click="goToSingleTransac(item.id)">
          <div class="transactions_list_item_left">
            <div class="transactions_list_item_left_image"></div>
            <div class="transactions_list_left_primaryInfo">
              <p class="banque">{{ item.clean_description }}</p>
              <p class="date">{{ item.date }}</p>
            </div>
          </div>
          <div class="transactions_list_item_right">
            <div class="transactions_list_right_secondaryInfo">
              <p class="amount">{{ item.amount }}€</p>
              <p class="empreinteC">= <span id="totalempreinteC">3.20</span> kg CO2</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="transactions_footer">
<!--      <div class="transactions_footer_month">-->
<!--        <p>Juin</p>-->
<!--      </div>-->
      <div class="transactions_footer_emission">
        <div class="transactions_footer_emission_total">
          <p><span class="totalEmission" id="totalEmission">{{totalEmissionValue}}</span>kg de CO2</p>
        </div>
        <div class="transactions_footer_emission_add">
          <div>
            <img src="../assets/img/add.svg" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.transactions{
  .menu_select{
    display: none;
    &.-open{
      position: fixed;
      border: 1px solid black;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 50%;
      height: 50%;
      background-color: white;
      display: block;
      select{
        height: 20%;
        background-color: grey;
      }
    }
  }
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
    &_search{
      display: flex;
      justify-content: space-between;
      &_filter{
        background-color: grey;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  &_list{
    padding-top: 10rem;
    ul{
      padding: 0;
    }
    &_item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      &_left{
        display: flex;
        gap: 1rem;
        align-items: center;
        p{
          &.banque{
            font-weight: 700;
          }
        }
        &_image{
          width: 35px;
          height: 35px;
          background-color: grey;
        }
      }
      &_right{
        text-align: right;
        p{
          &.amount{
            font-weight: 500;
          }
        }
      }
    }
  }
  &_footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 90%;
    padding: 0 5%;
    background-color: white;
    &_emission{
      border-top: 1px solid #D9D9D9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3% 0;
      &_total{
        .totalEmission{
          font-weight: 700;
        }
      }
      &_add{
        width: 70px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: grey;
      }
    }
  }
}
</style>