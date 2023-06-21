<script setup>
import { onMounted, ref } from "vue";
import { Preferences } from "@capacitor/preferences";

const datas = [
  {
    pretitle: "L’empreinte carbone c’est quoi ?",
    title: "L’empreinte carbone c’est quoi ?",
    description:
      "L’empreinte carbone est un indicateur qui permet de mesurer l’impact de l'activité humaine sur l’environnement en se basant sur les émissions de gaz à effet de serre. Le CO2, ou dioxyde de carbone, est le gaz à effet de serre le plus connu de tous, il est émis lors de la combustion d’énergies fossiles (pétrole, gaz, charbon).<br>Par exemple lorsque nous utilisons notre voiture ou prenons le bus pour nous déplacer, nous participons tous à la libération d'une certaine quantité de CO2 dans l'atmosphère. Ces gaz s’accumulent et conduisent à ce que l’on nomme l’effet de serre, responsable du réchauffement climatique.",
    image: "first",
    link: false,
  },
  {
    pretitle: "Pourquoi calculer son empreinte carbone ?",
    title: "Pourquoi calculer son empreinte carbone ?",
    description:
      "Le réchauffement global de la planète s’accélére et pourrait dépasser les +4 degrés (par rapport au niveau de 1990) en 2100 si nous ne changeons pas nos façons de vivre. Mais, comment savoir par quoi commencer ?<br>Chacun peut agir à son niveau en calculant ses propres émissions de gaz à effet de serre : un individu, une entreprise, un état.<br>Un premier pas pour comprendre la manière dont nos habitudes de consommations sont liées aux émissions de co2.",
    image: "second",
    link: false,
  },
  {
    pretitle: "Pourquoi ma banque m’accompagne dans cette démarche ?",
    title: "Pourquoi ma banque m’accompagne dans cette démarche ?",
    description:
      "Nous sommes particulièrement sensibles à l’impact de nos activités bancaires sur l’environnement.<br>Nos derniers engagements :<br>L’intégralité de nos investissements et une partie de nos bénéfices, sont alloués à des projets concrets alignés avec la transition vers une économie plus bas carbone.<br>Nous proposons à nos salariés de limiter l’empreinte carbone liée à leurs déplacements en généralisant le télétravail à 3 jours / semaines. <br>Faisons ce premier pas ensemble.<br>Nous allons vous poser quelques questions afin d’estimer votre empreinte carbone annuelle.",
    image: null,
    link: true,
  },
];

const alreadySee = ref(false);
const sliderContainer = ref(null);
const visible = ref(true);

const prev = () => {
  sliderContainer.value.scrollLeft -= sliderContainer.value.offsetWidth;
};

const next = () => {
  sliderContainer.value.scrollLeft += sliderContainer.value.offsetWidth;
};

const closeStories = () => {
  visible.value = false;
  Preferences.set({
    key: "storyAlreadySee",
    value: true
  });
};

onMounted(async () => {
  const { value } = await Preferences.get({ key: "storyAlreadySee" });
  alreadySee.value = value;
})
</script>

