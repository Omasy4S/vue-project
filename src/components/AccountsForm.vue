<script setup lang="ts">
import { reactive } from 'vue'
import { useAccountsStore } from '../stores/accounts'

const store = useAccountsStore()
const passwordVisible = reactive<{ [key: number]: boolean }>({})

const togglePasswordVisibility = (idx: number) => {
  passwordVisible[idx] = !passwordVisible[idx]
}

const addAccount = () => { store.addAccount() }
const removeAccount = (idx: number) => { store.removeAccount(idx) }

function handleLabelBlur(idx: number, e: FocusEvent) {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  const value = target.value
  const labelsArr = value.split(';').map(v => v.trim()).filter(Boolean).map(text => ({ text }))
  const acc = store.accounts[idx]
  if (!acc) return
  store.updateAccount(idx, { ...acc, labels: labelsArr })
}

function handleLoginBlur(idx: number, e: FocusEvent) {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  const value = target.value
  const acc = store.accounts[idx]
  if (!acc) return
  const errorFields = acc.errorFields ? [...acc.errorFields] : []
  // Проверяем обе ошибки: пусто и длина
  if (!value || value.length > 100) {
    if (!errorFields.includes('login')) errorFields.push('login')
  } else {
    const i = errorFields.indexOf('login')
    if (i !== -1) errorFields.splice(i, 1)
  }
  store.updateAccount(idx, { ...acc, login: value, errorFields })
}

function handleTypeChange(idx: number, e: Event) {
  const value = (e.target as HTMLSelectElement).value as 'LDAP' | 'Локальная'
  const acc = store.accounts[idx]
  if (!acc) return
  let newPassword = acc.password
  if (value === 'LDAP') newPassword = null
  store.updateAccount(idx, { ...acc, type: value, password: newPassword })
}

function handlePasswordBlur(idx: number, e: FocusEvent) {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  const value = target.value
  const acc = store.accounts[idx]
  if (!acc) return
  const errorFields = acc.errorFields ? [...acc.errorFields] : []
  if (!value || value.length > 100) {
    if (!errorFields.includes('password')) errorFields.push('password')
  } else {
    const i = errorFields.indexOf('password')
    if (i !== -1) errorFields.splice(i, 1)
  }
  store.updateAccount(idx, { ...acc, password: value, errorFields })
}
</script>

