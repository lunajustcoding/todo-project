<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '../supabase';

const email = ref<string>('');
const password = ref<string>('');
const loginStatus = ref<boolean>(true);
const errorMessage = ref<string>('');

const signUp = async () => {
  errorMessage.value = '';
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
    return;
  }
};

const signIn = async () => {
  errorMessage.value = '';
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
    return;
  }
};
</script>

<template>
  <div class="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30">
    <!-- 標題 -->
    <h2 class="text-2xl font-bold text-center text-white mb-6">
      {{ loginStatus ? '登入' : '註冊' }}
    </h2>

    <!-- 錯誤訊息 -->
    <div
      v-if="errorMessage"
      class="mb-4 p-3 bg-red-500/30 text-white rounded-lg text-sm border border-red-400/50"
    >
      {{ errorMessage }}
    </div>

    <form @submit.prevent="loginStatus ? signIn() : signUp()">
      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-white/80 mb-2"> 信箱 </label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="請輸入信箱"
          class="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
        />
      </div>

      <!-- Password -->
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-white/80 mb-2"> 密碼 </label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="請輸入密碼"
          class="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
        />
      </div>

      <!-- 提交按鈕 -->
      <button
        type="submit"
        class="w-full py-3 bg-white/30 text-white font-medium rounded-lg hover:bg-white/40 transition-colors border border-white/40"
      >
        {{ loginStatus ? '登入' : '註冊' }}
      </button>
    </form>

    <!-- 切換登入/註冊 -->
    <div class="mt-6 text-center">
      <span class="text-white/60">
        {{ loginStatus ? '還沒有帳號？' : '已經有帳號？' }}
      </span>
      <button
        @click="loginStatus = !loginStatus"
        class="ml-2 text-white hover:text-white/80 font-medium underline"
      >
        {{ loginStatus ? '立即註冊' : '立即登入' }}
      </button>
    </div>
  </div>
</template>