<template>
  <section id="stories" ref="sliderContainer" v-if="!alreadySee" v-show="visible">
    <article v-for="(data, i) in datas" :key="i" class="story">
      <div :class="'story__steps story__steps' + i">
        <span v-for="(data, i) in datas" :key="'step ' + i"></span>
      </div>
      <div class="preheader">
        <span>{{ data.pretitle }}</span>
        <button class="closeStory" @click="closeStories">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.42015 0.233783L1.42012 0.233783C1.18505 0.233845 0.955339 0.30401 0.760354 0.435308C0.56537 0.566606 0.413973 0.753071 0.325518 0.970864C0.237062 1.18866 0.215569 1.42788 0.263785 1.65795C0.311954 1.8878 0.427511 2.09808 0.595701 2.26196C0.595865 2.26212 0.596029 2.26228 0.596194 2.26244L7.3314 8.99766L0.595929 15.7331C0.482874 15.8419 0.392595 15.972 0.330359 16.116C0.267986 16.2603 0.235035 16.4156 0.233435 16.5728C0.231836 16.7301 0.26162 16.886 0.321045 17.0316C0.380469 17.1771 0.468339 17.3093 0.579508 17.4205C0.690675 17.5317 0.822908 17.6195 0.968461 17.679C1.11401 17.7384 1.26996 17.7682 1.42717 17.7666C1.58438 17.765 1.73969 17.732 1.884 17.6697C2.028 17.6074 2.15816 17.5171 2.2669 17.4041C2.26714 17.4038 2.26737 17.4036 2.26761 17.4033L9.00236 10.6686L15.7371 17.4033C15.7374 17.4036 15.7376 17.4039 15.7379 17.4041C15.8466 17.5172 15.9767 17.6074 16.1207 17.6697C16.265 17.732 16.4203 17.765 16.5775 17.7666C16.7348 17.7682 16.8907 17.7384 17.0363 17.679C17.1818 17.6196 17.314 17.5317 17.4252 17.4205C17.5364 17.3093 17.6242 17.1771 17.6837 17.0316C17.7431 16.886 17.7729 16.7301 17.7713 16.5728C17.7697 16.4156 17.7367 16.2603 17.6744 16.116C17.6121 15.972 17.5218 15.8419 17.4088 15.7331C17.4085 15.7329 17.4083 15.7326 17.408 15.7324L10.6733 8.99766L17.4085 2.26249C17.4087 2.2623 17.4089 2.26212 17.409 2.26193C17.5795 2.09603 17.6959 1.88256 17.7431 1.64942C17.7903 1.41602 17.7659 1.1738 17.6731 0.954499C17.5803 0.735201 17.4234 0.549055 17.223 0.420457C17.0225 0.291859 16.788 0.226807 16.5499 0.233827L16.5499 0.233828C16.2432 0.242967 15.952 0.371063 15.7381 0.591001C15.7379 0.591185 15.7377 0.59137 15.7375 0.591555L9.00236 7.3267L2.26716 0.591511C2.267 0.591343 2.26683 0.591176 2.26667 0.591009C2.15665 0.478049 2.02514 0.388247 1.87987 0.326896C1.73439 0.265453 1.57807 0.233792 1.42015 0.233783Z"
              fill="white"
              stroke="white"
              stroke-width="0.2"
            />
          </svg>
        </button>
      </div>
      <h1>{{ data.title }}</h1>
      <p v-html="data.description"></p>
      <button v-if="data.link" @click="closeStories" class="connectBtn">Je me connecte</button>
      <div v-if="data.image !== null" class="story_img">
          <img :src="'/src/assets/img/stories/' + data.image + '.svg'">
      </div>
    </article>
    <div @click="prev" class="touchableNav touchableLeft"></div>
    <div @click="next" class="touchableNav touchableRight"></div>
  </section>
</template>

<style lang="scss" scoped>
#stories {
  display: flex;
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  overflow-y: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  .story {
    padding: 60px 24px 24px;
    min-width: 100%;
    min-height: 100vh;
    color: #fff;
    scroll-snap-align: start;
    position: relative;
    &:nth-of-type(odd) {
      background-color: var(--blue);
    }
    &:nth-of-type(even) {
      background-color: var(--green);
    }

    button {
      z-index: 99;
      position: relative;
    }

    .preheader {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;

      button {
        background: unset;
        border: 0px;
        width: 17px;
        height: 17px;
      }
    }

    h1 {
      margin-bottom: 12px;
      font-size: 32px;
      line-height: 40px;
    }

    &__steps {
      display: flex;
      height: 2px;
      width: 100%;
      gap: 2px;
      margin-bottom: 20px;

      span {
        background-color: #fff;
        display: inline-block;
        height: 2px;
        flex-grow: 1;
        border-radius: 2px;
      }

      &0 {
        span:not(:first-of-type) {
          opacity: 0.4;
        }
      }
      &1 {
        span:last-of-type {
          opacity: 0.4;
        }
      }
    }
    .connectBtn {
        display: block;
        margin-inline: auto;
        margin-top: 10px;
        width: 100%;
        padding: 18px 0;
        border-radius: 8px;
        color: #fff;
        background-color: var(--black);
        border: 0px;
    }

    &_img {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .touchableNav {
    position: fixed;
    width: 50%;
    height: 100%;
    bottom: 0;
    z-index: 50;

    &.touchableLeft {
      left: 0;
    }
    &.touchableRight {
      right: 0;
    }
  }
}
</style>