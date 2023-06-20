import { defineStore } from 'pinia'

export const useTransactionsStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        categories : []
    }),
    actions: {
        setupTransactions(transactions) {
            this.transactions = Array.from(transactions)
            this.updateCatArray(this.categories, this.transactions);
        },
        updateCatArray(categories,transactions){
            transactions.forEach((e)=>{
                if(!categories.includes(e.category)) this.categories.push(e.category)
            })
        }
    },
})
