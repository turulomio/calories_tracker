<template>
    <div class="paragraph">
        <h1>{{ $t(`About Calories Tracker`) }}</h1>
        <h2>{{ `${useStore().version} (${useStore().versiondate.toISOString().slice(0,10)})` }}</h2>
        
            <p>{{ $t("Calories Tracker is a personal finances application") }}</p>
    </div>
</template>

<script setup>
    import { useStore } from '../store.js'
</script>
<style>
h2 {
    text-align: center;
    font-weight: normal;
}

paragraph{
    text-align:justify;
    padding: 30px;
}
</style>
