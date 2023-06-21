<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { Preferences } from "@capacitor/preferences";
import Logout from "../components/Logout.vue";
import Menu from "../components/Menu.vue";
import { useTransactionsStore } from "../store/transactions.js";
import impact from "../assets/json/impacts.json";

import { ref, onMounted } from "vue";
import Button from "../components/Button.vue";

const userStore = useUserStore();
const transactionsStore = useTransactionsStore();

const router = useRouter();
const accessTokenKey = ref("");
const getBankLink = ref(false);
const monthGoal = ref(false);
const goalNumber = ref(0);
const totalEmission = ref(0);
const restEmission = ref(0);
const purcentGoal = ref(0);
const transactions = ref([]);
const filterArray = ref([]);
const impacts = impact;

const checkHomeAccess = (accessToken) => {
  accessToken == null ? router.push({ name: "Login" }) : "";
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

const transaction = async (token) => {
  const options = {
    url: "https://api.bridgeapi.io/v2/transactions",
    params: { limit: "50" },
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
    const promises = response.data.resources.map((e) => {
      return getCategories(e.category_id, e);
    });

    await Promise.all(promises);

    filterTransaction(response.data.resources, impacts);
  } else {
    console.log("ERROR Request FAIL");
  }
};

const filterTransaction = (transactions, impactArray) => {
  const filteredTransactions = transactions.filter((transaction) => {
    return impactArray.some((impact) => impact.label === transaction.category);
  });

  filteredTransactions.forEach(transaction => {
    const category = transaction.category;
    impacts.forEach(impact => {
      if (impact.label.includes(category)) {
        const impactValue = impact.impact;
        transaction.impact = impactValue;
        transaction.category_color = impact.color
      }
    });
  });

  totalEmission.value = filteredTransactions.reduce((total, transaction) => total + transaction.impact, 0);
  getGoal();
  transactionsStore.setupTransactions(filteredTransactions);
};

const getGoal = async () => {
  const value = await Preferences.get({ key: "goal" });
  goalNumber.value = value.value;
  purcentGoal.value = (totalEmission.value / goalNumber.value) * 100;
  restEmission.value = goalNumber.value - totalEmission.value;
};

const accessToken = async () => {
  const { value } = await Preferences.get({ key: "accessToken" });
  accessTokenKey.value = value;
  checkHomeAccess(value);
  transaction(value);
};

const getCheckBank = async () => {
  const { value } = await Preferences.get({ key: "linkBank" });
  if (value) {
    getBankLink.value = true;
  }
};

getCheckBank();

accessToken();

function goTo(url) {
  router.push({ name: url });
}

const tips = [
  {
    title: "Pti'tips",
    subtitle:
      "Connaître son empreinte carbone permet de mieux comprendre son impact personnel sur la planète. Faisons ce premier pas ensemble.",
    buttonLabel: "Voir tous les tips",
    url: "",
    backgroundColor: "green",
    infosupp: "",
  },
  {
    title: "Pti'tips",
    subtitle:
      "Connaître son empreinte carbone permet de mieux comprendre son impact personnel sur la planète. Faisons ce premier pas ensemble.",
    buttonLabel: "Je découvre le tuto",
    url: "",
    backgroundColor: "white",
    infosupp: "8 minutes",
  },
];
</script>

<template>
  <div class="homepage">
    <section class="homepage_header">
      <div class="homepage_header_info">
        <div class="homepage_header_info_image">
          <img src="../assets/img/coco_little.png" alt="" />
        </div>
        <div class="homepage_header_info_name">
          <p class="title">Bienvenue,</p>
          <p class="subtitle">Fleur</p>
        </div>
      </div>
      <div class="homepage_header_right">
        <div class="homepage_header_right_notif">
          <img src="../assets/img/notif.svg" alt="" />
        </div>
        <div class="homepage_header_right_objectif">
          <p>15</p>
          <div class="circle"></div>
        </div>
      </div>
    </section>
    <section class="homepage_empreinte">
      <div class="homepage_empreinte_title">
        <h1>Mon empreinte carbone</h1>
      </div>
      <div class="homepage_empreinte_cards" v-if="goalNumber === '0'">
        <div class="homepage_empreinte_cards_total card__wave">
          <p>
            <span>{{ totalEmission.toFixed(2) }}</span> kg(s) de CO2
          </p>
        </div>
        <div class="homepage_empreinte_cards_goal">
          <Button label="Je définis mon objectif du mois" url="DefineGoal" />
        </div>
      </div>
      <div class="homepage_empreinte_cards goalDefined" v-else>
        <div class="homepage_empreinte_cards_goal">
          <div class="progress">
            <div class="progress__header flex">
              <div class="goal">
                <span class="label">Objectif</span>
                <span class="value">{{ goalNumber }} Kg de CO2</span>
              </div>
              <div class="rest">
                <span class="label">Il ne te reste plus que</span>
                <span class="value">{{ restEmission.toFixed(2) }} Kg</span>
              </div>
            </div>
            <div class="progressBar">
              <div
                class="progressBar__progress"
                :style="{ width: purcentGoal.toFixed(2) + '%' }"
              ></div>
            </div>
            <Button
              label="Je modifie mon objectif du mois"
              url="DefineGoal"
              textAlign="left"
            />
          </div>
        </div>
        <div class="homepage_empreinte_cards_total card__wave">
          <p>
            <span>{{ totalEmission.toFixed(2) }}</span> kg(s) de CO2
          </p>
          <Button label="Voir les dépenses du mois" url="Transaction" />
        </div>
      </div>
    </section>
    <section class="homepage_buttons">
      <div class="homepage_buttons_list">
        <div class="homepage_buttons_list_item" @click="goTo('Questionnaire')">
          <div class="homepage_buttons_list_item_image">
            <img src="../assets/img/questionnaire.svg" alt="" />
          </div>
          <div class="homepage_buttons_list_item_info">
            <div class="homepage_buttons_list_item_info_title">
              <p>Répondre au questionnaire</p>
            </div>
            <div class="homepage_buttons_list_item_info_subtitle">
              <p>8 minutes</p>
            </div>
          </div>
        </div>
        <div v-if="!getBankLink" class="homepage_buttons_list_item">
          <div class="homepage_buttons_list_item_image">
            <img src="../assets/img/link_account.svg" alt="" />
          </div>
          <div class="homepage_buttons_list_item_info">
            <div class="homepage_buttons_list_item_info_title">
              <p>Lier mon compte à mes dépenses</p>
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
          <div
            v-for="(item, i) in tips"
            :key="'tip' + i"
            class="homepage_tips_content_list_item"
            :class="item.backgroundColor"
          >
            <div class="homepage_tips_content_list_item_title">
              <p>
                {{ item.title }}
                <span v-if="item.infosupp != ''">- {{ item.infosupp }}</span>
              </p>
            </div>
            <div class="homepage_tips_content_list_item_subtitle">
              <p>{{ item.subtitle }}</p>
            </div>
            <div class="homepage_tips_content_list_item_button">
              <Button
                :label="item.buttonLabel"
                :url="item.url"
                noArrow="true"
              />
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
.card__wave {
  position: relative;

  &::before {
    content: "";
    pointer-events: none;
    min-height: calc(100% + 40px);
    height: 240px;
    width: calc(100% + 40px);
    background: url('data:image/svg+xml,<svg width="346" height="239" viewBox="0 0 346 239" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_184_2244" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="6" y="6" width="327" height="219"><path d="M6 14.7077C6 10.2894 9.58172 6.7077 14 6.7077H325C329.418 6.7077 333 10.2894 333 14.7077V216.708C333 221.126 329.418 224.708 325 224.708H14C9.58173 224.708 6 221.126 6 216.708V14.7077Z" fill="%231066FF"/></mask><g mask="url(%23mask0_184_2244)"><path opacity="0.1" d="M116.83 183.658C55.4629 178.699 10.6694 210.778 0 225.347L8.00202 238.123H29.8742H334.485L345.687 49.1758C349.244 28.1069 321.318 -15.2558 319.547 5.4691C315.813 49.1757 292.341 115.072 264.067 139.279C240.021 159.865 200.051 190.382 116.83 183.658Z" fill="white"/></g></svg>');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: right center;
    position: absolute;
    bottom: -20px;
    right: -20px;
  }
}
.progressBar {
  background-color: #cbcbdd;
  border-radius: 32px;
  margin-bottom: 17px;
}
.progressBar__progress {
  background-color: #2dbc5d;
  border-radius: 32px;
  padding: 5px 10px;
  text-align: right;
  color: #fff;
  max-width: 100%;
}

.homepage {
  padding: 0 5% 100px;
  background-color: #f5f5f5;
  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3% 0;
    &_info {
      display: flex;
      align-items: center;
      gap: 1rem;
      &_image {
        width: 45px;
        height: 45px;
        background-color: var(--grey);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 23px;

        img {
          width: 100%;
        }
      }
      &_name {
        .title {
          font-size: 12px;
          color: var(--grey);
        }
        .subtitle {
          font-size: 16px;
          color: var(--black);
          font-weight: 700;
        }
      }
    }
    &_right {
      display: flex;
      align-items: center;
      gap: 1rem;
      &_objectif {
        background: linear-gradient(180deg, #ff8d07 0%, #ffe24d 100%);
        width: 25px;
        height: 25px;
        border-radius: 100vmax;
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          color: white;
        }
        .circle {
          width: 32px;
          height: 32px;
          background-color: transparent;
          border: 1px solid #ffe14b;
          border-radius: 100vmax;
          position: absolute;
        }
      }
    }
  }
  &_empreinte {
    padding: 15px 0;
    &_title {
      h1 {
        font-size: 16px;
        margin-bottom: 4%;
        font-weight: 600;
      }
    }
    &_cards {
      &_total {
        position: relative;
        padding: 24px;
        background-color: #1066ff;
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        p {
          font-size: 16px;
          color: white;
          font-weight: 700;
          span {
            font-size: 40px;
          }
        }
      }
      &_goal {
        .progress {
          background-color: #fff;
          padding: 16px 24px;
          box-shadow: 0px 8px 40px 0px #0000000d;
          border-radius: 8px;
          margin-bottom: 16px;

          &__header {
            justify-content: space-between;
            margin-bottom: 16px;
            span {
              display: block;

              &.label {
                font-weight: 600;
                font-size: 10px;
                line-height: 16px;
                color: var(--grey-dark);
              }
              &.value {
                font-weight: 600;
                font-size: 12px;
                line-height: 12px;
                color: var(--black);
              }
            }
          }
        }
      }

      &.goalDefined {
        .homepage_empreinte_cards_total {
          text-align: center;
        }
      }
    }
  }
  &_buttons {
    &_list {
      background-color: #ffffff;
      border-radius: 10px;
      margin: 25px 0;
      &_item {
        display: flex;
        gap: 1rem;
        padding: 15px;
        position: relative;
        &_image {
          width: 40px;
          height: 40px;
          background-color: var(--grey);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          img {
            width: 50%;
          }
        }
        &_info {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          &_title {
            p {
              font-weight: 700;
              font-size: 16px;
            }
          }
          &_subtitle {
            p {
              color: var(--grey);
              font-size: 12px;
            }
          }
        }
        &:not(:last-child) {
          border-bottom: 1px solid #efefef;
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
  &_tips {
    &_title {
      margin-bottom: 15px;
      h2 {
        font-size: 14px;
        font-weight: 600;
      }
    }
    &_content {
      &_list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        &_item {
          &.green {
            background-color: var(--green);
          }
          &.white {
            color: black;
            background-color: #fff;
            .homepage_tips_content_list_item_title {
              color: #002595;
            }
          }
          color: white;
          border-radius: 10px;
          padding: 15px;
          &_title {
            margin-bottom: 15px;
            p {
              font-weight: 600;
              font-size: 16px;
              span {
                color: #5d85fd;
                font-size: 12px;
              }
            }
          }
          &_subtitle {
            font-weight: 400;
            font-size: 14px;
            margin-bottom: 25px;
          }
        }
      }
    }
  }
}
</style>