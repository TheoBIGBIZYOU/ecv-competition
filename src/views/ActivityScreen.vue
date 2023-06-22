<script setup>

import {computed, onMounted, reactive, ref, watch} from "vue";
import { Chart, registerables } from 'chart.js';
import { useTransactionsStore } from "../store/transactions.js";
import Button from "../components/Button.vue";
import impact from "../assets/json/impacts.json"
import 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const transactionsStore = useTransactionsStore();

const ongletActive = ref(1);
const semaineActive = ref(0);
const state = reactive({
  transactions: computed(() => transactionsStore.transactions),
  arrayTransacWeek: [],
  arrayTransacMonth: [],
  arrayTransacYear: [],
  arrayTransacCurrentMonth: [],
  arrayTransacLastWeek: [],
  arrayTransacLastMonth: [],
  arrayTransacOther: [],
  arrayTransacOtherMonths: [],
  arrayTransac: [],
  arrayTransacByMonth: [],
  arrayEmpreinteOfWeek: [],
  arrayTransacCurrentYear: [],
  arrayTransacLastYear: [],
  arrayTransacOtherYears: [],
  moyenneCateg: [],
  daysValue: [],
})

const transactionByWeek = (transactions) => {

  let currentDate = new Date();
  let date2 = new Date(currentDate.getFullYear(), 0, 1);
  let days = Math.floor((currentDate - date2) / (24 * 60 * 60 * 1000));
  let currentWeekNumber = Math.ceil(days / 7);
  transactions.forEach((e)=>{
    //week number of depense date
    let date = new Date(e.date);
    let date2 = new Date(date.getFullYear(), 0, 1);
    let days = Math.floor((date - date2) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil(days / 7);
    if( currentWeekNumber === weekNumber){
      state.arrayTransacWeek.push(e);
    }
    else if( currentWeekNumber - weekNumber === 1){
      state.arrayTransacLastWeek.push(e);
    }
    else if( currentWeekNumber - weekNumber === 2){
      state.arrayTransacOther.push(e);
    }
    state.arrayTransac = [state.arrayTransacWeek,state.arrayTransacLastWeek,state.arrayTransacOther];
  })

}

transactionByWeek(state.transactions);

const transactionByMonth = (transactions) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth();
    if (currentMonth === transactionMonth) {
      state.arrayTransacCurrentMonth.push(transaction);
    } else if (currentMonth - transactionMonth === 1 || (currentMonth === 0 && transactionMonth === 11)) {
      state.arrayTransacLastMonth.push(transaction);
    } else if (currentMonth - transactionMonth === 2){
      state.arrayTransacOtherMonths.push(transaction);
    }
    state.arrayTransacMonth = [state.arrayTransacCurrentMonth, state.arrayTransacLastMonth, state.arrayTransacOtherMonths];
  });
};

transactionByMonth(state.transactions);

const transactionByYear = (transactions) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();
    if (currentYear === transactionYear) {
      state.arrayTransacCurrentYear.push(transaction);
    } else if (currentYear - transactionYear === 1) {
      state.arrayTransacLastYear.push(transaction);
    } else if(currentYear - transactionYear === 2) {
      state.arrayTransacOtherYears.push(transaction);
    }
    state.arrayTransacYear = [state.arrayTransacCurrentYear, state.arrayTransacLastYear, state.arrayTransacOtherYears];
  });
};

transactionByYear(state.transactions)


function countEmpreinte(tab){
  let points = 0;
  state.daysValue.forEach((e) => {
    e.forEach((i) => {
      points += i.impact
    })
  })
  return points.toFixed(2)
}

