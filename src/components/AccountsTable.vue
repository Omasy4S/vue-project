<script setup lang="ts">
/**
 * Компонент таблицы учетных записей
 * Отображает список всех учетных записей
 */

// ============================================================================
// IMPORTS
// ============================================================================
import { computed } from 'vue'
import { ElEmpty } from 'element-plus'
import AccountRow from './AccountRow.vue'
import { useAccountsStore } from '@/stores/accounts'
import { usePasswordVisibility } from '@/composables/usePasswordVisibility'

// ============================================================================
// COMPOSABLES
// ============================================================================
const store = useAccountsStore()
const { toggle, isVisible } = usePasswordVisibility()

// ============================================================================
// COMPUTED
// ============================================================================
const hasAccounts = computed(() => store.accountsCount > 0)

// ============================================================================
// METHODS
// ============================================================================
const handleRemove = (id: string) => {
  store.removeAccount(id)
}

const handleTogglePassword = (id: string) => {
  toggle(id)
}
</script>

<template>
  <div class="accounts-table-container">
    <!-- Таблица с учетными записями -->
    <table v-if="hasAccounts" class="accounts-table">
      <thead>
        <tr>
          <th class="table-header">Метки</th>
          <th class="table-header">Тип записи</th>
          <th class="table-header">Логин</th>
          <th class="table-header">Пароль</th>
          <th class="table-header actions-header"></th>
        </tr>
      </thead>
      <tbody>
        <AccountRow
          v-for="account in store.accounts"
          :key="account.id"
          :account="account"
          :password-visible="isVisible(account.id)"
          @toggle-password="handleTogglePassword(account.id)"
          @remove="handleRemove(account.id)"
        />
      </tbody>
    </table>

    <!-- Пустое состояние -->
    <ElEmpty
      v-else
      description="Нет учетных записей"
      class="empty-state"
    >
      <template #image>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="50" fill="#f5f7fa" />
          <path
            d="M60 35v50M35 60h50"
            stroke="#c0c4cc"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>
      </template>
    </ElEmpty>
  </div>
</template>

<style scoped>
/**
 * Стили для таблицы учетных записей
 */

.accounts-table-container {
  margin-top: 24px;
  min-height: 300px;
}

/* Таблица */
.accounts-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
}

/* Заголовки таблицы */
.table-header {
  padding: 12px 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  background: transparent;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.actions-header {
  width: 80px;
  text-align: center;
}

/* Пустое состояние */
.empty-state {
  padding: 60px 20px;
}

:deep(.el-empty__description) {
  font-size: 16px;
  color: #909399;
  margin-top: 16px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .accounts-table {
    font-size: 14px;
  }

  .table-header {
    font-size: 12px;
    padding: 8px;
  }
}
</style>
