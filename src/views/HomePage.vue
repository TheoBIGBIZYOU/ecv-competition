<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { Preferences } from "@capacitor/preferences";
import Logout from "../components/Logout.vue";
import Menu from "../components/Menu.vue";

import { ref, onMounted } from "vue";

const userStore = useUserStore();

const router = useRouter();
const accessTokenKey = ref("");
const getBankLink = ref(false);
const monthGoal = ref(false);
const goalNumber = ref(0);
const totalEmission = ref(128.8);
const purcentGoal = ref(0);

const checkHomeAccess = (accessToken) => {
  accessToken == null ? router.push({ name: "Login" }) : "";
};

const getGoal = async () => {
  const value = await Preferences.get({ key: "goal" });
  goalNumber.value = value.value;
  purcentGoal.value = (totalEmission.value / goalNumber.value) * 100;
};

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
  checkHomeAccess(value);
  getGoal();
};

const getCheckBank = async () => {
  const { value } = await Preferences.get({ key: "linkBank" });
  if (value) {
    getBankLink.value = true;
  }
  console.log(value);
  console.log(getBankLink.value);
};

getCheckBank();

const defineGoal = () => {
  router.push({ name: "DefineGoal" });
};

accessToken();

function goToTransaction() {
  router.push({ name: "Transaction" });
}


const buttons = [
  {
    title: "Répondre au questionnaire",
    subtitle: "8 minutes",
    image: "questionnaire.svg",
  },
  {
    title: "Lier mon compte à mes dépenses",
    subtitle: "",
    image: "link_account.svg",
  }
];

const tips = [
  {
    title: "Pti'tips",
    subtitle: "Connaître son empreinte carbone permet de mieux comprendre son impact personnel sur la planète. Faisons ce premier pas ensemble.",
    buttonLabel: "Voir tous les tips",
    url: "",
    backgroundColor: 'green',
    infosupp: '',
  },
  {
    title: "Pti'tips",
    subtitle: "Connaître son empreinte carbone permet de mieux comprendre son impact personnel sur la planète. Faisons ce premier pas ensemble.",
    buttonLabel: "Je découvre le tuto",
    url: "",
    backgroundColor: "white",
    infosupp: "8 minutes",
  }
];



</script>

