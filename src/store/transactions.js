import { defineStore } from 'pinia'
import {Preferences} from "@capacitor/preferences";

export const useTransactionsStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        categories : [],
        partenairesTransactions : [],
        userPoints : 0,
    }),
    actions: {
        setupTransactions(transactions) {
            this.transactions = Array.from(transactions)
            this.updateCatArray(this.categories, this.transactions);
            this.updatePartArray(this.partenairesTransactions, this.transactions);
            console.log(state.partenairesTransactions);
            console.log('salut');
        },
        updateCatArray(categories,transactions){
            transactions.forEach((e)=>{
                //create categories array
                if(!categories.includes(e.category)) {
                    this.categories.push({
                        'label': e.category,
                        'color': e.category_color
                    })
                }
            })
        },
        updatePartArray(partenaires, transactions){
            partenaires = [];
            //create partenaire array
            transactions.forEach((e)=>{
                if(e.clean_description.includes('Paypal')){
                    partenaires.push({
                        'transaction': e.category,
                        'points': 10
                    })
                }
                if(e.clean_description.includes('Biocoop')){
                    partenaires.push({
                        'transaction': e.category,
                        'points': 50
                    })
                }
                if(e.clean_description.includes('Leclerc')){
                    partenaires.push({
                        'transaction': e.category,
                        'points': 20
                    })
                }
                console.log("tt");
                this.countPoint(partenaires);
            })
        },
        countPoint(array) {
            let points = 0;
            array.forEach((e) =>{
                points += e.points
            })
            this.userPoints = points;
        }
    },
})
