<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#94c1d6] via-[#679ec5] to-[#7199bc] py-10 px-4"
    :style="{
      backgroundImage: useBackGround ? `url(${useBackGround})` : '',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="max-w-md mx-auto">
      <!-- 標題 -->
      <div class="relative mb-8">
        <h1 class="text-4xl font-bold text-center text-white drop-shadow-lg">
          Todo List
        </h1>
        <!-- 設定按鈕 -->
        <button
          v-if="isLogin"
          @click="isSettingsOpen = true"
          class="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 6a2 2 0 1 0 0 4a2 2 0 0 0 0-4zM7 8a1 1 0 1 1 2 0a1 1 0 0 1-2 0zm3.618-3.602a.708.708 0 0 1-.824-.567l-.26-1.416a.354.354 0 0 0-.275-.282a6.072 6.072 0 0 0-2.519 0a.354.354 0 0 0-.275.282l-.259 1.416a.71.71 0 0 1-.936.538l-1.359-.484a.355.355 0 0 0-.382.095c-.569.627-1 1.367-1.262 2.173a.352.352 0 0 0 .108.378l1.102.931a.704.704 0 0 1 0 1.076l-1.102.931a.352.352 0 0 0-.108.378A5.986 5.986 0 0 0 3.53 12.02a.355.355 0 0 0 .382.095l1.36-.484a.708.708 0 0 1 .936.538l.258 1.416c.026.14.135.252.275.281a6.075 6.075 0 0 0 2.52 0a.353.353 0 0 0 .274-.281l.26-1.416a.71.71 0 0 1 .936-.538l1.359.484c.135.048.286.01.382-.095c.569-.627 1-1.367 1.262-2.173a.352.352 0 0 0-.108-.378l-1.102-.931a.703.703 0 0 1 0-1.076l1.102-.931a.352.352 0 0 0 .108-.378A5.985 5.985 0 0 0 12.47 3.98a.355.355 0 0 0-.382-.095l-1.36.484a.71.71 0 0 1-.111.03zm-6.62.58l.937.333a1.71 1.71 0 0 0 2.255-1.3l.177-.97a5.105 5.105 0 0 1 1.265 0l.178.97a1.708 1.708 0 0 0 2.255 1.3L12 4.977c.255.334.467.698.63 1.084l-.754.637a1.704 1.704 0 0 0 0 2.604l.755.637a4.99 4.99 0 0 1-.63 1.084l-.937-.334a1.71 1.71 0 0 0-2.255 1.3l-.178.97a5.099 5.099 0 0 1-1.265 0l-.177-.97a1.708 1.708 0 0 0-2.255-1.3L4 11.023a4.987 4.987 0 0 1-.63-1.084l.754-.638a1.704 1.704 0 0 0 0-2.603l-.755-.637c.164-.386.376-.75.63-1.084z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>

      <!-- 未登入：顯示登入表單 -->
      <div v-if="!isLogin">
        <Auth />
      </div>

      <!-- 已登入：顯示 Todo 列表（毛玻璃效果） -->
      <div
        v-else
        class="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/30"
      >
        <!-- 本週日期 -->
        <div class="flex justify-between mb-6">
          <button
            v-for="date in weekDates"
            :key="date.toISOString()"
            @click="switchDate(date)"
            class="flex flex-col items-center px-2 py-2 rounded-lg transition-colors"
            :class="
              selectedDate === date.format('YYYY-MM-DD')
                ? 'bg-white/40 text-white text-shadow-2xs'
                : 'text-white/40 hover:bg-white/20'
            "
          >
            <span class="text-xs">{{
              ["日", "一", "二", "三", "四", "五", "六"][date.day()]
            }}</span>
            <span class="text-lg font-bold">{{ date.date() }}</span>
          </button>
        </div>

        <!-- 新增 Todo -->
        <div class="flex gap-2 mb-6">
          <input
            v-model="newTodo"
            placeholder="輸入新的待辦事項..."
            class="flex-1 px-4 py-3 bg-white/30 border border-white/40 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            @keyup.enter="addTodo"
          />
          <button
            @click="addTodo"
            class="px-6 py-3 bg-white/30 text-white font-medium rounded-lg hover:bg-white/40 transition-colors border border-white/40"
          >
            新增
          </button>
        </div>

        <!-- Todo 列表 -->
        <ul class="space-y-3">
          <li
            v-for="todo in todos"
            :key="todo.id"
            class="flex items-center gap-3 p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors group border border-white/20"
          >
            <!-- 完成狀態 -->
            <button
              @click="updateTodo(todo.id, todo.completed)"
              class="w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors outline-none border-none appearance-none"
              :class="todo.completed ? 'bg-white/40' : 'bg-white/30'"
            >
              <span v-if="todo.completed" class="text-sm">✓</span>
            </button>

            <div v-if="editingTodoId === todo.id" class="flex-1 flex gap-2 items-center">
              <input
                type="text"
                class="flex-1 text-white bg-white/20 px-2 py-1 rounded border border-white/30"
                v-model="todo.title"
              />
              <button
                @click="updateEditTodo(todo.id, todo.title)"
                class="px-3 py-1 bg-white/30 text-white rounded hover:bg-white/40"
              >
                送出
              </button>
              <button
                @click="editingTodoId = null"
                class="px-3 py-1 text-white/70 hover:text-white"
              >
                取消
              </button>
            </div>
            <div v-else class="flex-1 flex gap-2 items-center">
              <!-- 標題 -->
              <span
                class="flex-1 text-white"
                :class="{ 'line-through text-white/50': todo.completed }"
              >
                {{ todo.title }}
              </span>

              <div>
                <!-- 編輯按鈕 -->
                <button
                  @click="editingTodoId = todo.id"
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

                <!-- 刪除按鈕 -->
                <button
                  @click="deleteTodo(todo.id)"
                  class="opacity-0 group-hover:opacity-100 px-3 py-1 text-white border-white/50 transition-all"
                >
                  <svg
                    class="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="currentColor"
                      d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <!-- 空狀態 -->
        <div v-if="todos.length === 0" class="text-center py-10 text-white/60">
          還沒有待辦事項，新增一個吧！
        </div>

        <div class="grid grid-cols-1 gap-4 items-center">
          <!-- 登出按鈕 -->
          <button
            @click="logout"
            class="w-full mt-6 py-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/10 rounded-lg transition-colors"
          >
            登出
          </button>
        </div>
      </div>
    </div>

    <!-- 設定彈窗 -->
    <SettingsModal
      :isOpen="isSettingsOpen"
      :userName="userName"
      @close="isSettingsOpen = false"
      @changeName="(name: string) => updateProfile({username: name})"
      @changeBackground="fetchBackgroundImage()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "./supabase";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import { searchRandomPhoto } from "./pexels";
