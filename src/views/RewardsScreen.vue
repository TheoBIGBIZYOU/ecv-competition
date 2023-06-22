<script setup>



import {useRouter} from "vue-router";
import {computed, reactive, ref} from "vue";
import Menu from "../components/Menu.vue";
import { useTransactionsStore } from "../store/transactions.js";

const router = useRouter();
const userLevel = ref();
const restOfPoints = ref();
const pourcentLevel = ref();
const pointsNextLevel = ref();


const transactionsStore = useTransactionsStore();

const state = reactive({
  userPoints: computed(() => transactionsStore.userPoints),
})

const continueBtn = () => {
  router.push({ name: "Home" });
}

const levels = [
  {
    title: "Niveau 1 - 50 points",
    tabRecompenses: [
      {
        name: 'Croc Book',
        montant: 'Carte cadeau de 20€',
        description: 'Dans tous les magasins',
        note: '5',
        nombreAvis: '44 avis',
        image: 'crocbook.png'
      },
      {
        name: 'Aromazone',
        montant: 'Carte cadeau de 20€',
        description: 'Sur le site internet',
        image: 'aromazone.png'
      },
    ]
  },
  {
    title: "Niveau 2 - 100 points",
    tabRecompenses: [
      {
        name: 'Croc Book',
        montant: 'Carte cadeau de 20€',
        description: 'Dans tous les magasins',
        note: '4',
        nombreAvis: '44 avis',
        image: 'crocbook.png'
      },
      {
        name: 'Aromazone',
        montant: 'Carte cadeau de 20€',
        description: 'Sur le site internet',
        image: 'aromazone.png'
      },
    ]
  },
  {
    title: "Niveau 3 - 150 points",
    tabRecompenses: [
      {
        name: 'Croc Book',
        montant: 'Carte cadeau de 20€',
        description: 'Dans tous les magasins',
        note: '3',
        nombreAvis: '44 avis',
        image: 'crocbook.png'
      },
      {
        name: 'Aromazone',
        montant: 'Carte cadeau de 20€',
        description: 'Sur le site internet',
        image: 'aromazone.png'
      },
    ]
  },
  {
    title: "Niveau 4 - 200 points",
    tabRecompenses: [
      {
        name: 'Croc Book',
        montant: 'Carte cadeau de 20€',
        description: 'Dans tous les magasins',
        note: '2',
        nombreAvis: '44 avis',
        image: 'crocbook.png'
      },
      {
        name: 'Aromazone',
        montant: 'Carte cadeau de 20€',
        description: 'Sur le site internet',
        image: 'aromazone.png'
      },
    ]
  },
  {
    title: "Niveau 5 - 250 points",
    tabRecompenses: [
      {
        name: 'Croc Book',
        montant: 'Carte cadeau de 20€',
        description: 'Dans tous les magasins',
        note: '2',
        nombreAvis: '44 avis',
        image: 'crocbook.png'
      },
      {
        name: 'Aromazone',
        montant: 'Carte cadeau de 20€',
        description: 'Sur le site internet',
        image: 'aromazone.png'
      },
    ]
  },
];

function getLevel(points){
  const levels = {
    0: 0,
    1: 50,
    2: 100,
    3: 150,
    4: 200,
    5: 250,
  };

  let level = 0;
  let nextLevelPoints = 0;
  let progress = 0;
  let restPoints = 0;
  for (let i = 1; i <= Object.keys(levels).length; i++) {
    if (points <= levels[i]) {
      level = i;
      nextLevelPoints = levels[i];
      restPoints = nextLevelPoints - points;
      progress = (points - levels[i - 1]) / (nextLevelPoints - levels[i - 1]) * 100;
      break;
    }
    else{
      level = 5;
      progress = 100;
    }
  }
  userLevel.value = level;
  restOfPoints.value = restPoints;
  pourcentLevel.value = progress + '%';
  pointsNextLevel.value = nextLevelPoints;
}
getLevel(state.userPoints)

