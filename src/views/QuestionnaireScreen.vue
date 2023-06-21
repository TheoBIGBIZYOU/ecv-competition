<script setup>



import {useRouter} from "vue-router";

const router = useRouter();

const continueBtn = () => {
  router.push({ name: "Home" });
}
</script>

<template>
  <div class="questionnaire">
    <div class="questionnaire_header">
      <h1>Bienvenue !</h1>
      <p>Je m’appelle Coco et je vais t’aider à calculer et réduire ton empreinte carbone. Avant de commencer, je voudrais confirmer avec toi ton pays de résidence. </p>
    </div>
    <div class="questionnaire_coco">
      <img src="../assets/img/coco.png" alt="">
    </div>
    <div class="questionnaire_pays">
      <div class="input">
        <select name="pays" id="pays-select">
          <option value="France">France</option>
          <option value="Anglais">Anglais</option>
          <option value="Allemand">Allemand</option>
          <option value="Russe">Russe</option>
        </select>
      </div>
      <p>Cette donnée va servir à baser le contenu et les statistiques
        utilisés dans toute l’application sur des chiffres les plus précis possible.</p>
    </div>
    <button @click="continueBtn()" class="connectBtn">Je confirme</button>
  </div>
</template>

<style lang="scss">
.questionnaire{
  width: 90%;
  margin: 0 auto;
  &_header{
    margin: 5rem 0;
    background-color: #EFF5FF;
    padding: 16px;
    h1{
      font-weight: 700;
      margin-bottom: 1rem;
    }
  }
  &_pays{
    .input{
      select{
        background: #FFFFFF;
        box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        width: 100%;
        border: unset;
        height: 50px;
        margin-bottom: 1rem;
      }
    }
    p{
      font-size: 10px;
    }
  }
  button.connectBtn{
    display: block;
    margin-inline: auto;
    margin-top: 10px;
    width: 100%;
    padding: 18px 0;
    border-radius: 8px;
    color: #fff;
    background-color: var(--blue);
    border: 0px;
  }
}
</style>