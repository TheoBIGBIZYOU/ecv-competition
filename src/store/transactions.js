import { defineStore } from 'pinia'

export const useTransactionsStore = defineStore('transations', {
    state: () => ({
        transactions: null,
        categories : null
    }),
    actions: {
        setupTransations(transactions) {
            this.transactions = Array.from(transactions)
            // this.updateCatArray(this.categories, this.transactions);
        },
        // updateCatArray(categories,transactions){
        //     transactions.forEach((e)=>{
        //         console.log(e.category)
        //     })
        // }
    },
})