function countEmpreinteInVar(tab){
  let points = 0;
  tab.forEach((e) => {
    points += e.impact
  })
  return parseFloat(points.toFixed(2))
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

function moyenneJour(item, returnValue){
  pourcentCateg(item);
  let moyenneTab = [];
  let categAmount = [];
  let day1 = [];
  let day2 = [];
  let day3 = [];
  let day4 = [];
  let day5 = [];
  let day6 = [];
  let day7 = [];
  let days = [];
  let jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  item.forEach((e) => {
    let date = new Date(e.date);
    let day = date.getDay();
    switch (day) {
      case 1:
        day1.push(e);
      case 2:
        day2.push(e);
      case 3:
        day3.push(e);
      case 4:
        day4.push(e);
      case 5:
        day5.push(e);
      case 6:
        day6.push(e);
      case 7:
        day7.push(e);
    }
  })
  days = [day1, day2, day3, day4, day5, day6, day7];
  state.daysValue = days;
  days.forEach((e,index) => {
    moyenneTab[index] = countEmpreinteInVar(e)
  })
  let moyenne = 0;
  moyenneTab.forEach((e) => {
    moyenne += e
  })
  state.arrayEmpreinteOfWeek = moyenneTab;
  if(returnValue === 'moyenne'){
    return (moyenne / 7).toFixed(2)
  }
  if(returnValue === 'bestScore'){
    return Math.min(...moyenneTab)
  }
}

function pourcentCateg(item){
  let Alimentation = [];
  let Mobilite = [];
  let Services = [];
  let Logement = [];
  let Autres = [];
  item.forEach((e) => {
    impact.forEach((i) => {
      if(e.category === i.label){
        switch (i.color) {
          case '#2FBC5D' :
            Alimentation.push(e);
          case '#002595' :
            Mobilite.push(e);
          case '#FFB72A' :
            Services.push(e);
          case '#FF3767' :
            Logement.push(e);
          case '#BBB6B6' :
            Autres.push(e);
        }
      }
    })
  })
  let categ = [Alimentation, Mobilite, Services, Logement, Autres];
  let moyenneCateg = [];
  categ.forEach((e)=>{
    let moyenne = 0;
    e.forEach((i,index) => {
      moyenne+=i.impact
    })
    // moyenne = (moyenne / 12).toFixed(2);
    moyenneCateg.push(moyenne);
  })
  let moyenneTotal = 0
  moyenneCateg.forEach((e) => {
    moyenneTotal += e;
  })
  let pourcentCateg = [];

  moyenneCateg.forEach((e) =>{
    pourcentCateg.push((e * 100) / moyenneTotal)
  })
  state.moyenneCateg = pourcentCateg;
}

function chartJour(value){
  const canvas = document.querySelector('#graphique_' + ongletActive.value + '_' + semaineActive.value);
  const ctx = canvas.getContext('2d');
  const joursSemaine = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: joursSemaine,
      datasets: [{
        label: 'Données en kg de CO2',
        data: value,
        backgroundColor: '#5D85FD'
      }]
    },
    options: {
      tooltip: false,
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'bottom',
          color: 'white',
          formatter: Math.round,
          font: {
            weight: 'bold',
            size: '16'
          },
          textDirection: 'ltr',
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(0, 0, 0, 0)",
          }
        },
        y: {
          grid: {
            color: "rgba(0, 0, 0, 0)",
          },
          ticks: {
            display: false
          }
        }
      },
    },
  });
}

function chartCateg(value){
  const canvas = document.querySelector('#graphiqueCateg_' + ongletActive.value + '_' + semaineActive.value);
  const ctx = canvas.getContext('2d');
  const joursSemaine = ['Alimentation', 'Mobilité', 'Services', 'Logement', 'Autres'];
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: joursSemaine,
      datasets: [{
        label: 'Données',
        data: value,
        backgroundColor: ['#2FBC5D', '#002595', '#FFB72A', '#FF3767', '#BBB6B6']
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#5D85FD',
          formatter: function(value, context) {
            return value.toFixed(2) + '%'; // Ajouter '%' après chaque valeur
          },
          backgroundColor: function(context) {
            return context.dataset.backgroundColor;
          },
          borderColor: 'white',
          borderRadius: 5,
          borderWidth: 0,
          color: 'white',
          font: {
            weight: 'bold',
            size: '16'
          },
          textDirection: 'ltr',
          textAlign: 'center',
          clip: true
        }
      }
    }
  });
}

watch(
    () => state.arrayEmpreinteOfWeek,
    (newValue) => {
      chartJour(state.arrayEmpreinteOfWeek);
      chartCateg(state.moyenneCateg);
    }
);
watch(
    () => state.arrayTransacMonth,
    (newValue) => {
      chartJour(state.arrayTransacMonth);
      chartCateg(state.moyenneCateg);
    }
);
watch(
    () => state.arrayTransacYear,
    (newValue) => {
      chartJour(state.arrayTransacYear);
      chartCateg(state.moyenneCateg);
    }
);