import Auth from "./components/Auth.vue";
import SettingsModal from "./components/SettingsModal.vue";

interface User {
  username: string;
  bg_url: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;
const isLogin = ref<boolean>(false);
const todos = ref<Todo[]>([]);
const editingTodoId = ref<string | null>(null);
const newTodo = ref<string>("");
const useBackGround = ref<string>("");
const selectedDate = ref<string>("");
const weekDates = ref<Dayjs[]>([]);
const isSettingsOpen = ref<boolean>(false);
const userName = ref<string>("");

const logout = async () => {
  await supabase.auth.signOut();
  if (useBackGround.value) useBackGround.value = "";
};

const switchDate = (date: Dayjs) => {
  selectedDate.value = dayjs(date).format("YYYY-MM-DD");
  fetchTodos();
};

const getWeekDates = () => {
  const sunday = dayjs().startOf("week"); // 本週日

  weekDates.value = Array.from({ length: 7 }, (_, i) => {
    return sunday.add(i, "day");
  });
  selectedDate.value = dayjs().format("YYYY-MM-DD");
};

const fetchBackgroundImage = async () => {
  try {
    // searchRandomPhoto 已經封裝好型別檢查，回傳 Photo | null
    const photo = await searchRandomPhoto("night city");
    if (!photo) return;

    useBackGround.value = photo.src.original;
    updateProfile({ bg_url: photo.src.original });
  } catch (e) {
    console.error("失敗:", e);
  }
};

const getToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
};

const getProfile = async () => {
  const token = await getToken();
  try {
    const res = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.bg_url) {
      useBackGround.value = data.bg_url;
    }
    userName.value = data.username;
  } catch (e) {
    console.error("失敗:", e);
  }
};

const updateProfile = async (data: Partial<User>) => {
  const token = await getToken();
  try {
    await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (data.username) userName.value = data.username;
    if (data.bg_url) useBackGround.value = data.bg_url;
  } catch (e) {
    console.error("失敗", e);
  }
};

// const updateProfile = async (data: Partial<User>) => {
//   const token = await getToken();
//   try {
//     await fetch(`${API_URL}/profile`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });
//     // 更新本地狀態
//     if (data.username) userName.value = data.username;
//     if (data.bg_url) useBackGround.value = data.bg_url;
//   } catch (e) {
//     console.error("失敗:", e);
//   }
// };

const fetchTodos = async () => {
  const token = await getToken();
  try {
    const res = await fetch(`${API_URL}/todos?date=${selectedDate.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    todos.value = await res.json();
  } catch (e) {
    console.error("失敗:", e);
  }
};

const addTodo = async () => {
  if (!newTodo.value) return;
  const token = await getToken();
  try {
    await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTodo.value, due_date: selectedDate.value }),
    });
    newTodo.value = "";
    fetchTodos();
  } catch (e) {
    console.error("失敗:", e);
  }
};

const deleteTodo = async (id: string) => {
  const token = await getToken();
  try {
    await fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchTodos();
  } catch (e) {
    console.error("失敗:", e);
  }
};

const updateEditTodo = async (id: string, newVal: string) => {
  const token = await getToken();
  try {
    await fetch(`${API_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newVal }),
    });
    fetchTodos();
    editingTodoId.value = null;
  } catch (e) {
    console.error("失敗:", e);
  }
};

const updateTodo = async (id: string, currentCompleted: boolean) => {
  const token = await getToken();
  try {
    await fetch(`${API_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !currentCompleted }),
    });
    fetchTodos();
  } catch (e) {
    console.error("失敗:", e);
  }
};

onMounted(async () => {
  await getWeekDates();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    isLogin.value = true;
    console.log(user);
    userName.value = user.email || user.id;
  }
  supabase.auth.onAuthStateChange((event, session) => {
    isLogin.value = !!session;
    if (session) {
      userName.value = session.user.email || session.user.id;
      fetchTodos();
      getProfile();
    } else {
      todos.value = [];
      userName.value = "";
    }
  });
});
</script>
