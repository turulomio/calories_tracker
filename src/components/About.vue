<template>
    <div class="paragraph">
        <h1>{{ $t(`About Calories Tracker`) }}</h1>
        <h2>{{ `${useStore().version} (${useStore().versiondate.toISOString().slice(0,10)})` }}</h2>
        <p class="paragraph_centered">{{ $t("Manage your meals, your recipes, your calories and your biometric data.") }}</p>
    </div>
</template>

<script setup>
    import { useStore } from '../store.js'
</script>