</script>

<template>
  <div class="activity">
    <div class="activity_header">
      <h1>Mon activité</h1>
    </div>
    <div class="activity_main">
      <div class="activity_main_menu">
        <div class="activity_main_menu_indiv" @click="(ongletActive = 1,semaineActive = 0)">
          <p :class="ongletActive === 1 ? '-active' : null">Semaine</p>
        </div>
        <div class="activity_main_menu_indiv" @click="(ongletActive = 2,semaineActive = 0)">
          <p :class="ongletActive === 2 ? '-active' : null">Mois</p>
        </div>
        <div class="activity_main_menu_indiv" @click="(ongletActive = 3,semaineActive = 0)">
          <p :class="ongletActive === 3 ? '-active' : null">Année</p>
        </div>
        <div class="activity_main_menu_bar" :class="`position_` + ongletActive"></div>
      </div>
      <div class="activity_main_semaine" v-if="ongletActive === 1">
        <div class="activity_main_semaine_indiv" v-for="(item,index) in state.arrayTransac">
          <div v-if="index  === semaineActive" class="content">
            <div class="activity_main_semaine_indiv_header">
              <div class="prev" @click="semaineActive - 1 !== -1 ? semaineActive = semaineActive - 1 : null">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0227 3.64498C12.2224 3.84468 12.2406 4.15717 12.0772 4.37738L12.0227 4.44047L7.17075 9.29272L12.0227 14.145C12.2224 14.3447 12.2406 14.6572 12.0772 14.8774L12.0227 14.9405C11.823 15.1402 11.5105 15.1583 11.2903 14.9949L11.2273 14.9405L5.97725 9.69047C5.77755 9.49077 5.7594 9.17827 5.92279 8.95807L5.97725 8.89498L11.2273 3.64498C11.4469 3.42531 11.8031 3.42531 12.0227 3.64498Z" fill="#191B1F"/>
                </svg>
              </div>
              <p v-if="index === 0">Cette semaine</p>
              <p v-if="index === 1">La semaine dernière</p>
              <p v-if="index === 2">Il y a trois semaine</p>
              <div class="next"  @click="semaineActive + 1 !== 3 ? semaineActive = semaineActive + 1 : null">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.97725 14.9405C5.77755 14.7408 5.7594 14.4283 5.92279 14.2081L5.97725 14.145L10.8293 9.29272L5.97725 4.44047C5.77755 4.24077 5.7594 3.92827 5.92279 3.70807L5.97725 3.64498C6.17695 3.44528 6.48945 3.42712 6.70966 3.59051L6.77275 3.64498L12.0227 8.89498C12.2224 9.09468 12.2406 9.40718 12.0772 9.62738L12.0227 9.69047L6.77275 14.9405C6.55308 15.1601 6.19692 15.1601 5.97725 14.9405Z" fill="#191B1F"/>
                </svg>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_value">
              <p class="empreinte"><span>{{countEmpreinte(item)}}</span> kg(s) de CO2</p>
              <p class="subtitle">Sous la moyenne FR de 692 kgs CO2/semaine</p>
              <Button noArrow='true' label="Voir toutes mes dépenses" url="Transaction" />
            </div>
            <div class="activity_main_semaine_indiv_repartition">
              <p class="title">Répartition de l’empreinte CO2 sur les jours de la semaine :</p>
              <div class="activity_main_semaine_indiv_repartition_card">
                <div class="activity_main_semaine_indiv_repartition_card_left">
                  <p class="value">{{ moyenneJour(item,'moyenne') }} KG de CO2</p>
                  <p>Moyenne</p>
                </div>
                <div class="activity_main_semaine_indiv_repartition_card_right">
                  <p class="value">{{ moyenneJour(item,'bestScore') }} KG de CO2</p>
                  <p>Meilleur score</p>
                </div>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_chartJour">
              <canvas :id="`graphique_` + ongletActive + '_' + index"></canvas>
            </div>
            <div class="activity_main_semaine_indiv_tips">
              <div class="activity_main_semaine_indiv_tips_content">
                <div class="activity_main_semaine_indiv_tips_content_list">
                  <div
                      v-for="(item, i) in tips"
                      :key="'tip' + i"
                      class="activity_main_semaine_indiv_tips_content_list_item"
                      :class="item.backgroundColor"
                  >
                    <div class="activity_main_semaine_indiv_tips_content_list_item_title">
                      <p>
                        {{ item.title }}
                        <span v-if="item.infosupp != ''">- {{ item.infosupp }}</span>
                      </p>
                    </div>
                    <div class="activity_main_semaine_indiv_tips_content_list_item_subtitle">
                      <p>{{ item.subtitle }}</p>
                    </div>
                    <div class="activity_main_semaine_indiv_tips_content_list_item_button">
                      <Button
                          :label="item.buttonLabel"
                          :url="item.url"
                          noArrow="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_chartCateg">
              <div class="activity_main_semaine_indiv_chartCateg_title">
                <p>Répartition de l’empreinte CO2 en fonction des catégories de dépenses :</p>
              </div>
              <canvas :id="`graphiqueCateg_` + ongletActive + '_' + index"></canvas>
            </div>
            <div class="activity_main_semaine_indiv_defis">
              <div class="activity_main_semaine_indiv_defis_content">
                <p class="title">Les défis</p>
                <p class="subtitle">Participe à nos défis pour t’aider à réduire ton empreinte carbone et à gagner des trophées ! </p>
                <Button label="Voir tous les défis" noArrow="true" url="Challenges"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="activity_main_mois" v-if="ongletActive === 2">
        <div class="activity_main_mois_indiv" v-for="(item,index) in state.arrayTransacMonth">
          <div v-if="index  === semaineActive" class="content">
            <div class="activity_main_semaine_indiv_header">
              <div class="prev" @click="semaineActive - 1 !== -1 ? semaineActive = semaineActive - 1 : null">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0227 3.64498C12.2224 3.84468 12.2406 4.15717 12.0772 4.37738L12.0227 4.44047L7.17075 9.29272L12.0227 14.145C12.2224 14.3447 12.2406 14.6572 12.0772 14.8774L12.0227 14.9405C11.823 15.1402 11.5105 15.1583 11.2903 14.9949L11.2273 14.9405L5.97725 9.69047C5.77755 9.49077 5.7594 9.17827 5.92279 8.95807L5.97725 8.89498L11.2273 3.64498C11.4469 3.42531 11.8031 3.42531 12.0227 3.64498Z" fill="#191B1F"/>
                </svg>
              </div>
              <p v-if="index === 0">Ce mois-ci</p>
              <p v-if="index === 1">Le mois précédent</p>
              <p v-if="index === 2">Il y a trois mois</p>
              <div class="next"  @click="semaineActive + 1 !== 3 ? semaineActive = semaineActive + 1 : null">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.97725 14.9405C5.77755 14.7408 5.7594 14.4283 5.92279 14.2081L5.97725 14.145L10.8293 9.29272L5.97725 4.44047C5.77755 4.24077 5.7594 3.92827 5.92279 3.70807L5.97725 3.64498C6.17695 3.44528 6.48945 3.42712 6.70966 3.59051L6.77275 3.64498L12.0227 8.89498C12.2224 9.09468 12.2406 9.40718 12.0772 9.62738L12.0227 9.69047L6.77275 14.9405C6.55308 15.1601 6.19692 15.1601 5.97725 14.9405Z" fill="#191B1F"/>
                </svg>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_value">
              <p class="empreinte"><span>{{countEmpreinte(item)}}</span> kg(s) de CO2</p>
              <p class="subtitle">Sous la moyenne FR de 692 kgs CO2/semaine</p>
              <Button noArrow='true' label="Voir toutes mes dépenses" url="Transaction" />
            </div>
            <div class="activity_main_semaine_indiv_repartition">
              <p class="title">Répartition de l’empreinte CO2 sur les jours de la semaine :</p>
              <div class="activity_main_semaine_indiv_repartition_card">
                <div class="activity_main_semaine_indiv_repartition_card_left">
                  <p class="value">{{ moyenneJour(item,'moyenne') }} KG de CO2</p>
                  <p>Moyenne</p>
                </div>
                <div class="activity_main_semaine_indiv_repartition_card_right">
                  <p class="value">{{ moyenneJour(item,'bestScore') }} KG de CO2</p>
                  <p>Meilleur score</p>
                </div>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_chartJour">
              <canvas :id="`graphique_` + ongletActive + '_' + index"></canvas>
            </div>
            <div class="activity_main_semaine_indiv_tips">
              <div class="activity_main_semaine_indiv_tips_content">
                <div class="activity_main_semaine_indiv_tips_content_list">
                  <div
                      v-for="(item, i) in tips"
                      :key="'tip' + i"
                      class="activity_main_semaine_indiv_tips_content_list_item"
                      :class="item.backgroundColor"
                  >
                    <div class="activity_main_semaine_indiv_tips_content_list_item_title">
                      <p>
                        {{ item.title }}
                        <span v-if="item.infosupp != ''">- {{ item.infosupp }}</span>
                      </p>
                    </div>
                    <div class="activity_main_semaine_indiv_tips_content_list_item_subtitle">
                      <p>{{ item.subtitle }}</p>
                    </div>
                    <div class="activity_main_semaine_indiv_tips_content_list_item_button">
                      <Button
                          :label="item.buttonLabel"
                          :url="item.url"
                          noArrow="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_chartCateg">
              <div class="activity_main_semaine_indiv_chartCateg_title">
                <p>Répartition de l’empreinte CO2 en fonction des catégories de dépenses :</p>
              </div>
              <canvas :id="`graphiqueCateg_` + ongletActive + '_' + index"></canvas>
            </div>
            <div class="activity_main_semaine_indiv_defis">
              <div class="activity_main_semaine_indiv_defis_content">
                <p class="title">Les défis</p>
                <p class="subtitle">Participe à nos défis pour t’aider à réduire ton empreinte carbone et à gagner des trophées ! </p>
                <Button label="Voir tous les défis" noArrow="true" url="Challenges"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="activity_main_annee" v-if="ongletActive === 3">
        <div class="activity_main_mois_indiv" v-for="(item,index) in state.arrayTransacYear">
          <div v-if="index  === semaineActive" class="content">
            <div class="activity_main_semaine_indiv_header">
              <div class="prev" @click="semaineActive - 1 !== -1 ? semaineActive = semaineActive - 1 : null">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0227 3.64498C12.2224 3.84468 12.2406 4.15717 12.0772 4.37738L12.0227 4.44047L7.17075 9.29272L12.0227 14.145C12.2224 14.3447 12.2406 14.6572 12.0772 14.8774L12.0227 14.9405C11.823 15.1402 11.5105 15.1583 11.2903 14.9949L11.2273 14.9405L5.97725 9.69047C5.77755 9.49077 5.7594 9.17827 5.92279 8.95807L5.97725 8.89498L11.2273 3.64498C11.4469 3.42531 11.8031 3.42531 12.0227 3.64498Z" fill="#191B1F"/>
                </svg>
              </div>
              <p v-if="index === 0">Cette année</p>
              <p v-if="index === 1">L'année dernière</p>
              <p v-if="index === 2">Il y a trois ans</p>
              <div class="next"  @click="semaineActive + 1 !== 3 ? semaineActive = semaineActive + 1 : null">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.97725 14.9405C5.77755 14.7408 5.7594 14.4283 5.92279 14.2081L5.97725 14.145L10.8293 9.29272L5.97725 4.44047C5.77755 4.24077 5.7594 3.92827 5.92279 3.70807L5.97725 3.64498C6.17695 3.44528 6.48945 3.42712 6.70966 3.59051L6.77275 3.64498L12.0227 8.89498C12.2224 9.09468 12.2406 9.40718 12.0772 9.62738L12.0227 9.69047L6.77275 14.9405C6.55308 15.1601 6.19692 15.1601 5.97725 14.9405Z" fill="#191B1F"/>
                </svg>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_value">
              <p class="empreinte"><span>{{countEmpreinte(item)}}</span> kg(s) de CO2</p>
              <p class="subtitle">Sous la moyenne FR de 692 kgs CO2/semaine</p>
              <Button noArrow='true' label="Voir toutes mes dépenses" url="Transaction" />
            </div>
            <div class="activity_main_semaine_indiv_repartition">
              <p class="title">Répartition de l’empreinte CO2 sur les jours de la semaine :</p>
              <div class="activity_main_semaine_indiv_repartition_card">
                <div class="activity_main_semaine_indiv_repartition_card_left">
                  <p class="value">{{ moyenneJour(item,'moyenne') }} KG de CO2</p>
                  <p>Moyenne</p>
                </div>
                <div class="activity_main_semaine_indiv_repartition_card_right">
                  <p class="value">{{ moyenneJour(item,'bestScore') }} KG de CO2</p>
                  <p>Meilleur score</p>
                </div>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_chartJour">
              <canvas :id="`graphique_` + ongletActive + '_' + index"></canvas>
            </div>
            <div class="activity_main_semaine_indiv_tips">
              <div class="activity_main_semaine_indiv_tips_content">
                <div class="activity_main_semaine_indiv_tips_content_list">
                  <div
                      v-for="(item, i) in tips"
                      :key="'tip' + i"
                      class="activity_main_semaine_indiv_tips_content_list_item"
                      :class="item.backgroundColor"
                  >
                    <div class="activity_main_semaine_indiv_tips_content_list_item_title">
                      <p>
                        {{ item.title }}
                        <span v-if="item.infosupp != ''">- {{ item.infosupp }}</span>
                      </p>
                    </div>
                    <div class="activity_main_semaine_indiv_tips_content_list_item_subtitle">
                      <p>{{ item.subtitle }}</p>
                    </div>
                    <div class="activity_main_semaine_indiv_tips_content_list_item_button">
                      <Button
                          :label="item.buttonLabel"
                          :url="item.url"
                          noArrow="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="activity_main_semaine_indiv_chartCateg">
              <div class="activity_main_semaine_indiv_chartCateg_title">
                <p>Répartition de l’empreinte CO2 en fonction des catégories de dépenses :</p>
              </div>
              <canvas :id="`graphiqueCateg_` + ongletActive + '_' + index"></canvas>
            </div>
            <div class="activity_main_semaine_indiv_defis">
              <div class="activity_main_semaine_indiv_defis_content">
                <p class="title">Les défis</p>
                <p class="subtitle">Participe à nos défis pour t’aider à réduire ton empreinte carbone et à gagner des trophées ! </p>
                <Button label="Voir tous les défis" noArrow="true" url="Challenges"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.activity{
  width: 90%;
  margin: 0 auto;
  &_header{
    h1{
      font-size: 20px;
      padding: 25px 0;
      font-weight: 600;
    }
  }
  &_main{
    &_menu{
      display: flex;
      border-bottom: 1px solid #CBCBDD;
      position: relative;
      &_indiv{
        flex: 0 0 33%;
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
        width: 33%;
        background-color: #3B63DB;
        height: 4px;
        transition: .3s all ease;
        &.position_1{
          transform: translateX(0%);
        }
        &.position_2{
          transform: translateX(100%);
        }
        &.position_3{
          transform: translateX(200%);
        }
      }
    }
    &_semaine,&_mois, &_annee{
      &_indiv{
        &_header{
          display: flex;
          justify-content: space-between;
          padding: 35px 0;
          p{
            font-weight: 700;
            font-size: 14px;
          }
        }
        &_value{
          text-align: center;
          p{
            font-size: 12px;
            font-weight: 400;
            &.empreinte{
              font-weight: 600;
              font-size: 16px;
              span{
                font-size: 40px;
              }
            }
            &.subtitle{
              margin-bottom: 15px;
            }
          }
        }
        &_repartition{
          padding: 20px 0;
          .title{
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
          }
          &_card{
            background: #FFFFFF;
            box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            padding: 15px;
            display: flex;
            &_left {
              width: 50%;
              border-right: 1px solid #EFF5FF;
            }
            &_right{
              padding-left: 15px;
            }
            &_left, &_right{
              p{
                font-size: 12px;
                font-weight: 400;
                &.value{
                  font-weight: 600;
                }
              }
            }
          }
        }
        &_chartJour{
          margin: 30px 0;
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
        &_chartCateg{
          padding: 30px 0;
          &_title{
            p{
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 15px;
            }
          }
        }
        &_defis{
          padding: 30px 0;
          &_content{
            padding: 15px;
            background: #FFFFFF;
            box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            .title{
              font-weight: 700;
              margin-bottom: 15px;
              font-size: 16px;
            }
            .subtitle{
              font-size: 14px;
              font-weight: 400;
              margin-bottom: 25px;
            }
            button{
              background-color: #3B63DB;
              color: white;
            }
          }
        }
      }
    }
  }
}
</style>
