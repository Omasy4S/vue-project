<script setup lang="ts">
/**
 * Главный компонент приложения
 * Управление учетными записями
 */

import AccountsForm from './components/AccountsForm.vue'
</script>

<template>
  <div id="app">
    <AccountsForm />
  </div>
</template>

<style>
/**
 * Глобальные стили приложения
 */

/* Сброс стилей */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Основные стили */
html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-attachment: fixed;
  color: #303133;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  padding: 20px 0;
}

/* Скроллбар */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 10px;
  transition: background 0.3s;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* Анимации */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Утилиты */
.text-center {
  text-align: center;
}

.mt-1 {
  margin-top: 8px;
}

.mt-2 {
  margin-top: 16px;
}

.mt-3 {
  margin-top: 24px;
}

.mb-1 {
  margin-bottom: 8px;
}

.mb-2 {
  margin-bottom: 16px;
}

.mb-3 {
  margin-bottom: 24px;
}
</style>
