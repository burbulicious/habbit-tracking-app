<script setup>
// import { RouterLink, RouterView } from 'vue-router';
import SidePanelHabitList from './components/SidePanelHabitList.vue';
</script>

<template>
  <div class="w-full h-[100vh] flex flex-row items-stretch text-white">
    <SidePanelHabitList />
    <div class="min-w-[800px] flex-grow h-full"></div>
    <div class="bg-grey-900 min-w-[236px] flex-none h-full"></div>
  </div>
  <!-- <div>
    <header class="section">
      <div class="container">
        <div class="wrapper">
          <nav class="text-white">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          </nav>
        </div>
      </div>
    </header>
    <div class="section">
      <div class="container">
        <RouterView />
      </div>
    </div>
  </div> -->
</template>
