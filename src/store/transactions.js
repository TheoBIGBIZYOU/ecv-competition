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
            this.updatePartArray(this.transactions);
        },
        updateCatArray(categories,transactions){
            transactions.forEach((e)=>{
                //create categories array
                if(!categories.some(category => category.label === e.category)) {
                    categories.push({
                        'label': e.category,
                        'color': e.category_color
                    })
                }
                console.log(!categories.includes(e.category));
            })
        },
        updatePartArray(transactions){
            this.partenairesTransactions = [];
            //create partenaire array
            transactions.forEach((e)=>{
                if(e.clean_description.includes('Paypal')){
                    this.partenairesTransactions.push({
                        'transaction': e,
                        'points': 10
                    })
                }
                else if(e.clean_description.includes('Biocoop')){
                    this.partenairesTransactions.push({
                        'transaction': e,
                        'points': 50
                    })
                }
                else if(e.clean_description.includes('Leclerc')){
                    this.partenairesTransactions.push({
                        'transaction': e,
                        'points': 20
                    })
                }
                this.countPoint(this.partenairesTransactions);
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
