<script setup>
import {useRouter} from "vue-router";
import ReturnButton from "../components/ReturnButton.vue";
import {computed, reactive, ref} from "vue";
import { useTransactionsStore } from "../store/transactions.js";
import impact from "../assets/json/impacts.json"

const router = useRouter();
const transactionsStore = useTransactionsStore();
const ongletActive = ref(true);

const state = reactive({
  transactions: computed(() => transactionsStore.partenairesTransactions),
})


function getFormattedDate(date){
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = new Intl.DateTimeFormat('fr', { month: 'long' }).format(dateObj);

  return `${day} ${month}`;
}

const trophees = [
  {
    title: "Petite pousse",
    subtitle: 'Gagné le 04/03/2023',
    etat: 'Défi 30/30',
    complete: '100%',
    img: 'trophee1.svg'
  },
  {
    title: "Petite bambou",
    subtitle: 'Gagné le 12/05/2023',
    etat: 'Défi 30/30',
    complete: '100%',
    img: 'trophee2.svg'
  },
  {
    title: "Trophée 3",
    subtitle: 'En cours',
    etat: 'Défi 3/30',
    complete: '10%',
    img: 'trophee3.svg'
  },
  {
    title: "Trophée 4",
    subtitle: 'Non disponible',
    etat: 'Défi 0/30',
    complete: '0%',
    img: 'trophee4.svg'
  },
  {
    title: "Trophée 5",
    subtitle: 'Non disponible',
    etat: 'Défi 0/30',
    complete: '0%',
    img: 'trophee4.svg'
  },
  {
    title: "Trophée 6",
    subtitle: 'Non disponible',
    etat: 'Défi 0/30',
    complete: '0%',
    img: 'trophee4.svg'
  },
];

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
          <div class="historique_main_header_content_bar" :class="ongletActive === true ? 'Ongletleft' : 'Ongletright'"></div>
        </div>
      </div>
      <div class="historique_main_listTransac" v-if="ongletActive">
        <ul>
          <li class="historique_main_listTransac_item" v-for="(item,index) in state.transactions" :key="index">
            <div class="historique_main_listTransac_points">
              <p>+ {{item.points}} point(s)</p>
            </div>
            <div class="historique_main_listTransac_item_content">
              <div class="historique_main_listTransac_item_content_left">
                <div class="historique_main_listTransac_item_content_left_image">
                  <div class="bigCircle" :style="{ backgroundColor: item.transaction.category_color }"></div>
                  <div class="circleAround" :style="{border: '1px solid ' + item.transaction.category_color}"></div>
                </div>
                <div class="historique_main_listTransac_item_content_left_primaryInfo">
                  <p class="banque">{{ item.transaction.clean_description }}</p>
                  <p class="date">{{ getFormattedDate(item.transaction.date) }}</p>
                </div>
              </div>
              <div class="historique_main_listTransac_item_content_right">
                <div class="historique_main_listTransac_item_content_right_secondaryInfo">
                  <p class="amount">{{ item.transaction.amount }}€</p>
                  <p class="empreinteC">= <span id="totalempreinteC">{{ item.transaction.impact }}</span> kg CO2</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="historique_main_listTrophees" v-else>
        <ul>
          <li v-for="item in trophees" class="historique_main_listTrophees_item">
            <div class="historique_main_listTrophees_item_trophee">
              <img :src="`/src/assets/img/recompenses/trophee/` + item.img" alt="">
            </div>
            <div class="historique_main_listTrophees_item_description">
              <p class="title">{{item.title}}</p>
              <p class="subtitle">{{item.subtitle}}</p>
              <p class="etat">{{item.etat}}</p>
              <div v-if="item.complete === '100%'">
                <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="12.75" cy="12.8354" rx="12" ry="12.25" fill="#3B63DB"/>
                  <path d="M16.7402 9.76804C16.6103 9.772 16.487 9.82742 16.3964 9.92256L11.2499 15.1763L9.60344 13.4955C9.55736 13.4465 9.50218 13.4074 9.44111 13.3804C9.38005 13.3535 9.31433 13.3393 9.24781 13.3386C9.18129 13.3379 9.11531 13.3508 9.05372 13.3764C8.99213 13.4021 8.93618 13.44 8.88914 13.4881C8.8421 13.5361 8.80492 13.5932 8.77977 13.6561C8.75463 13.7189 8.74202 13.7863 8.7427 13.8542C8.74338 13.9221 8.75732 13.9892 8.78371 14.0515C8.81011 14.1139 8.84842 14.1702 8.8964 14.2172L10.8964 16.2589C10.9902 16.3546 11.1173 16.4083 11.2499 16.4083C11.3825 16.4083 11.5097 16.3546 11.6034 16.2589L17.1034 10.6443C17.1757 10.5726 17.225 10.4803 17.245 10.3795C17.265 10.2787 17.2547 10.1741 17.2154 10.0793C17.1761 9.98461 17.1097 9.90421 17.0249 9.84866C16.9401 9.79311 16.8409 9.76501 16.7402 9.76804Z" fill="white"/>
                </svg>
              </div>
              <div v-else class="historique_main_listTrophees_item_description_jauge">
                <div class="historique_main_listTrophees_item_description_jauge_progress" :style="`width:` + item.complete"></div>
              </div>
            </div>
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
    position: relative;
    &_header{
      position: sticky;
      width: 100%;
      background-color: white;
      top: 0;
      z-index: 2;
      &_content{
        display: flex;
        border-bottom: 1px solid #CBCBDD;
        position: relative;
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
              padding: 20px 0;
            }
          }
        }
        &_bar{
          position: absolute;
          bottom: -2px;
          width: 50%;
          background-color: #3B63DB;
          height: 4px;
          transition: .3s all ease;
          &.Ongletleft{
            transform: translateX(0%);
          }
          &.Ongletright{
            transform: translateX(100%);
          }
        }
      }
    }
    &_listTransac{
      padding-top: 15px;
      &_points{
        background: #EFF5FF;
        border-radius: 4px;
        width: fit-content;
        padding: 4px 8px;
        margin-bottom: 15px;
      }
      ul{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        list-style-type: none;
      }
      &_item{
        &_content {
          display: flex;
          align-items: center;
          justify-content: space-between;

          &_left {
            display: flex;
            gap: 1rem;
            align-items: center;

            p {
              &.banque {
                font-weight: 600;
                font-size: 16px;
              }

              &.date {
                font-size: 14px;
              }
            }

            &_image {
              width: 35px;
              height: 35px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;

              .bigCircle {
                width: 30px;
                height: 30px;
                border-radius: 100vmax;
                //background-color: red;
              }

              .circleAround {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: transparent;
                //border: 1px solid red;
                border-radius: 100vmax;
              }
            }
          }

          &_right {
            text-align: right;

            p {
              &.amount {
                font-weight: 600;
              }
            }
          }
        }
      }
    }
    &_listTrophees{
      ul{
        list-style-type: none;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 40px;
        grid-row-gap: 0px;
        .historique_main_listTrophees_item{
          text-align: center;
          padding: 40px 0;
          &_description{
            display: flex;
            flex-direction: column;
            gap: .2rem;
            .title{
              font-weight: 600;
              font-size: 16px;
            }
            .subtitle{
              font-size: 12px;
              font-weight: 400;
            }
            .etat{
              color: #52526B;
              font-size: 12px;
              font-width: 600;
            }

            &_jauge{
              width: 35%;
              margin: 0 auto;
              height: 8px;
              background-color: #CBCBDD;
              border-radius: 32px;
              &_progress{
                background-color: #3B63DB;
                border-radius: 32px;
                padding: 4px 0px;
                text-align: right;
                color: #fff;
                max-width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>