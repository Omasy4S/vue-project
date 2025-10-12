/**
 * Типы для системы управления учетными записями
 */

// Метка учетной записи
export interface Label {
  text: string
}

// Тип учетной записи
export type AccountType = 'LDAP' | 'Локальная'

// Поля с ошибками валидации
export type ErrorField = 'login' | 'password'

// Интерфейс учетной записи
export interface Account {
  id: string // Уникальный идентификатор
  labels: Label[]
  type: AccountType
  login: string
  password: string | null
  errorFields: ErrorField[]
}

// Ошибки валидации
export interface ValidationError {
  field: ErrorField
  message: string
}
