<script setup>
import {useRouter} from "vue-router";
import ReturnButton from "../components/ReturnButton.vue";
import {computed, reactive, ref} from "vue";
import { useTransactionsStore } from "../store/transactions.js";

const router = useRouter();
const transactionsStore = useTransactionsStore();
const ongletActive = ref(true);

const state = reactive({
  transactions: computed(() => transactionsStore.partenairesTransactions),
})
console.log(state.transactions);
console.log(transactionsStore.partenairesTransactions);
</script>

<template>
  <div class="historique">
    <ReturnButton returnBtn displayFlex label="Retour aux récompenses"/>
    <div class="historique_title">
      <h1>Mon historique</h1>
    </div>
    <div class="historique_main">
      <div class="historique_main_header">
        <div class="historique_main_header_content">
          <div class="historique_main_header_content_indiv" @click="ongletActive = true">
            <p :class="ongletActive ? '-active' : null">Ma cagnotte</p>
          </div>
          <div class="historique_main_header_content_indiv" @click="ongletActive = false">
            <p :class="!ongletActive ? '-active' : null">Mes trophées</p>
          </div>
        </div>
      </div>
      <div class="historique_main_listTransac">
        <ul>
          {{state.transactions}}
          <li class="historique_main_listTransac_item" v-for="item in state.transactions">
            <p>test</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.historique{
  padding: 0 5%;
  &_title{
    font-size: 20px;
    font-weight: 600;
  }
  &_main{
    margin-top: 25px;
    &_header{
      &_content{
        display: flex;
        border-bottom: 1px solid #CBCBDD;
        &_indiv{
          flex: 0 0 50%;
          text-align: center;
          p{
            font-size: 16px;
            color: #52526B;
            font-weight: 600;
            padding: 20px 0;
            &.-active{
              color: #3B63DB;
              border-bottom: 4px solid #3B63DB;
              padding: 20px 0;
            }
          }
        }
      }
    }
  }
}
</style>