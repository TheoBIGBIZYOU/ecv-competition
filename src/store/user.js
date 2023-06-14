import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        accessToken: null
    }),
    actions: {
        setupAccessToken(accessToken) {
            this.accessToken = accessToken
        },
    }
})
