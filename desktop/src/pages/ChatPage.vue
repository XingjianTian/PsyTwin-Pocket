<template>
  <section class="chat-page">
    <MiniTopBar
      :title="chatName"
      fallback="/message"
    />

    <div class="chat-container">
      <div class="content">
        <div class="messages">
          <template
            v-for="(item, index) in messages"
            :key="`${item.time}-${index}`"
          >
            <div
              v-if="index === 0 || item.time - messages[index - 1].time > 120000"
              class="time"
            >
              {{ formatTime(item.time) }}
            </div>

            <div class="message-area">
              <template v-if="item.from === 0">
                <div class="message self">{{ item.content }}</div>
                <img
                  class="chat-avatar"
                  src="https://picsum.photos/80/80?random=520"
                  alt="me"
                />
              </template>
              <template v-else>
                <img
                  class="chat-avatar"
                  src="/psytwin.jpg"
                  alt="ai"
                />
                <div class="message other">{{ item.content }}</div>
              </template>
            </div>
          </template>
        </div>

        <div
          v-if="isThinking"
          class="ai-thinking"
        >
          <span>AI 正在思考...</span>
        </div>
      </div>
    </div>

    <div class="chat-bottom">
      <div class="chat-input">
        <input
          v-model="input"
          type="text"
          placeholder="请输入文本"
          @keydown.enter="sendMessage"
        />
      </div>
      <button
        type="button"
        class="chat-send"
        :disabled="!input.trim()"
        @click="sendMessage"
      >
        发送
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import MiniTopBar from '@/components/MiniTopBar.vue';
import { sendToAi } from '@/services/message';

const route = useRoute();
const input = ref('');
const isThinking = ref(false);
const messages = ref([]);

const chatName = computed(() => route.query.name || '心图 AI');

function formatTime(time) {
  const date = new Date(time);
  const hh = `${date.getHours()}`.padStart(2, '0');
  const mm = `${date.getMinutes()}`.padStart(2, '0');
  return `${hh}:${mm}`;
}

async function sendMessage() {
  const content = input.value.trim();
  if (!content) return;

  messages.value.push({
    from: 0,
    content,
    time: Date.now(),
  });
  input.value = '';
  isThinking.value = true;

  const reply = await sendToAi(content);
  isThinking.value = false;
  messages.value.push(reply);
}

async function bootstrapPromptConversation(prompt) {
  const content = prompt.trim();
  if (!content) {
    return;
  }

  messages.value = [
    {
      from: 0,
      content,
      time: Date.now(),
    },
  ];
  isThinking.value = true;
  const reply = await sendToAi(content);
  isThinking.value = false;
  messages.value.push(reply);
}

onMounted(async () => {
  const prompt = typeof route.query.prompt === 'string' ? route.query.prompt : '';
  await bootstrapPromptConversation(prompt);
});
</script>

<style scoped lang="less">
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}

.chat-container {
  flex: 1;
  min-height: 0;
}

.content {
  height: 100%;
  overflow: auto;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 12px 12px;
}

.time {
  color: rgba(0, 0, 0, 0.4);
  text-align: center;
  font-size: 12px;
}

.message-area {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.message.self {
  margin-left: auto;
  border-radius: 16px 0 16px 16px;
  background: #d9e1ff;
}

.message.other {
  border-radius: 0 16px 16px 16px;
  background: #f3f3f3;
}

.message {
  max-width: 265px;
  padding: 12px 14px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  line-height: 1.6;
}

.chat-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.ai-thinking {
  padding: 0 14px 16px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.chat-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px 12px;
  border-top: 1px solid #ececec;
  background: #ffffff;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #dcdcdc;
  border-radius: 999px;
  background: #f3f3f3;
}

.chat-input input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 14px;
}

.chat-send {
  width: 64px;
  height: 36px;
  border-radius: 999px;
  background: #0052d9;
  color: #ffffff;
  font-size: 14px;
}

.chat-send:disabled {
  opacity: 0.45;
}
</style>
