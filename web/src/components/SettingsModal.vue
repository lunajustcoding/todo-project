<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
    @click.self="$emit('close')"
  >
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <!-- 彈窗內容 -->
    <div
      class="relative bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30 w-100"
    >
      <!-- 關閉按鈕 -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
      >
        <svg class="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
          <path
            d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"
          />
        </svg>
      </button>

      <!-- 標題 -->
      <h2 class="text-xl font-bold text-white mb-6">設定</h2>

      <label class="block text-white/70 text-sm mb-2">使用者名稱</label>
      <div v-if="isEdit == true" class="flex-1 flex gap-2 items-center">
        <input
          type="text"
          class="px-4 py-3 bg-white/20 group rounded-lg text-white border flex justify-between items-center border-white/30"
          v-model="editName"
        />
        <button
          @click="submitName"
          class="px-3 py-1 bg-white/30 text-white rounded hover:bg-white/40"
        >
          送出
        </button>
        <button @click="isEdit = false" class="px-3 py-1 text-white/70 hover:text-white">
          取消
        </button>
      </div>

      <!-- 使用者名稱 -->
      <div class="mb-6" v-else>
        <div
          class="px-4 py-3 bg-white/20 group rounded-lg text-white border flex justify-between items-center border-white/30"
        >
          {{ userName || "未登入" }}
          <!-- 編輯按鈕 -->
          <button
            @click="isEdit = true"
            class="opacity-0 group-hover:opacity-100 px-3 py-1 text-white border-white/50 transition-all"
          >
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 切換背景 -->
      <div>
        <label class="block text-white/70 text-sm mb-2">背景圖片</label>
        <button
          @click="$emit('changeBackground')"
          class="w-full px-4 py-3 bg-white/30 text-white font-medium rounded-lg hover:bg-white/40 transition-colors border border-white/40"
        >
          切換背景
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const isEdit = ref<boolean>(false);
const editName = ref<string>("");

const props = defineProps<{
  isOpen: boolean;
  userName: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "changeName", newName: string): void;
  (e: "changeBackground"): void;
}>();

watch(isEdit, (val) => {
  if (val) {
    editName.value = props.userName;
  }
});

const submitName = () => {
  emit("changeName", editName.value);
  isEdit.value = false;
};
</script>
