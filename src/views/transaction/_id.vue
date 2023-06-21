<script setup>
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { useRoute } from "vue-router";
import { ref } from "vue";
import ReturnButton from "../../components/ReturnButton.vue";
import Button from '../../components/Button.vue'

const route = useRoute();
const editMode = ref(false);
const modalEditModeLoc = ref(false);
const modalEditModeMarque = ref(false);
const modalEditModePerson = ref(false);
const data = ref([]);
const changeLocationValue = ref('');
const changePersonnesValue = ref(1);
const changeMarqueValue = ref('');
const city = ref('Lille');
const marque = ref('');
import impact from "../../assets/json/impacts.json";

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

  if (response.status === 200 || response.status === 201 || response.status === 202) {
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

  if (response.status === 200 || response.status === 201 || response.status === 202) {
    e.category = response.data.name;
    const filteredData = impact.filter(item => item.label === e.category);
    e.color = filteredData[0].color
  } else {
    console.log("ERROR Request FAIL");
  }
};

function changeLocalisation(){
  if(changeLocationValue.value != ''){
    this.city = changeLocationValue.value;
  }
}

function changeMarque(){
  if(changeMarqueValue.value != ''){
    this.marque = changeMarqueValue.value;
  }
}

function changeValuePerson(value){
  if(value == 'plus'){
    this.changePersonnesValue += 1;
  }
  else if(value == 'minus'){
    this.changePersonnesValue -= 1;
  }
}

function getFormattedDate(date){
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = new Intl.DateTimeFormat('fr', { month: 'long' }).format(dateObj);

  return `${day} ${month}`;
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
  }
];


</script>

