<template>
    <div v-show="this.store().logged">
        <div >
            <h1 class="mb-2">{{ $t("Settings") }}</h1>
            
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <v-card class="mx-auto pa-6" max-width="40%">
                    <v-card-title>{{ $t('Personal preferences') }}</v-card-title>               
                    <v-text-field v-model="new_settings.first_name" :label="$t('Set your name')" :placeholder="$t('Set your name')" :rules="RulesString(200,true)" counter="200"/>
                    <v-text-field v-model="new_settings.last_name" :label="$t('Set your last name')" :placeholder="$t('Set your last name')" :rules="RulesString(200,true)" counter="200"/>
                    <v-text-field v-model="new_settings.email" :label="$t('Set your email')" :placeholder="$t('Set your email')" :rules="RulesEmail(true)" counter="200"/>

                    <MyDatePicker :label="$t('Set your birthday')" density="compact" no-title v-model="new_settings.birthday"></MyDatePicker>
                    <v-checkbox v-model="new_settings.male" :label="$t('Are you a male?')"></v-checkbox>
                </v-card>


                <div class="mx-auto pa-5" align="center">
                    <v-btn color="error" @click="save_settings()">{{ $t("Save settings")}}</v-btn>
                </div>
            </v-form>
            
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import MyDatePicker from './reusing/MyDatePicker.vue'
    export default {
        components: {
            MyDatePicker,
        },
        data () {
            return {
                form_valid: true,
                new_settings: null,
            }
        },
        methods: {
            save_settings(){       
                if (this.form_valid!=true) {
                    this.$refs.form.validate()
                    return
                }

                axios.post(`${this.store().apiroot}/settings/`, this.new_settings, this.myheaders())
                .then((response) => {
                    this.store().settings=response.data
                    alert(this.$t("Settings saved"))

                    this.$router.push("home")
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        created(){
            this.new_settings=Object.assign({},this.store().settings)
        }
    }
</script>
