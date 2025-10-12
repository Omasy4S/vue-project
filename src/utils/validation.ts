/**
 * Утилиты для валидации полей учетных записей
 */

import type { ValidationError, ErrorField } from '@/types/account'

// Максимальная длина полей
const MAX_FIELD_LENGTH = 100

/**
 * Валидация логина
 */
export function validateLogin(login: string): ValidationError | null {
  if (!login || login.trim() === '') {
    return { field: 'login', message: 'Обязательное поле' }
  }
  if (login.length > MAX_FIELD_LENGTH) {
    return { field: 'login', message: 'Не более 100 символов' }
  }
  return null
}

/**
 * Валидация пароля (только для локальных учетных записей)
 */
export function validatePassword(password: string | null): ValidationError | null {
  if (!password || password.trim() === '') {
    return { field: 'password', message: 'Обязательное поле' }
  }
  if (password.length > MAX_FIELD_LENGTH) {
    return { field: 'password', message: 'Не более 100 символов' }
  }
  return null
}

/**
 * Парсинг меток из строки (разделитель ;)
 */
export function parseLabels(input: string): Array<{ text: string }> {
  return input
    .split(';')
    .map(label => label.trim())
    .filter(label => label.length > 0)
    .map(text => ({ text }))
}

/**
 * Преобразование меток в строку для отображения
 */
export function labelsToString(labels: Array<{ text: string }>): string {
  return labels.map(l => l.text).join('; ')
}
