<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { useRoute } from "vue-router";
import { ref } from "vue";
import ReturnButton from "../../components/ReturnButton.vue";
import Button from '../../components/Button.vue'

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

function transactionAnchor() {
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


const tips = [
  {
    title: "Pti'tips",
    subtitle:
        "Connaître son empreinte carbone permet de mieux comprendre son impact personnel sur la planète. Faisons ce premier pas ensemble.",
    buttonLabel: "Voir tous les tips",
    url: "",
    backgroundColor: "green",
    infosupp: "",
  }
];


</script>

<template>
  <div class="transactions_single" id="transactionAnchor">
    <ReturnButton returnBtn=true displayFlex="true" label="Retour aux dépenses"/>
    <div class="transactions_single_header">
      <div class="transactions_single_header_title">
        <h1>{{ data.clean_description }}</h1>
      </div>
      <div class="transactions_single_header_date">
        <p>{{ data.date }}</p>
      </div>
      <div class="transactions_single_header_category">
        <div class="image">
          <div class="bigCircle"></div>
          <div class="circleAround"></div>
        </div>
        <p>{{ data.category }}</p>
      </div>
    </div>
    <div class="transactions_single_main">
      <ul class="transactions_single_main_list">
        <li class="transactions_single_main_list_item">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/single_transac/empreinte.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>0.2g de CO2</p>
          </div>
        </li>
        <li class="transactions_single_main_list_item">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/single_transac/amount.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>{{data.amount}}€</p>
          </div>
        </li>
        <li class="transactions_single_main_list_item">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/single_transac/lieu.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>Lille</p>
          </div>
        </li>
        <li class="transactions_single_main_list_item">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/single_transac/categ.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>{{data.category}}</p>
          </div>
        </li>
      </ul>
      <div class="transactions_single_main_equivalences">
        <h2 class="title">Équivalences</h2>
        <ul class="transactions_single_main_equivalences_list">
          <li class="transactions_single_main_equivalences_list_item">
            <div class="transactions_single_main_equivalences_list_item_image">
              <img src="../../assets/img/single_transac/transport.svg" alt="">
            </div>
            <div class="transactions_single_main_equivalences_list_item_info">
              <p class="empreinteCarbone">0,5</p>
              <p class="info">trajet(s) en TGV Lille- Paris</p>
            </div>
          </li>
          <li class="transactions_single_main_equivalences_list_item">
            <div class="transactions_single_main_equivalences_list_item_image">
              <img src="../../assets/img/single_transac/transport.svg" alt="">
            </div>
            <div class="transactions_single_main_equivalences_list_item_info">
              <p class="empreinteCarbone">0,5</p>
              <p class="info">trajet(s) en TGV Lille- Paris</p>
            </div>
          </li>
        </ul>
      </div>
      <section class="transactions_single_main_recompenses">
        <h2 class="title">Récompenses</h2>
        <div class="transactions_single_main_recompenses_item">
          <div class="transactions_single_main_recompenses_item_title">
            <div class="image">
              <img src="../../assets/img/single_transac/star.svg" alt="">
            </div>
            <div class="titre">
              <p>Vous avez gagné 5 points</p>
            </div>
          </div>
          <div class="transactions_single_main_recompenses_item_subtitle">
            <p>Félicitations, vous avez effectué votre achat dans un magasin partenaire  !</p>
          </div>
        </div>
        <div class="transactions_single_main_recompenses_item_winReward">
          <p>Gagnez encore plus de récompenses en participant à des défis.</p>
        </div>
        <div class="transactions_single_main_recompenses_item_button">
          <Button label="Je découvre les défis" url=""/>
        </div>
      </section>
      <section class="transactions_single_main_tips">
        <div class="transactions_single_main_tips_content">
          <div class="transactions_single_main_tips_content_list">
            <div
                v-for="(item, i) in tips"
                :key="'tip' + i"
                class="transactions_single_main_tips_content_list_item"
                :class="item.backgroundColor"
            >
              <div class="transactions_single_main_tips_content_list_item_title">
                <p>
                  {{ item.title }}
                  <span v-if="item.infosupp != ''">- {{ item.infosupp }}</span>
                </p>
              </div>
              <div class="transactions_single_main_tips_content_list_item_subtitle">
                <p>{{ item.subtitle }}</p>
              </div>
              <div class="transactions_single_main_tips_content_list_item_button">
                <Button :label="item.buttonLabel" :url="item.url" noArrow='true'/>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="transactions_single_main_alternatives">
        <h2 class="title">Alternatives</h2>
        <ul class="transactions_single_main_alternatives_list">
          <li class="transactions_single_main_alternatives_list_item">
            <div class="transactions_single_main_alternatives_list_item_image">
              <img src="../../assets/img/single_transac/biocbon.svg" alt="">
            </div>
            <div class="transactions_single_main_alternatives_list_item_title">
              <h2>Bio c’Bon</h2>
            </div>
            <div class="transactions_single_main_alternatives_list_item_info">
              <p>Découvrez les magasins bio c’bon à côté de chez vous.</p>
            </div>
          </li>
          <li class="transactions_single_main_alternatives_list_item">
            <div class="transactions_single_main_alternatives_list_item_image">
              <img src="../../assets/img/single_transac/biocbon.svg" alt="">
            </div>
            <div class="transactions_single_main_alternatives_list_item_title">
              <h2>Bio c’Bon</h2>
            </div>
            <div class="transactions_single_main_alternatives_list_item_info">
              <p>Découvrez les magasins bio c’bon à côté de chez vous.</p>
            </div>
          </li>
        </ul>
        <p class="winReward">Gagnez des récompenses en achetant vos produits dans nos magasins partenaires.</p>
        <Button label="Je découvre tous les partenaires" url="" textAlign="left"/>
      </section>
    </div>
    <div class="transactions_single_footer">
      <div class="transactions_single_footer_transaction">
        <p>{{ data.clean_description }}</p>
      </div>
      <div class="transactions_single_footer_emission">
        <div class="transactions_single_footer_emission_total">
          <p><span class="totalEmission" id="totalEmission">0.2</span> kg de CO2</p>
        </div>
        <div class="transactions_single_footer_emission_add">
          <p @click="transactionAnchor()" >Modifier la dépense</p>
          <img src="../../assets/img/single_transac/edit.svg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.transactions_single{
  padding: 0 5%;
  &_header{
    &_title{
      margin-bottom: 1rem;
    }
    &_date{
      margin-bottom: 1rem;
    }
    &_category{
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
  }
  &_main{
    padding-top: 1rem;
    padding-bottom: 13rem;
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
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: 60%;
          }
        }
      }
    }
    &_equivalences{
      padding: 30px 0;
      .title{
        margin-bottom: 15px;
      }
      &_list{
        display: flex;
        flex-direction: row;
        overflow: scroll;
        gap: 1rem;
        list-style-type: none;
        padding: 0;
        &_item{
          background-color: #EFF5FF;
          flex: 0 0 90%;
          padding: 15px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 1rem;
          &_image{
            width: 40px;
            height: 40px;
            background-color: white;
            border-radius: 100vmax;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #A8BEFF;
          }
          &_info{
            .empreinteCarbone{
              font-size: 16px;
              font-weight: 600;
            }
            .info{
              font-size: 12px;
            }
          }
        }
      }
    }
    &_recompenses{
      padding: 30px 0;
      .title{
        margin-bottom: 15px;
      }
      &_item{
        padding: 15px;
        background-color: #EDFFF3;
        border-radius: 10px;
        &_title{
          display: flex;
          align-items: center;
          gap: .5rem;
          background: linear-gradient(180deg, #FFA53C 0%, #FF2E00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        &_winReward{
          font-size: 14px;
          padding: 15px 0;
        }
      }
    }
    &_tips {
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
    &_alternatives{
      padding: 30px 0;
      .title{
        margin-bottom: 15px;
      }
      &_list{
        display: flex;
        justify-content: space-between;
        list-style-type: none;
        &_item{
          padding: 15px;
          background: #FFFFFF;
          box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          width: 48%;
          display: flex;
          flex-direction: column;
          gap: 15px;
          &_image{
            width: 25px;
            height: 25px;
          }
          &_title {
            h2 {
              font-weight: 600;
              font-size: 16px;
              span {
                color: #5d85fd;
                font-size: 12px;
              }
            }
          }
        }
      }
      .winReward{
        font-size: 14px;
        padding: 15px 0;
      }
    }
  }
  &_footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 5% 5% 0;
    background-color: white;
    box-shadow: 8px 0px 40px rgba(0, 0, 0, 0.05);
    border-radius: 10px 10px 0px 0px;

    &_transaction{
      padding: 5% 0;
      text-align: center;
      font-weight: 600;
    }
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
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--blue);
        border-radius: 10px;
        padding: 20px;
        gap: .5rem;
        p{
          color: white;
        }
      }
    }
  }
}
</style>