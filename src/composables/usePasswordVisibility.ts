/**
 * Композабл для управления видимостью паролей
 */

import { ref, type Ref } from 'vue'

export function usePasswordVisibility() {
  // Хранилище состояний видимости для каждого ID
  const visibilityMap: Ref<Record<string, boolean>> = ref({})

  /**
   * Переключить видимость пароля
   */
  const toggle = (id: string): void => {
    visibilityMap.value[id] = !visibilityMap.value[id]
  }

  /**
   * Проверить, виден ли пароль
   */
  const isVisible = (id: string): boolean => {
    return visibilityMap.value[id] || false
  }

  return {
    toggle,
    isVisible
  }
}
