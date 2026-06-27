<template>
  <section class="home-container">
    <MiniNavBar />

    <div class="home-content">
      <div class="home-tabs">
        <button
          type="button"
          class="home-tabs__item"
          :class="{ active: currentTab === 'recommend' }"
          @click="currentTab = 'recommend'"
        >
          心墙
        </button>
        <button
          type="button"
          class="home-tabs__item"
          :class="{ active: currentTab === 'follow' }"
          @click="currentTab = 'follow'"
        >
          关注
        </button>
      </div>

      <div class="home-scroll">
        <div
          v-if="currentTab === 'recommend'"
          class="waterfall"
        >
          <div class="waterfall-left">
            <HomeFeedCard
              v-for="item in leftList"
              :key="item.postId"
              :card="item"
              @click="openPost(item.postId)"
            />
          </div>
          <div class="waterfall-right">
            <HomeFeedCard
              v-for="item in rightList"
              :key="item.postId"
              :card="item"
              @click="openPost(item.postId)"
            />
          </div>
        </div>

        <div
          v-else
          class="waterfall waterfall--single"
        >
          <div class="waterfall-left">
            <HomeFeedCard
              v-for="item in focusCardInfo"
              :key="item.postId"
              :card="item"
              @click="openPost(item.postId)"
            />
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="home-release"
      @click="showReleaseInfo"
    >
      <AddIcon />
      <span>发布</span>
    </button>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AddIcon } from 'tdesign-icons-vue-next';

import HomeFeedCard from '@/components/HomeFeedCard.vue';
import MiniNavBar from '@/components/MiniNavBar.vue';
import { getHomeFeed } from '@/services/home';

const router = useRouter();

const currentTab = ref('recommend');
const leftList = ref([]);
const rightList = ref([]);
const focusCardInfo = ref([]);

async function loadHomeFeed() {
  const result = await getHomeFeed();
  leftList.value = result.leftList;
  rightList.value = result.rightList;
  focusCardInfo.value = result.focusCards;
}

function openPost(postId) {
  router.push({
    name: 'post-detail',
    query: { id: postId },
  });
}

function showReleaseInfo() {
  router.push('/release');
}

onMounted(() => {
  loadHomeFeed();
});
</script>
