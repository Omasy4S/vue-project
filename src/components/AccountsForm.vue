<script setup lang="ts">
/**
 * Главный компонент формы управления учетными записями
 * Координирует работу всех дочерних компонентов
 */

// ============================================================================
// IMPORTS
// ============================================================================
import { computed } from 'vue'
import { ElCard, ElButton, ElAlert, ElIcon } from 'element-plus'
import { Plus, InfoFilled } from '@element-plus/icons-vue'
import AccountsTable from './AccountsTable.vue'
import { useAccountsStore } from '@/stores/accounts'

// ============================================================================
// COMPOSABLES
// ============================================================================
const store = useAccountsStore()

// ============================================================================
// COMPUTED
// ============================================================================
const accountsCount = computed(() => store.accountsCount)
const hasInvalidAccounts = computed(() => store.hasInvalidAccounts)

// ============================================================================
// METHODS
// ============================================================================
const handleAddAccount = () => {
  store.addAccount()
}
</script>

<template>
  <div class="accounts-form-container">
    <!-- Карточка с формой -->
    <ElCard class="accounts-card" shadow="hover">
      <!-- Заголовок с кнопкой добавления -->
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h2 class="title">Учетные записи</h2>
            <span v-if="accountsCount > 0" class="accounts-count">
              {{ accountsCount }} {{ accountsCount === 1 ? 'запись' : accountsCount < 5 ? 'записи' : 'записей' }}
            </span>
          </div>
          <ElButton
            type="primary"
            :icon="Plus"
            @click="handleAddAccount"
            size="large"
            round
          >
            Добавить запись
          </ElButton>
        </div>
      </template>

      <!-- Предупреждение о невалидных записях -->
      <ElAlert
        v-if="hasInvalidAccounts"
        title="Внимание"
        type="warning"
        description="Некоторые учетные записи содержат ошибки. Проверьте обязательные поля."
        :closable="false"
        show-icon
        class="validation-alert"
      />

      <!-- Информационное сообщение -->
      <ElAlert
        title="Подсказка"
        type="info"
        :closable="false"
        class="info-alert"
      >
        <template #default>
          <div class="info-content">
            <ElIcon class="info-icon"><InfoFilled /></ElIcon>
            <span>
              Для указания нескольких меток используйте разделитель <strong>;</strong> (точка с запятой).
              Например: <code>Метка1; Метка2; Метка3</code>
            </span>
          </div>
        </template>
      </ElAlert>

      <!-- Таблица учетных записей -->
      <AccountsTable />
    </ElCard>
  </div>
</template>

<style scoped>
/**
 * Стили для главного компонента формы
 */

.accounts-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Карточка */
.accounts-card {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 32px;
  border-bottom: none;
}

:deep(.el-card__body) {
  padding: 32px;
}

/* Заголовок карточки */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.accounts-count {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  backdrop-filter: blur(10px);
}

/* Алерты */
.validation-alert {
  margin-bottom: 20px;
  border-radius: 8px;
}

.info-alert {
  margin-bottom: 24px;
  border-radius: 8px;
  background: #f0f9ff;
  border-color: #bfdbfe;
}

.info-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  line-height: 1.6;
}

.info-icon {
  flex-shrink: 0;
  font-size: 18px;
  margin-top: 2px;
}

.info-content code {
  padding: 2px 6px;
  background: #e0f2fe;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #0369a1;
}

/* Адаптивность */
@media (max-width: 768px) {
  .accounts-form-container {
    padding: 16px 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .title {
    font-size: 24px;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  .info-content {
    flex-direction: column;
    gap: 8px;
  }
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.accounts-card {
  animation: fadeIn 0.5s ease-out;
}
</style>

