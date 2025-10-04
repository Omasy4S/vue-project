import { defineStore } from 'pinia';

export interface Label { text: string; }
export interface Account {
  labels: Label[];
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
  errorFields?: string[];
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount() {
      this.accounts.push({ labels: [], type: 'LDAP', login: '', password: null, errorFields: [] });
    },
    removeAccount(idx: number) {
      this.accounts.splice(idx, 1);
    },
    updateAccount(idx: number, account: Account) {
      this.accounts[idx] = account;
    },
  },
  persist: true
});