<template>
  <div class="transactions_single" id="transactionAnchor">
    <ReturnButton returnBtn displayFlex label="Retour aux dépenses"/>
    <div class="transactions_single_header">
      <div class="transactions_single_header_title">
        <h1>{{ data.bank_description }}</h1>
      </div>
      <div class="transactions_single_header_date">
        <p>{{ getFormattedDate(data.date) }}</p>
      </div>
      <div class="transactions_single_header_category">
        <div class="image">
          <div class="bigCircle" :style="{ backgroundColor: data.color }"></div>
          <div class="circleAround" :style="{border: '1px solid ' + data.color}"></div>
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
        <li class="transactions_single_main_list_item" :class="editMode ? 'editMode' : null" @click="editMode ? modalEditModeLoc = !modalEditModeLoc : null">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/single_transac/lieu.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>{{ city }}</p>
          </div>
        </li>
        <li class="transactions_single_main_list_item" :class="editMode ? 'editMode' : null" @click="editMode ? modalEditModeMarque = !modalEditModeMarque : null">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/single_transac/categ.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p v-if="marque == '' ">{{ data.clean_description }}</p>
            <p v-else>{{ marque }}</p>
          </div>
        </li>
        <li class="transactions_single_main_list_item" :class="editMode ? 'editMode' : null" @click="editMode ? modalEditModePerson = !modalEditModePerson : null">
          <div class="transactions_single_main_list_item_image">
            <img src="../../assets/img/single_transac/person.svg" alt="">
          </div>
          <div class="transactions_single_main_list_item_text">
            <p>{{ changePersonnesValue}}</p>
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
          <p v-if="!editMode" @click="editMode = !editMode" >Modifier la dépense</p>
          <p v-else @click="editMode = !editMode">Je valide les changements</p>
          <img src="../../assets/img/single_transac/edit.svg" alt="">
        </div>
      </div>
    </div>
  </div>
  <div class="editModal" :class="modalEditModeLoc ? '-open' : null">
    <div class="editModal_content">
      <div class="editModal_content_close" @click="editMode ? modalEditMode = !modalEditMode : null">
        <p>Fermer la fenêtre</p>
        <img src="../../assets/img/close.svg" alt="">
      </div>
      <div class="editModal_content_localisation">
        <div class="editModal_content_localisation_title">
          <img src="../../assets/img/single_transac/lieu.svg" alt="">
          <h2>Localisation</h2>
        </div>
        <div class="editModal_content_localisation_actuelle">
          <p class="title">Localisation actuelle</p>
          <div class="editModal_content_localisation_actuelle_content">
            <div class="editModal_content_localisation_actuelle_content_image">
              <img src="../../assets/img/single_transac/lieu.svg" alt="">
            </div>
            <div class="editModal_content_localisation_actuelle_content_text">
              <p>{{ city }}</p>
            </div>
          </div>
        </div>
        <div class="editModal_content_localisation_new">
          <p class="title">Autres localisations</p>
          <div class="inputDiv">
            <input type="text" placeholder="Nouvelle localisation.." v-model="changeLocationValue">
          </div>
        </div>
        <div class="editModal_content_localisation_button">
          <button @click="changeLocalisation(); modalEditModeLoc = !modalEditModeLoc">Je confirme mon choix</button>
        </div>
      </div>
    </div>
  </div>
  <div class="editModal" :class="modalEditModeMarque ? '-open' : null">
    <div class="editModal_content">
      <div class="editModal_content_close" @click="editMode ? modalEditMode = !modalEditMode : null">
        <p>Fermer la fenêtre</p>
        <img src="../../assets/img/close.svg" alt="">
      </div>
      <div class="editModal_content_marque">
        <div class="editModal_content_marque_title">
          <img src="../../assets/img/single_transac/lieu.svg" alt="">
          <h2>Marque</h2>
        </div>
        <div class="editModal_content_marque_actuelle">
          <p class="title">Marque actuelle</p>
          <div class="editModal_content_marque_actuelle_content">
            <div class="editModal_content_marque_actuelle_content_image">
              <img src="../../assets/img/single_transac/categ.svg" alt="">
            </div>
            <div class="editModal_content_marque_actuelle_content_text">
              <p v-if="marque == '' ">{{ data.clean_description }}</p>
              <p v-else>{{ marque }}</p>
            </div>
          </div>
        </div>
        <div class="editModal_content_marque_new">
          <p class="title">Autres marques</p>
          <div class="inputDiv">
            <input type="text" placeholder="Nouvelle marque.." v-model="changeMarqueValue">
          </div>
        </div>
        <div class="editModal_content_marque_button">
          <button @click="changeMarque(); modalEditModeMarque = !modalEditModeMarque">Je confirme mon choix</button>
        </div>
      </div>
    </div>
  </div>

  <div class="editModal" :class="modalEditModePerson ? '-open' : null">
    <div class="editModal_content">
      <div class="editModal_content_close" @click="editMode ? modalEditModePerson = !modalEditModePerson : null">
        <p>Fermer la fenêtre</p>
        <img src="../../assets/img/close.svg" alt="">
      </div>
      <div class="editModal_content_personne">
        <div class="editModal_content_personne_title">
          <img src="../../assets/img/single_transac/person.svg" alt="">
          <h2>Nombre de personnes</h2>
        </div>
        <div class="editModal_content_personne_actuelle">
          <p class="title">Nombre de personnes concernées par l’achat</p>
        </div>
        <div class="editModal_content_personne_content">
          <div class="editModal_content_personne_content_number">
            <img src="../../assets/img/single_transac/person.svg" alt="">
            <p>{{changePersonnesValue}}</p>
          </div>
          <div class="editModal_content_personne_content_changeValue">
            <div class="changeValue_minus" @click="changeValuePerson('minus')">
              <p>-</p>
            </div>
            <div class="changeValue_plus" @click="changeValuePerson('plus')">
              <p>+</p>
            </div>
          </div>
        </div>
        <div class="editModal_content_personne_button">
          <button @click="changeMarque(); modalEditModePerson = !modalEditModePerson">Je confirme mon choix</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.editModal{
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(25, 27, 31, .35);
  transform: translateY(100%);
  transition: 1s all ease;
  &.-open{
    transform: translateY(0%);
    transition: 1s all ease;
  }
  &_content{
    position: absolute;
    bottom: 0;
    height: 90%;
    background-color: white;
    width: 100%;
    border-radius: 10px;
    padding: 30px;
    &_close{
      display: flex;
      justify-content: end;
      gap: 1rem;
      cursor: pointer;
    }
    &_localisation, &_marque, &_personne{
      &_title{
        display: flex;
        align-items: center;
        gap: .5rem;
        margin-bottom: 40px;
      }
      &_actuelle{
        padding: 15px;
        p.title{
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 15px;
        }
        &_content{
          background-color: #FFFFFF;
          box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          position: relative;
          display: flex;
          gap: .5rem;
          align-items: center;
          padding: 10px;
        }
      }
      &_content{
        &_number{
          box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          margin: 0 auto 5%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          gap: 1rem;
          border-radius: 10px;
          p{
            font-size: 32px;
            font-weight: 700;
          }
        }
        &_changeValue{
          display: flex;
          justify-content: space-between;
          .changeValue_plus, .changeValue_minus{
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45%;
            border: 2px solid #CBCBDD;
            box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
          }
        }
      }
      &_new{
        padding: 15px;
        p.title{
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 15px;
        }
        .inputDiv{
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
          input{
            background: #FFFFFF;
            box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            border: none;
            width: 100%;
            position: relative;
            padding: 20px 0 20px 40px;
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
        }
      }
      &_button{
        button{
          background-color: var(--blue);
          color: white;
        }
      }
    }
  }
}
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
  }
  &_main{
    padding-top: 1rem;
    padding-bottom: 13rem;
    &_list{
      list-style-type: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: .5rem;
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
        &.editMode{
          box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          position: relative;
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
      padding: 16px 0;
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