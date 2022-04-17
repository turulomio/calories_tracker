<template>
    <v-app>    
        <v-navigation-drawer v-model="drawer" absolute temporary app class="blue-grey lighten-5 " style="position:fixed; top:0; left:0" width="350">
            <v-card class="mx-auto" >
                <v-list>
                
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">Calories Tracker</v-list-item-title>
                            <v-list-item-subtitle>{{ $store.state.version }} ({{ $store.state.versiondate.toISOString().slice(0,10)}})</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

<!--                     HOME -->
                    <v-list-item link router :to="{ name: 'home'}">
                        <v-list-item-icon><v-icon color="#757575;">mdi-home</v-icon></v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>
<!--                    BIOMETRICS -->
                    <v-list-item link router :to="{ name: 'biometrics'}">
                        <v-list-item-icon><v-icon color="#757575;">mdi-human-male-height</v-icon></v-list-item-icon>
                        <v-list-item-title>{{ $t("Biometrics")}}</v-list-item-title>
                    </v-list-item>
<!--                    COMPANIES -->
                    <v-list-item link router :to="{ name: 'companies'}">
                        <v-list-item-icon><v-icon color="#757575;">mdi-domain</v-icon></v-list-item-icon>
                        <v-list-item-title>{{ $t("Companies")}}</v-list-item-title>
                    </v-list-item>
<!--                    PRODUCTS -->
                    <v-list-item link router :to="{ name: 'products'}">
                        <v-list-item-icon><v-icon color="#757575;">mdi-food-apple</v-icon></v-list-item-icon>
                        <v-list-item-title>{{ $t("Products")}}</v-list-item-title>
                    </v-list-item>
<!--                    MEALS -->
                    <v-list-item link router :to="{ name: 'meals'}">
                        <v-list-item-icon><v-icon color="#757575;">mdi-food-turkey</v-icon></v-list-item-icon>
                        <v-list-item-title>{{ $t("Meals")}}</v-list-item-title>
                    </v-list-item>
<!--                     HELP -->
                    <v-list-group :value="false" prepend-icon="mdi-lifebuoy">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Help") }}</v-list-item-title>
                        </template>
                      
                        <v-list-item link router :to="{ name: 'about'}">
                            <v-list-item-title>{{ $t("About")}}</v-list-item-title>
                        </v-list-item>

                        <v-list-item link router :to="{ name: 'statistics'}" v-if="$store.state.logged">
                            <v-list-item-title>{{ $t("Statistics")}}</v-list-item-title>
                        </v-list-item>

                        <v-list-item  href="https://github.com/turulomio/calories_tracker/" target="_blank">
                            <v-list-item-title>{{ $t('Calories Tracker Github') }}</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item href="https://github.com/turulomio/django_calories_tracker/" target="_blank">
                            <v-list-item-title>{{ $t('Django Calories Tracker Github') }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                </v-list>
            </v-card>
        </v-navigation-drawer>
        
        <v-app-bar color="primary" dark  fixed fill-height app >
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn color="primary" :to="{ name: 'home'}"><v-icon dark>mdi-home</v-icon></v-btn>
            <v-btn color="primary" :to="{ name: 'settings'}" v-if="$store.state.logged"><v-icon dark>mdi-wrench</v-icon></v-btn>
            <v-spacer />
            <h1 class="font-weight-black text-no-wrap text-truncate" >{{ $t("Calories Tracker. Another way to manage your diet") }}</h1>
            <v-spacer />
            <SwitchLanguages />
            <btnLogIn v-show="!this.$store.state.logged"/>
            <btnLogOut v-show="this.$store.state.logged"/>

        </v-app-bar>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import btnLogIn from './components/reusing/btnLogIn';
import btnLogOut from './components/reusing/btnLogOut';
import SwitchLanguages from './components/reusing/SwitchLanguages.vue';
export default {
    name: 'App',
    components: {
        btnLogIn,
        btnLogOut,
        SwitchLanguages,
    },
    data () {
        return {
            logged:false,
            drawer: false,
            height:22,
            width:22,
        }
    },
};
</script>
<style >
h1   {
    text-align: center;
    font-weight: bold;
    padding-top: 6px;
}

.v-card__title {
    margin-top: 0px;
    padding: 0px 0px 10px 0px;
}

span.vuered{
    color:red;
}


.boldred{
    color: red;
    font-weight: 900;
}
.boldgreen{
    color: Green;
    font-weight: 900;
}
.v-application .inform {
    margin-bottom: 1px;
    background-color: white !important;
}


/*SLIM MONTHPICKER*/
.v-date-picker-table--month td {
    height: unset;
}

.v-date-picker-table {
    height: unset;
}
</style>