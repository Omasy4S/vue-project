<script setup lang="ts">
/**
 * Компонент строки учетной записи в таблице
 * Отображает и редактирует одну учетную запись
 */

// ============================================================================
// IMPORTS
// ============================================================================
import { computed } from 'vue'
import { ElInput, ElSelect, ElOption, ElButton, ElIcon } from 'element-plus'
import { Delete, View, Hide } from '@element-plus/icons-vue'
import type { Account } from '@/types/account'
import { useAccountsStore } from '@/stores/accounts'
import { parseLabels, labelsToString } from '@/utils/validation'

// ============================================================================
// PROPS & EMITS
// ============================================================================
interface Props {
  account: Account
  passwordVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  togglePassword: []
  remove: []
}>()

// ============================================================================
// COMPOSABLES
// ============================================================================
const store = useAccountsStore()

// ============================================================================
// COMPUTED
// ============================================================================
const labelsString = computed(() => labelsToString(props.account.labels))

const loginError = computed(() => 
  props.account.errorFields.includes('login') 
    ? store.getErrorMessage(props.account.id, 'login') 
    : null
)

const passwordError = computed(() => 
  props.account.errorFields.includes('password') 
    ? store.getErrorMessage(props.account.id, 'password') 
    : null
)

// ============================================================================
// METHODS
// ============================================================================
const handleLabelsInput = (value: string) => {
  const labels = parseLabels(value)
  store.updateLabels(props.account.id, labels)
}

const handleTypeChange = (value: string) => {
  store.updateType(props.account.id, value as 'LDAP' | 'Локальная')
}

const handleLoginInput = (value: string) => {
  store.updateLogin(props.account.id, value)
}

const handlePasswordInput = (value: string) => {
  store.updatePassword(props.account.id, value)
}
</script>

<template>
  <tr class="account-row">
    <!-- Метки -->
    <td class="account-cell">
      <ElInput
        :model-value="labelsString"
        @input="handleLabelsInput"
        placeholder="Введите метки через ;"
        maxlength="200"
      />
    </td>

    <!-- Тип записи -->
    <td class="account-cell">
      <ElSelect
        :model-value="account.type"
        @change="handleTypeChange"
        placeholder="Выберите тип"
        style="width: 100%"
      >
        <ElOption label="LDAP" value="LDAP" />
        <ElOption label="Локальная" value="Локальная" />
      </ElSelect>
    </td>

    <!-- Логин -->
    <td class="account-cell">
      <ElInput
        :model-value="account.login"
        @input="handleLoginInput"
        placeholder="Введите логин"
        maxlength="100"
        :class="{ 'is-error': loginError }"
      />
      <div v-if="loginError" class="error-message">
        {{ loginError }}
      </div>
    </td>

    <!-- Пароль -->
    <td class="account-cell">
      <div v-if="account.type === 'Локальная'" class="password-wrapper">
        <ElInput
          :model-value="account.password || ''"
          @input="handlePasswordInput"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="Введите пароль"
          maxlength="100"
          :class="{ 'is-error': passwordError }"
        >
          <template #suffix>
            <ElIcon 
              class="password-icon" 
              @click="emit('togglePassword')"
            >
              <View v-if="passwordVisible" />
              <Hide v-else />
            </ElIcon>
          </template>
        </ElInput>
        <div v-if="passwordError" class="error-message">
          {{ passwordError }}
        </div>
      </div>
      <span v-else class="password-placeholder">—</span>
    </td>

    <!-- Действия -->
    <td class="account-cell actions-cell">
      <ElButton
        type="danger"
        :icon="Delete"
        circle
        @click="emit('remove')"
        title="Удалить запись"
      />
    </td>
  </tr>
</template>

<style scoped>
/**
 * Стили для строки учетной записи
 */

.account-row {
  background: #ffffff;
  transition: all 0.3s ease;
}

.account-row:hover {
  background: #f5f7fa;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.account-cell {
  padding: 16px 12px;
  vertical-align: top;
}

.actions-cell {
  text-align: center;
  vertical-align: middle;
}

/* Обертка для пароля с иконкой */
.password-wrapper {
  position: relative;
}

.password-icon {
  cursor: pointer;
  font-size: 18px;
  color: #909399;
  transition: color 0.3s;
}

.password-icon:hover {
  color: #409eff;
}

.password-placeholder {
  color: #c0c4cc;
  font-size: 14px;
}

/* Сообщения об ошибках */
.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.4;
}

/* Стили для полей с ошибками */
:deep(.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

:deep(.is-error .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

:deep(.is-error.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}
</style>
