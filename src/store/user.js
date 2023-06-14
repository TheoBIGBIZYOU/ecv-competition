import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        accessToken: null,
        linkBank: false
    }),
    actions: {
        setupAccessToken(accessToken) {
            this.accessToken = accessToken
        },
        setLinkBank() {
            this.linkBank = true
        }
    }
})