function goTo(url) {
  router.push({ name: url });
}

</script>

<template>
  <div class="recompenses">
    <div class="recompenses_header">
      <div class="recompenses_header_main">
        <div class="recompenses_header_main_title">
          <h1>Mes récompenses</h1>
        </div>
        <div class="recompenses_header_main_content">
          <div class="recompenses_header_main_content_top">
            <div class="recompenses_header_main_content_top_left">
              <div class="recompenses_header_main_content_top_left_objectif">
                <p>{{ state.userPoints }}</p>
                <div class="circle"></div>
              </div>
              <div class="recompenses_header_main_content_top_left_text">
                <p class="point">{{ state.userPoints }} points</p>
                <p>= {{ (state.userPoints * 0.003333).toFixed(2) }} €</p>
              </div>
            </div>
            <div class="recompenses_header_main_content_top_right">
              <div class="recompenses_header_main_content_top_right_image">
                <img src="../assets/img/recompenses/trophee.svg" alt="">
              </div>
              <div class="recompenses_header_main_content_top_right_text">
                <p class="point">Petit Bambou</p>
                <p>2 trophées gagnés</p>
              </div>
            </div>
          </div>
          <div class="recompenses_header_main_content_bottom" @click="goTo('History')">
            <p>Voir mon historique</p>
          </div>
        </div>
      </div>
    </div>
    <div class="recompenses_main">
      <div class="recompenses_main_level">
        <p>Niveau {{userLevel}}</p>
        <div class="recompenses_main_level_jauge">
          <div class="recompenses_main_level_jauge_progress" :style="`width:` + pourcentLevel"></div>
        </div>
        <p class="nextLevel">Plus que {{restOfPoints}} points pour atteindre le prochain niveau</p>
      </div>
      <div class="recompenses_main_list">
        <div class="recompenses_main_list_item " v-for="(item,index) in levels"  :class="userLevel < index + 1 ? 'disable' : null ">
          <div class="recompenses_main_list_item_title">
            <p>{{ item.title }}</p>
          </div>
          <div class="recompenses_main_list_item_recompenses_list">
            <div class="recompenses_main_list_item_recompenses_list_item" v-for="recomp in item.tabRecompenses">
              <div class="recompenses_main_list_item_recompenses_list_item_image">
                <img :src="`/src/assets/img/recompenses/partenaire/${recomp.image}`" alt="">
              </div>
              <div class="recompenses_main_list_item_recompenses_list_item_description">
                <p class="name">{{ recomp.name }}</p>
                <p class="montant">{{ recomp.montant }}</p>
                <p class="description">{{ recomp.description }}</p>
                <div class="note" v-if="recomp.note">
                  <div :class="'stars star_' + recomp.note">
                    <svg v-for="i in 5" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.4525 8.3535C10.3014 8.49991 10.232 8.71166 10.2664 8.91933L10.785 11.7893C10.8288 12.0326 10.7261 12.2787 10.5225 12.4193C10.323 12.5652 10.0576 12.5827 9.84001 12.466L7.25643 11.1185C7.1666 11.0707 7.06685 11.045 6.96476 11.0421H6.80668C6.75185 11.0502 6.69818 11.0677 6.64918 11.0946L4.06501 12.4485C3.93726 12.5127 3.7926 12.5354 3.65085 12.5127C3.30551 12.4473 3.0751 12.1183 3.13168 11.7712L3.65085 8.90125C3.68526 8.69183 3.61585 8.47891 3.46476 8.33016L1.35835 6.2885C1.18218 6.11758 1.12093 5.86091 1.20143 5.62933C1.2796 5.39833 1.4791 5.22975 1.72001 5.19183L4.61918 4.77125C4.83968 4.7485 5.03335 4.61433 5.13251 4.416L6.41001 1.79683C6.44035 1.7385 6.47943 1.68483 6.52668 1.63933L6.57918 1.5985C6.6066 1.56816 6.6381 1.54308 6.6731 1.52266L6.73668 1.49933L6.83585 1.4585H7.08143C7.30076 1.48125 7.49385 1.6125 7.59476 1.8085L8.88918 4.416C8.98251 4.60675 9.16393 4.73916 9.37335 4.77125L12.2725 5.19183C12.5175 5.22683 12.7223 5.396 12.8033 5.62933C12.8798 5.86325 12.8138 6.11991 12.6342 6.2885L10.4525 8.3535Z" fill="#FFB72A"/>
                    </svg>
                  </div>
                  <p>{{ recomp.nombreAvis }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Menu/>
  </div>
</template>

<style lang="scss">
.recompenses{
  &_header{
    background-color: #FFFFFF;
    box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
    padding: 25px 0;
    &_main{
      width: 90%;
      margin: 0 auto;
      &_title{
        margin-bottom: 15px;
      }
      &_content{
        background: #FFFFFF;
        box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        padding: 0 20px;
        &_top{
          display: flex;
          align-items: center;
          padding: 15px 0;
          &_left{
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 50%;
            padding-right: 15px;
            border-right: 1px solid #EFF5FF;
            &_text{
              p{
                font-size: 12px;
                font-weight: 400;
              }
              .point{
                font-size: 16px;
                font-weight: 600;
              }
            }
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
          &_right{
            padding-left: 15px;
            display: flex;
            align-items: center;
            gap: 1rem;
            &_text{
              p{
                font-size: 12px;
                font-weight: 400;
              }
              .point{
                font-size: 16px;
                font-weight: 600;
              }
            }
          }
        }
        &_bottom{
          border-top: 1px solid #EFF5FF;
          padding: 15px 0;
          position: relative;
          p{
            font-size: 14px;
            font-weight: 700;
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
  }
  &_main{
    text-align: center;
    padding: 15px 5%;
    &_level{
      p{
        font-size: 12px;
        color: #52526B;
        margin-bottom: 10px;
        &.nextLevel{
          margin-top: 10px;
        }
      }
      &_jauge{
        width: 100%;
        height: 8px;
        background-color: #CBCBDD;
        border-radius: 32px;
        &_progress{
          background-color: #FFB72A;
          border-radius: 32px;
          padding: 4px 10px;
          text-align: right;
          color: #fff;
          max-width: 100%;
        }
      }
    }
    &_list{
      text-align: left;
      padding: 30px 0;
      &_item{
        margin-bottom: 15px;
        &.disable{
          opacity: .25;
        }
        &_title{
          margin-bottom: 10px;
          p{
            font-weight: 600;
            font-size: 12px;
          }
        }
        &_recompenses{
          width: 48%;
          display: flex;
          &_list{
            display: flex;
            justify-content: space-between;
            &_item{
              width: 48%;
              background: #FFFFFF;
              box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
              border-radius: 10px;
              padding: 15px;
              &_image{
                img{
                  width: 100%;
                }
              }
              &_description{
                .name{
                  font-weight: 700;
                  font-size: 12px;
                }
                .montant{
                  font-size: 12px;
                  font-weight: 400;
                }
                .description{
                  font-weight: 400;
                  font-size: 10px;
                }
                .note{
                  display: flex;
                  gap: .5rem;
                  align-items: center;
                  p{
                    font-size: 10px;
                    font-weight: 400;
                  }
                  .star_4{
                    svg:nth-child(n + 5){
                      path{
                        fill: var(--grey);
                      }
                    }
                  }
                  .star_3{
                    svg:nth-child(n + 4){
                      path{
                        fill: var(--grey);
                      }
                    }
                  }
                }
                .star_2{
                  svg:nth-child(n + 3){
                    path{
                      fill: var(--grey);
                    }
                  }
                }
                .star_1{
                  svg:nth-child(n + 2){
                    path{
                      fill: var(--grey);
                    }
                  }
                }
                .star_0{
                  svg:nth-child(n + 1){
                    path{
                      fill: var(--grey);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>