<template>
  <div style="max-width:930px;margin:40px auto;">
    <div style="display:flex;align-items:center;gap:16px;">
      <h2 style="margin:0;font-size:1.5rem;font-weight:600;">Учетные записи</h2>
      <button 
        style="width:38px;height:38px;font-size:1.5rem;background:#409EFF;color:#fff;border-radius:7px;border:none;cursor:pointer;" 
        @click="addAccount"
        title="Добавить">
        +
      </button>
    </div>
    <div style="margin:20px 0 22px 0;padding:12px 18px;background:#f3f6fa;border-radius:6px;display:flex;align-items:center;gap:8px;color:#555;">
      <span style="font-size:18px;">&#9432;</span>
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </div>

    <table style="width:100%;border-spacing:0 10px;margin-top:8px;">
      <thead>
        <tr>
          <th style="padding:8px 12px;color:#888;font-size:15px;font-weight:500;">Метки</th>
          <th style="padding:8px 12px;color:#888;font-size:15px;font-weight:500;">Тип записи</th>
          <th style="padding:8px 12px;color:#888;font-size:15px;font-weight:500;">Логин</th>
          <th style="padding:8px 12px;color:#888;font-size:15px;font-weight:500;">Пароль</th>
          <th style="width:56px;"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(acc, idx) in store.accounts" :key="idx" style="background:#fff;box-shadow:0 2px 5px #0002;">
          <td style="padding:10px 12px;">
            <input
              type="text"
              :value="acc.labels?.map(l => l.text).join(';') || ''"
              @blur="(e: FocusEvent) => handleLabelBlur(idx, e)"
              maxlength="50"
              placeholder="Значение"
              style="width:100%;padding:7px;border-radius:4px;border:1px solid #ccc"
            />
          </td>
          <td style="padding:10px 12px;">
            <select
              :value="acc.type"
              @change="(e: Event) => handleTypeChange(idx, e)"
              style="width:100%;padding:7px;border-radius:4px;border:1px solid #ccc">
                <option value="LDAP">LDAP</option>
                <option value="Локальная">Локальная</option>
            </select>
          </td>
          <td style="padding:10px 12px;">
            <input
              type="text"
              :value="acc.login"
              @blur="(e: FocusEvent) => handleLoginBlur(idx, e)"
              maxlength="100"
              placeholder="Значение"
              :style="{width:'100%',padding:'7px 38px 7px 7px',borderRadius:'4px',border:acc.errorFields?.includes('login') ? '1.5px solid #e12d39' : '1px solid #ccc', boxSizing:'border-box'}"
            />
            <div v-if="acc.errorFields?.includes('login')" style="color:#e12d39;font-size:12px;">
              <template v-if="!acc.login">Обязательное поле</template>
              <template v-else-if="acc.login.length > 100">Не более 100 символов</template>
            </div>
          </td>
          <td style="padding:10px 12px; position:relative;">
            <template v-if="acc.type === 'Локальная'">
              <input
                :type="passwordVisible[idx] ? 'text' : 'password'"
                :value="acc.password ?? ''"
                @blur="(e: FocusEvent) => handlePasswordBlur(idx, e)"
                maxlength="100"
                placeholder="Значение"
                :style="{width:'100%',padding:'7px 32px 7px 7px',borderRadius:'4px',border:acc.errorFields?.includes('password') ? '1.5px solid #e12d39' : '1px solid #ccc', boxSizing:'border-box'}"
              />
              <button
                type="button"
                @click="togglePasswordVisibility(idx)"
                style="position:absolute; right:12px; top:50%; transform:translateY(-50%);
                background:none; border:none; cursor:pointer; padding:0; margin:0;">
                <svg v-if="passwordVisible[idx]" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" style="color:#bbb;">
                  <path stroke="#bbb" stroke-width="2" d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"/>
                  ircle stroke="#bbb" stroke-width="2" cx="12" cy="12"2" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" style="color:#bbb;">
                  <path stroke="#bbb" stroke-width="2" d="M3 3l18 18M10.7 10.7a3 3 0 104.6 4.6M6.5 6.5C4.383 8.092 2.932 10.248 2.5 12c1.5 4.5 6.5 7 9.5 7a9.77 9.77 0 004.18-.86M18.5 18.5C20.617 16.908 22.068 14.752 22.5 13c-1.5-4.5-6.5-7-9.5-7a9.77 9.77 0 00-4.18.86"/>
                </svg>
              </button>
              <div v-if="acc.errorFields?.includes('password')" style="color:#e12d39;font-size:12px;">
                <template v-if="!acc.password">Обязательное поле</template>
                <template v-else-if="acc.password.length > 100">Не более 100 символов</template>
              </div>
            </template>
          </td>
          <td style="padding:10px 12px;text-align:center;">
            <button 
              @click="removeAccount(idx)" 
              style="background:none;border:none;cursor:pointer;margin:0;padding:0;display:inline-block;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="7.5" width="14" height="11" rx="2" stroke="#bbb" stroke-width="2"/>
                <path d="M9.5 10.5v5M14.5 10.5v5" stroke="#bbb" stroke-width="2" stroke-linecap="round"/>
                <rect x="9" y="4" width="6" height="3" rx="1.5" stroke="#bbb" stroke-width="2"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="store.accounts.length === 0" style="text-align:center;color:#aaa;margin-top:38px;">
      Нет учетных записей
    </div>
  </div>
</template>

