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
  weekTransactions: [],
  lastWeekTransactions: [],
  otherTransactions: []
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
    params: { limit: '50' },
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
      filterTransaction(response.data.resources);
    }, 100);
  } else {
    console.log("ERROR Request FAIL");
  }
};

const filterTransaction = (depenses) => {
  //week number of today
  //week number of depense date
  let currentDate = new Date();
  let date2 = new Date(currentDate.getFullYear(), 0, 1);
  let days = Math.floor((currentDate - date2) / (24 * 60 * 60 * 1000));
  let currentWeekNumber = Math.ceil(days / 7);

  depenses.forEach((e)=>{
    //week number of depense date
    let date = new Date(e.date);
    let date2 = new Date(date.getFullYear(), 0, 1);
    let days = Math.floor((date - date2) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil(days / 7);
    if( currentWeekNumber === weekNumber){
      state.weekTransactions.push(e);
    }
    else if( currentWeekNumber - weekNumber === 1){
      state.lastWeekTransactions.push(e);
    }
    else{
      state.otherTransactions.push(e);
    }
  })
}

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

const listTransactions = [
  {
    title: "Cette semaine",
    arrayTransaction: state.weekTransactions,
  },
  {
    title: "La semaine dernière",
    arrayTransaction: state.lastWeekTransactions,
  },
  {
    title: "Il y a trois semaine et plus",
    arrayTransaction: state.otherTransactions,
  },
];

</script>

<template>
  <div class="transactions">
    <div class="menu_select">
      <h2>Selectionnez une catégorie</h2>
      <select v-model="selectedCategory">
        <option value="">Sélectionnez une catégorie</option>
        <option v-for="(cat, i) in transactionsStore.categories" :value="cat" :key="i">{{cat}}</option>
      </select>
    </div>
    <div class="transactions_header">
      <ReturnButton returnBtn=true displayFlex="true" label="Retour à la page d'accueil"/>
      <div class="transactions_header_title">
        <h1>Mes dépenses</h1>
      </div>
      <div class="transactions_header_search">
        <input v-model="search" class="transactions_header_search_filter_bar" type="text" placeholder="Rechercher une dépense">
        <div class="transactions_header_search_filter" @click="openMenuSelect()">
          <img src="../assets/img/filter.svg" alt="">
        </div>
      </div>
    </div>
    <div class="transactions_list">
      <div class="transactions_list_items" v-for="list in listTransactions">
        <h2>{{list.title}}</h2>
        <ul>
          <li class="transactions_list_items_item" v-for="item in list.arrayTransaction" :key="item.id" @click="goToSingleTransac(item.id)">
            <div class="transactions_list_items_item_left">
              <div class="transactions_list_items_item_left_image">
                <div class="bigCircle"></div>
                <div class="circleAround"></div>
              </div>
              <div class="transactions_list_items_left_primaryInfo">
                <p class="banque">{{ item.clean_description }}</p>
                <p class="date">{{ item.date }}</p>
              </div>
            </div>
            <div class="transactions_list_items_item_right">
              <div class="transactions_list_items_right_secondaryInfo">
                <p class="amount">{{ item.amount }}€</p>
                <p class="empreinteC">= <span id="totalempreinteC">3.20</span> kg CO2</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="transactions_footer">
<!--      <div class="transactions_footer_month">-->
<!--        <p>Juin</p>-->
<!--      </div>-->
      <div class="transactions_footer_emission">
        <div class="transactions_footer_emission_total">
          <p><span class="totalEmission" id="totalEmission">{{totalEmissionValue}}</span> kg de CO2</p>
        </div>
        <div class="transactions_footer_emission_add">
          <div>
            <img src="../assets/img/add.svg" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
  <Menu />
</template>

<style lang="scss">
.transactions{
  padding: 0 5%;
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
    width: 100%;
    padding: 0 5% 30px;
    z-index: 2;
    overflow: hidden;
    background-color: white;
    box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
    &_title{
      h1{
        font-weight: 600;
        font-size: 20px;
      }
      margin-bottom: 15px;
    }
    &_search{
      display: flex;
      justify-content: space-between;
      position: relative;
      input{
        background: #FFFFFF;
        box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        border: none;
        width: 80%;
        position: relative;
        padding-left: 50px;
        &::placeholder{
          font-weight: 400;
          font-size: 18px;
          color: #CBCBDD;
        }
      }
      &::after {
        content: "";
        width: 30px;
        height: 30px;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background: url("../assets/img/search.svg");
        //background: url('data:image/svg+xml,<svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.66821 5.29272L0.275681 8.68525C-0.0918939 9.05282 -0.0918939 9.64947 0.275681 10.017C0.643257 10.3846 1.2399 10.3846 1.60748 10.017L5.70408 5.92044C6.05123 5.57329 6.05123 5.01127 5.70408 4.665L1.60748 0.568406C1.2399 0.20083 0.643256 0.20083 0.275681 0.568406C-0.0918942 0.935981 -0.0918942 1.53262 0.275681 1.9002L3.66821 5.29272Z" fill="%23C2C3CA"/></svg>');
      }
      &_filter{
        background: #FFFFFF;
        box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  &_list{
    padding-top: 19rem;
    ul{
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    &_items{
      margin-bottom: 2rem;
      h2{
        margin-bottom: 20px;
        font-weight: 600;
        font-size: 16px;
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
              font-weight: 600;
              font-size: 16px;
            }
            &.date{
              font-size: 14px;
            }
          }
          &_image{
            width: 35px;
            height: 35px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            .bigCircle{
              width: 30px;
              height: 30px;
              border-radius: 100vmax;
              background-color: red;
            }
            .circleAround{
              position: absolute;
              width: 100%;
              height: 100%;
              background-color: transparent;
              border: 1px solid red;
              border-radius: 100vmax;
            }
          }
        }
        &_right{
          text-align: right;
          p{
            &.amount{
              font-weight: 600;
            }
          }
        }
      }
    }
  }
  &_footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
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
          font-size: 32px;
        }
      }
      &_add{
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--blue);
        border-radius: 10px;
      }
    }
  }
}
</style>