<template>
  <div class="homepage">
    <section class="homepage_header">
      <div class="homepage_header_info">
        <div class="homepage_header_info_image">
          <img src="../assets/img/coco_little.png" alt="">
        </div>
        <div class="homepage_header_info_name">
          <p class="title">Bienvenue,</p>
          <p class="subtitle">Fleur</p>
        </div>
      </div>
      <div class="homepage_header_notif">
        <img src="../assets/img/notif.svg" alt="">
      </div>
    </section>
    <section class="homepage_empreinte">
      <div class="homepage_empreinte_title">
        <h1>Mon empreinte carbone</h1>
      </div>
      <div class="homepage_empreinte_cards">
        <div class="homepage_empreinte_cards_total" >
          <p><span>0</span>kg(s) de CO2</p>
          <img class="pattern" src="../assets/img/pattern/pattern.svg" alt="">
        </div>
        <div class="homepage_empreinte_cards_goal">
          <button @click="defineGoal">Je définis mon objectif du mois</button>
        </div>
      </div>
    </section>
    <section class="homepage_buttons">
      <div class="homepage_buttons_list">
        <div v-for="item in buttons" class="homepage_buttons_list_item">
          <div class="homepage_buttons_list_item_image">
            <img :src="`../assets/img/${item.image}`" alt="">
          </div>
          <div class="homepage_buttons_list_item_info">
            <div class="homepage_buttons_list_item_info_title">
              <p>{{ item.title }}</p>
            </div>
            <div v-if="item.subtitle !== ''" class="homepage_buttons_list_item_info_subtitle">
              <p>{{ item.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="homepage_tips">
      <div class="homepage_tips_title">
        <h2>Mes petites news du mois</h2>
      </div>
      <div class="homepage_tips_content">
        <div class="homepage_tips_content_list">
          <div v-for="item in tips" class="homepage_tips_content_list_item" :class="item.backgroundColor">
            <div class="homepage_tips_content_list_item_title">
              <p>{{ item.title }} <span v-if="item.infosupp != ''">- {{item.infosupp}}</span></p>
            </div>
            <div class="homepage_tips_content_list_item_subtitle">
              <p>{{ item.subtitle }}</p>
            </div>
            <div class="homepage_tips_content_list_item_button">
<!--              dans le @click ajouter : goTo(item.url) et faire la fonction-->
              <button @click="">{{ item.buttonLabel }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Menu />
<!--  <div class="header flex flex-center" v-if="!getBankLink">-->
<!--    <div class="co2__counter flex flex-center">-->
<!--      <span class="co2__counter-number" style>{{ goalNumber }}</span>-->
<!--      <span class="co2__counter-txt">grammes(s)<br />de CO2</span>-->
<!--    </div>-->
<!--    <h2>liez votre compte à une banque</h2>-->
<!--  </div>-->
<!--  <div class="header" v-else>-->
<!--    <div v-if="goalNumber === '0'" class="flex flex-center">-->
<!--      <div class="co2__counter">-->
<!--        <span class="co2__counter-number" style>0</span>-->
<!--        <span class="co2__counter-txt">grammes(s)<br />de CO2</span>-->
<!--      </div>-->
<!--      <div class="define__goal" @click="defineGoal">-->
<!--        Je définis mon objectif du mois-->
<!--      </div>-->
<!--    </div>-->
<!--    <div v-else>-->
<!--      <h2>Mon objectif du mois : {{ goalNumber }}g CO2</h2>-->
<!--      <div class="progressBar">-->
<!--        <div class="progressBar__progress" :style="{width: purcentGoal.toFixed(2) + '%'}">{{ totalEmission }}kg CO2</div>-->
<!--      </div>-->
<!--      <div class="define__goal" @click="defineGoal">Modifier mon objectif</div>-->
<!--    </div>-->
<!--    <h2>Les émissions de CO2 de vos dépenses du mois</h2>-->
<!--    <p>{{ totalEmission }}kg CO2</p>-->
<!--  </div>-->
<!--  <Logout-->
<!--    @update-access-token="checkHomeAccess"-->
<!--    :accesstoken="accessTokenKey"-->
<!--  />-->
<!--  <p @click="goToTransaction()">transaction</p>-->
</template>


<style scoped lang="scss">
  .progressBar {
    background-color: #D9D9D9;
  }
  .progressBar__progress {
    background-color: #505050;
    padding: 5px 10px;
    text-align: right;
    color: #fff;
    max-width: 100%;
  }

  .homepage{
    padding: 0 5% 100px;
    background-color: #F5F5F5;
    &_header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3% 0;
      &_info{
        display: flex;
        align-items: center;
        gap: 1rem;
        &_image{
          width: 45px;
          height: 45px;
          background-color: var(--grey);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 23px;
          border: 0.93px dashed;

          img{
            width: 100%;
          }
        }
        &_name{
          .title{
            font-size: 12px;
            color: var(--grey);
          }
          .subtitle{
            font-size: 16px;
            color: var(--black);
            font-weight: 700;
          }
        }
      }
     }
    &_empreinte{
      padding: 15px 0;
      &_title{
        h1{
          font-size: 16px;
          margin-bottom: 4%;
          font-weight: 600;
        }
      }
      &_cards{
        &_total{
          position: relative;
          padding: 3%;
          background-color: #031A6E;
          border-radius: 10px;
          p{
            font-size: 16px;
            color: white;
            font-weight: 700;
            span{
              font-size: 40px;
            }
          }
          .pattern{
            position: absolute;
            bottom: -5px;
            width: 100%;
          }
        }
        &_goal{
          button{
            display: block;
            margin-inline: auto;
            margin-top: 15px;
            width: 100%;
            font-weight: 700;
            text-align: left;
            font-size: 14px;
            padding: 3%;
            border-radius: 8px;
            color: var(--black);
            background-color: white;
            box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
            border: none;
            border-radius: 8px;
          }
        }
      }
    }
    &_buttons{
      &_list{
        background-color: #FFFFFF;
        border-radius: 10px;
        margin: 25px 0;
        &_item{
          display: flex;
          gap: 1rem;
          padding: 15px;
          &_image{
            width: 40px;
            height: 40px;
            background-color: var(--grey);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            img{
              width: 50%;
            }
          }
          &_info{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            &_title{
              p{
                font-weight: 700;
                font-size: 16px;
              }
            }
            &_subtitle{
              p{
                color: var(--grey);
                font-size: 12px;
              }
            }
          }
          &:not(:last-child){
          border-bottom: 1px solid #EFEFEF;
          }
        }
      }
    }
    &_tips{
      &_title{
        margin-bottom: 15px;
        h2{
          font-size: 14px;
          font-weight: 600;
        }
      }
      &_content{
        &_list{
          display: flex;
          flex-direction: column;
          gap: 1rem;
          &_item{
            &.green{
              background-color: var(--green);
            }
            &.white{
              color: black;
              background-color: #FFF;
              .homepage_tips_content_list_item_title{
                color: #002595;
              }
            }
            color: white;
            border-radius: 10px;
            padding: 15px;
            &_title{
              margin-bottom: 15px;
              p{
                font-weight: 600;
                font-size: 16px;
                span{
                  color: #5D85FD;
                  font-size: 12px;
                }
              }
            }
            &_subtitle{
              font-weight: 400;
              font-size: 14px;
              margin-bottom: 25px;
            }
            &_button{
              button{
                display: block;
                margin-inline: auto;
                margin-top: 15px;
                width: 100%;
                font-weight: 700;
                text-align: center;
                font-size: 14px;
                padding: 3%;
                border-radius: 8px;
                color: var(--black);
                background-color: white;
                box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
                border: none;
                border-radius: 8px;
              }
            }
          }
        }
      }
    }
  }
</style>