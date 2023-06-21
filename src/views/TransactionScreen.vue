<script setup>
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
  newWeekTransactions: computed(() => state.weekTransactions),
  lastWeekTransactions: [],
  newLastWeekTransactions: computed(() => state.lastWeekTransactions),
  otherTransactions: [],
  newOtherTransactions: computed(() => state.otherTransactions),
})
const search = ref("");
const totalEmissionValue = ref(0);

const depenses = transactionsStore.transactions

totalEmissionValue.value = depenses.reduce((total, transaction) => total + transaction.impact, 0);



const selectedCategory = ref("")

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

filterTransaction(depenses)

const goToSingleTransac = (id) => {
  router.push(`/transaction/${id}`);
}

function totalEmission() {
  let total = 0;
  let tabEmission = document.querySelectorAll("#totalempreinteC");
  tabEmission.forEach((e,index) => {
    total += parseFloat(e.innerHTML);
  })
  totalEmissionValue.value = total;
}

function toDepense(depense){
  return (depense.clean_description + " " + depense.category).toLowerCase()
}

function searchDepense(depenses, value){
  return depenses.filter(p => toDepense(p).includes(value.toLowerCase()));
}

watch(search, (newValue , oldValue)=>{
  state.newWeekTransactions = computed(()=> searchDepense(state.weekTransactions,newValue));
  state.newLastWeekTransactions = computed(()=> searchDepense(state.lastWeekTransactions,newValue));
  state.newOtherTransactions = computed(()=> searchDepense(state.otherTransactions,newValue));
  totalEmission();
})

const selectedCategoryFunction = (e) => {
  state.newWeekTransactions = computed(()=> searchDepense(state.weekTransactions,e));
  state.newLastWeekTransactions = computed(()=> searchDepense(state.lastWeekTransactions,e));
  state.newOtherTransactions = computed(()=> searchDepense(state.otherTransactions,e));
  totalEmission();
  openMenuSelect();
}

function openMenuSelect(){
  document.querySelector(".menu_select").classList.toggle("-open")
}

function getFormattedDate(date){
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = new Intl.DateTimeFormat('fr', { month: 'long' }).format(dateObj);

  return `${day} ${month}`;
}

</script>

