<template>
    <v-app>    
        <v-navigation-drawer v-model="drawer" absolute temporary app class="blue-grey lighten-5 " style="position:fixed; top:0; left:0" width="350">
            <v-card class="mx-auto" >
                <v-list>
                
                    <v-list-item>
                            <v-list-item-title class="title">Calories Tracker</v-list-item-title>
                            <v-list-item-subtitle>{{ useStore().version }} ({{ useStore().versiondate.toISOString().slice(0,10)}})</v-list-item-subtitle>
                            <!-- <v-list-item-subtitle>{{ useStore().settings.first_name }} {{useStore().settings.last_name}}</v-list-item-subtitle> -->
                            <v-list-item-subtitle class="boldred" v-if="useStore().catalog_manager"><span class="vuered">{{ $t("With catalog manager role") }}</span></v-list-item-subtitle>
                    </v-list-item>

                    <v-divider></v-divider>

<!--                     HOME -->
                    <v-list-item link router :to="{ name: 'home'}" prepend-icon="mdi-home" :title="$t('Home')" />
<!--                    BIOMETRICS -->
                    <v-list-item data-test="LateralBiometrics" link router :to="{ name: 'biometrics'}" v-if="useStore().logged"  prepend-icon="mdi-human-male-height" :title="$t('Biometrics')" />
<!--                    COMPANIES -->
                    <v-list-item data-test="LateralCompanies" link router :to="{ name: 'companies'}" v-if="useStore().logged" prepend-icon="mdi-domain" :title="$t('Companies')" />
<!--                    PRODUCTS -->
                    <v-list-item data-test="LateralProducts" link router :to="{ name: 'products'}" v-if="useStore().logged" prepend-icon="mdi-apple" :title="$t('Products')" />
<!--                    MEALS -->
                    <v-list-item data-test="LateralMeals" link router :to="{ name: 'meals'}" v-if="useStore().logged" prepend-icon="mdi-food-turkey" :title="$t('Meals')" />
<!--                    RECIPES -->
                    <v-list-item data-test="LateralRecipes" link router :to="{ name: 'recipes'}" v-if="useStore().logged"  prepend-icon="mdi-book-open-variant" :title="$t('Recipes')" />
<!--                    POTS -->
                    <v-list-item data-test="LateralPots" link router :to="{ name: 'pots'}" v-if="useStore().logged" prepend-icon="mdi-pot" :title="$t('Pot')" />
<!--                    PILLS -->
                    <v-list-item data-test="LateralPillOrganizer" link router :to="{ name: 'pill_organizer'}" v-if="useStore().logged" prepend-icon="mdi-pill" :title="$t('Pill organizer')" />
<!--                     REPORTS -->                   
                    <v-list-group value="Reports"  v-if="useStore().logged">
                        <template v-slot:activator="{ props }">
                            <v-list-item data-test="LateralReports" v-bind="props" prepend-icon="mdi-chart-box-outline" :title="$t('Reports')"></v-list-item>
                        </template>
                        <v-list-item data-test="LateralMealRankings" link router :to="{ name: 'meals_ranking'}" :title="$t('Meals ranking')" />
                        <v-list-item data-test="LateralCuriosities" link router :to="{ name: 'curiosities'}">
                            <v-list-item-title>{{ $t("Curiosities") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>    
<!--                     ADMINISTRATION -->                    
                    <v-list-group value="Administration"  v-if="useStore().logged">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" prepend-icon="mdi-cogs" :title="$t('Administration')"></v-list-item>
                        </template>

                        <v-list-item link router :to="{ name: 'catalog_tables'}" v-if="useStore().catalog_manager">
                            <v-list-item-title>{{ $t("Catalog tables") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'products_datatransfer'}">
                            <v-list-item-title>{{ $t("Products data transfer") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>    
<!--                     HELP -->
                    <v-list-group value="Help" >
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" prepend-icon="mdi-lifebuoy" :title="$t('Help')"></v-list-item>
                        </template>
                        <v-list-item link router :to="{ name: 'about'}" :title="$t('About')" />
                        <v-list-item  v-if="useStore().logged" link router :to="{ name: 'statistics'}" :title="$t('Statistics')" />
                        <v-list-item  href="https://github.com/turulomio/calories_tracker/" target="_blank" :title="$t('Calories Tracker Github')" />
                        <v-list-item  href="https://github.com/turulomio/django_calories_tracker/" target="_blank" :title="$t('Django Calories Tracker Github')" />
                    </v-list-group>
                </v-list>
            </v-card>
        </v-navigation-drawer>
        
        <v-app-bar color="primary" dark  fixed fill-height app >
            <v-app-bar-nav-icon data-test="LateralIcon" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn :to="{ name: 'home'}"><v-icon icon="mdi-home" dark></v-icon></v-btn>
            <v-btn :to="{ name: 'settings'}" v-if="useStore().logged"><v-icon icon="mdi-wrench" dark></v-icon></v-btn>
            <v-spacer />
            <h1 class="font-weight-black text-no-wrap text-truncate" >{{ $t("Calories Tracker. Another way to manage your diet") }}</h1>
            <v-spacer />
            <BtnSwitchLanguages />
            <BtnLogIn data-test="LateralLogIn" v-show="!this.useStore().logged"/>
            <BtnLogOut v-show="this.useStore().logged"/>

        </v-app-bar>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import { useStore } from '@/store.js'
import BtnLogIn from './components/reusing/BtnLogIn';
import BtnLogOut from './components/reusing/BtnLogOut';
import BtnSwitchLanguages from './components/reusing/BtnSwitchLanguages';
export default {
    name: 'App',
    components: {
        BtnLogIn,
        BtnLogOut,
        BtnSwitchLanguages,
    },
    data () {
        return {
            logged:false,
            drawer: false,
            height:22,
            width:22,
        }
    },
    methods:{
        useStore,
    },
    created(){
    }
};
</script>
<style >
h1   {
    text-align: center;
    font-weight: bold;
    padding-top: 6px;
}

h2 {
    text-align: center;
    font-weight: normal;
}

.paragraph{
    text-align:justify;
    padding: 30px;
}

.paragraph_centered {
    text-align:center;
    padding: 30px;

}

.v-card__title {
    margin-top: 0px;
    padding: 0px 0px 10px 0px;
}

span.vuered{
    color:red;
}


.cursorpointer {
    cursor: pointer;
}

.bold{
    color: black;
    font-weight: 900;
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


.totalrow{
    background-color: whitesmoke;
    font-weight: 600;
}

.totalrow > td{
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 6px;
    padding-bottom: 6px;

}

</style>