/**
 * Store для управления учетными записями
 * Использует Pinia с персистентностью в localStorage
 */

import { defineStore } from 'pinia'
import type { Account, AccountType, ErrorField, Label } from '@/types/account'
import { validateLogin, validatePassword } from '@/utils/validation'

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Генерация уникального ID для учетной записи
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Проверка валидности учетной записи
 */
function isAccountValid(account: Account): boolean {
  if (account.errorFields.length > 0) return false
  if (!account.login || account.login.trim() === '') return false
  if (account.type === 'Локальная' && (!account.password || account.password.trim() === '')) return false
  return true
}

// ============================================================================
// PINIA STORE
// ============================================================================

export const useAccountsStore = defineStore('accounts', {
  // --------------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------------
  state: () => ({
    accounts: [] as Account[]
  }),

  // --------------------------------------------------------------------------
  // GETTERS
  // --------------------------------------------------------------------------
  getters: {
    /**
     * Количество учетных записей
     */
    accountsCount: (state): number => state.accounts.length,

    /**
     * Есть ли невалидные записи
     */
    hasInvalidAccounts: (state): boolean => {
      return state.accounts.some(acc => acc.errorFields.length > 0)
    },

    /**
     * Только валидные записи
     */
    validAccounts: (state): Account[] => {
      return state.accounts.filter(isAccountValid)
    }
  },

  // --------------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------------
  actions: {
    // ------------------------------------------------------------------------
    // CRUD операции
    // ------------------------------------------------------------------------
    
    /**
     * Добавить новую учетную запись
     */
    addAccount(): void {
      const newAccount: Account = {
        id: generateId(),
        labels: [],
        type: 'LDAP',
        login: '',
        password: null,
        errorFields: []
      }
      this.accounts.push(newAccount)
    },

    /**
     * Удалить учетную запись
     */
    removeAccount(id: string): void {
      const index = this.accounts.findIndex(acc => acc.id === id)
      if (index !== -1) {
        this.accounts.splice(index, 1)
      }
    },

    // ------------------------------------------------------------------------
    // Обновление полей
    // ------------------------------------------------------------------------

    /**
     * Обновить метки
     */
    updateLabels(id: string, labels: Label[]): void {
      const account = this.accounts.find(acc => acc.id === id)
      if (account) {
        account.labels = labels
      }
    },

    /**
     * Обновить тип записи
     */
    updateType(id: string, type: AccountType): void {
      const account = this.accounts.find(acc => acc.id === id)
      if (!account) return

      account.type = type
      
      // При смене на LDAP очищаем пароль и ошибки
      if (type === 'LDAP') {
        account.password = null
        account.errorFields = account.errorFields.filter(f => f !== 'password')
      }
    },

    /**
     * Обновить логин с валидацией
     */
    updateLogin(id: string, login: string): void {
      const account = this.accounts.find(acc => acc.id === id)
      if (!account) return

      account.login = login
      
      // Валидация
      const error = validateLogin(login)
      const hasError = account.errorFields.includes('login')
      
      if (error && !hasError) {
        account.errorFields.push('login')
      } else if (!error && hasError) {
        account.errorFields = account.errorFields.filter(f => f !== 'login')
      }
    },

    /**
     * Обновить пароль с валидацией
     */
    updatePassword(id: string, password: string): void {
      const account = this.accounts.find(acc => acc.id === id)
      if (!account || account.type !== 'Локальная') return

      account.password = password
      
      // Валидация
      const error = validatePassword(password)
      const hasError = account.errorFields.includes('password')
      
      if (error && !hasError) {
        account.errorFields.push('password')
      } else if (!error && hasError) {
        account.errorFields = account.errorFields.filter(f => f !== 'password')
      }
    },

    // ------------------------------------------------------------------------
    // Вспомогательные методы
    // ------------------------------------------------------------------------

    /**
     * Получить сообщение об ошибке
     */
    getErrorMessage(id: string, field: ErrorField): string | null {
      const account = this.accounts.find(acc => acc.id === id)
      if (!account || !account.errorFields.includes(field)) {
        return null
      }

      if (field === 'login') {
        return validateLogin(account.login)?.message || null
      }

      if (field === 'password' && account.type === 'Локальная') {
        return validatePassword(account.password)?.message || null
      }

      return null
    }
  },

  // --------------------------------------------------------------------------
  // PERSIST - Сохранение в localStorage
  // --------------------------------------------------------------------------
  persist: {
    key: 'accounts',
    storage: localStorage,
    serializer: {
      // Сохраняем только валидные записи
      serialize: (state: { accounts: Account[] }) => {
        const validAccounts = state.accounts.filter(isAccountValid)
        return JSON.stringify({ accounts: validAccounts })
      },
      deserialize: (value: string) => {
        return JSON.parse(value)
      }
    }
  }
})