<template>
  <div class="transactions">
    <div class="menu_select">
      <div class="menu_select_content">
        <div class="menu_select_content_close" @click="openMenuSelect()">
          <p>Fermer la fenêtre</p>
          <img src="../assets/img/close.svg" alt="">
        </div>
        <div class="menu_select_content_title">
          <h2>Catégories</h2>
        </div>
        <div class="menu_select_content_list">
          <ul>
            <li v-for="(item,i) in transactionsStore.categories" :key="i" @click="selectedCategoryFunction(item)">
              <div class="menu_select_content_list_item" v-if="item">
                <div class="image">
                  <div class="bigCircle" :style="{ backgroundColor: item.color }"></div>
                  <div class="circleAround" :style="{border: '1px solid ' + item.color}"></div>
                </div>
                <p>{{ item.label }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="transactions_header">
      <ReturnButton returnBtn displayFlex label="Retour à la page d'accueil"/>
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
      <div class="transactions_list_items" v-if="state.newWeekTransactions.length !== 0">
        <h2>Cette semaine</h2>
        <ul>
          <li class="transactions_list_items_item" v-for="item in state.newWeekTransactions" :key="item.id" @click="goToSingleTransac(item.id)">
            <div class="transactions_list_items_item_left">
              <div class="transactions_list_items_item_left_image">
                <div class="bigCircle" :style="{ backgroundColor: item.category_color }"></div>
                <div class="circleAround" :style="{border: '1px solid ' + item.category_color}"></div>
              </div>
              <div class="transactions_list_items_left_primaryInfo">
                <p class="banque">{{ item.clean_description }}</p>
                <p class="date">{{ getFormattedDate(item.date) }}</p>
              </div>
            </div>
            <div class="transactions_list_items_item_right">
              <div class="transactions_list_items_right_secondaryInfo">
                <p class="amount">{{ item.amount }}€</p>
                <p class="empreinteC">= <span id="totalempreinteC">{{ item.impact }}</span> kg CO2</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="transactions_list_items" v-if="state.newLastWeekTransactions.length !== 0">
        <h2>La semaine dernière</h2>
        <ul>
          <li class="transactions_list_items_item" v-for="item in state.newLastWeekTransactions" :key="item.id" @click="goToSingleTransac(item.id)">
            <div class="transactions_list_items_item_left">
              <div class="transactions_list_items_item_left_image">
                <div class="bigCircle" :style="{ backgroundColor: item.category_color }"></div>
                <div class="circleAround" :style="{border: '1px solid ' + item.category_color}"></div>
              </div>
              <div class="transactions_list_items_left_primaryInfo">
                <p class="banque">{{ item.clean_description }}</p>
                <p class="date">{{ getFormattedDate(item.date) }}</p>
              </div>
            </div>
            <div class="transactions_list_items_item_right">
              <div class="transactions_list_items_right_secondaryInfo">
                <p class="amount">{{ item.amount }}€</p>
                <p class="empreinteC">= <span id="totalempreinteC">{{ item.impact }}</span> kg CO2</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="transactions_list_items" v-if="state.newOtherTransactions.length !== 0">
        <h2>Il y a trois semaine et plus</h2>
        <ul>
          <li class="transactions_list_items_item" v-for="item in state.newOtherTransactions" :key="item.id" @click="goToSingleTransac(item.id)">
            <div class="transactions_list_items_item_left">
              <div class="transactions_list_items_item_left_image">
                <div class="bigCircle" :style="{ backgroundColor: item.category_color }"></div>
                <div class="circleAround" :style="{border: '1px solid ' + item.category_color}"></div>
              </div>
              <div class="transactions_list_items_left_primaryInfo">
                <p class="banque">{{ item.clean_description }}</p>
                <p class="date">{{ getFormattedDate(item.date) }}</p>
                {{ item.category }}
              </div>
            </div>
            <div class="transactions_list_items_item_right">
              <div class="transactions_list_items_right_secondaryInfo">
                <p class="amount">{{ item.amount }}€</p>
                <p class="empreinteC">= <span id="totalempreinteC">{{ item.impact }}</span> kg CO2</p>
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
          <p><span class="totalEmission" id="totalEmission">{{ totalEmissionValue.toFixed(2) }}</span> kg de CO2</p>
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
  padding: 0 5%;
  .menu_select{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(25, 27, 31, .35);
    bottom: 0;
    left: 0;
    z-index: 3;
    transform: translateY(100%);
    animation: 1s all ease;
    .menu_select_content{
      overflow: scroll;
      padding: 30px;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 90%;
      background-color: white;
      box-shadow: 8px 0px 40px rgba(0, 0, 0, 0.05);
      border-radius: 10px 10px 0px 0px;
      &_title{
        h2{
          margin-bottom: 2rem;
        }
      }
      &_close{
        display: flex;
        justify-content: end;
        gap: 1rem;
        cursor: pointer;
      }
      &_list{
        ul{
          list-style-type: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .menu_select_content_list_item{
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 15px;
          background-color: #FFFFFF;
          box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          position: relative;
          p{
            font-weight: 600;
            text-transform: uppercase;
          }
          .image{
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
              //background-color: red;
            }
            .circleAround{
              position: absolute;
              width: 100%;
              height: 100%;
              background-color: transparent;
              //border: 1px solid red;
              border-radius: 100vmax;
            }
          }
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
    }
    &.-open{
      transform: translateY(0);
      animation: 1s all ease;
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
        padding-left: 40px;
        &::placeholder{
          font-weight: 400;
          font-size: 18px;
          color: #CBCBDD;
        }
      }
      &::after {
        content: "";
        width: 13px;
        height: 13px;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        background: url('data:image/svg+xml,<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_238_1170" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="14"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.333252 0.126068H13.3178V13.1107H0.333252V0.126068Z" fill="white"/></mask><g mask="url(%23mask0_238_1170)"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.82584 1.12606C3.79717 1.12606 1.33317 3.58939 1.33317 6.61806C1.33317 9.64672 3.79717 12.1107 6.82584 12.1107C9.85384 12.1107 12.3178 9.64672 12.3178 6.61806C12.3178 3.58939 9.85384 1.12606 6.82584 1.12606M6.82567 13.1107C3.24567 13.1107 0.333008 10.1981 0.333008 6.61807C0.333008 3.03807 3.24567 0.126068 6.82567 0.126068C10.4057 0.126068 13.3177 3.03807 13.3177 6.61807C13.3177 10.1981 10.4057 13.1107 6.82567 13.1107" fill="%23191B1F"/></g><mask id="mask1_238_1170" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="10" width="4" height="4"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.4934 10.5974H13.8428V13.9405H10.4934V10.5974Z" fill="white"/></mask><g mask="url(%23mask1_238_1170)"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.3429 13.9405C13.2156 13.9405 13.0876 13.8919 12.9896 13.7945L10.6402 11.4519C10.4449 11.2565 10.4442 10.9399 10.6396 10.7445C10.8342 10.5479 11.1509 10.5492 11.3469 10.7432L13.6962 13.0865C13.8916 13.2819 13.8922 13.5979 13.6969 13.7932C13.5996 13.8919 13.4709 13.9405 13.3429 13.9405Z" fill="%23191B1F"/></g></svg>');
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
    padding-top: 250px;
    padding-bottom: 80px;
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
              //background-color: red;
            }
            .circleAround{
              position: absolute;
              width: 100%;
              height: 100%;
              background-color: transparent;
              //border: 1px solid red;
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
      padding: 16px 0;
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