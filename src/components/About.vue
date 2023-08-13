<template>
    <div class="paragraph">
        <h1>{{ $t(`About Calories Tracker`) }}</h1>
        <h2>{{ `${store().version} (${store().versiondate.toISOString().slice(0,10)})` }}</h2>
        
            <p>{{ $t("Calories Tracker is a personal finances application") }}</p>
    </div>
</template>

<script>
    export default {
        name: 'About',
        data(){
            return {
            }
        },
        mounted(){
            this.$refs.github.innerHTML=this.$t("Project main page is located in Github, where you can help me coding or translating to different languages.").replace("Github",'<a href="https://github.com/turulomio/calories_tracker">Github</a>')
        }
    }
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
