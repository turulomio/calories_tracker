<!-- // INFORMACION NUTRICIONAL -->
<template>
    <div>    
        <v-data-table density="compact" :headers="products_in_headers" :items="items" :sort-by="[{key:'amount',order:'desc'}]"  class="elevation-1" :items-per-page="10000" :key="'T'+key" fixed-header>
            <template #item.products="{item}"><div v-html="products_html_fullname(item.products,4)"></div></template>                       
                <template #item.amount="{item}"><div v-html="my_round(item.amount,0)"></div></template>                  
                <template #item.calories="{item}"><div v-html="my_round(item.calories,0)"></div></template>  
                <template #item.fat="{item}"><div v-html="my_round(item.fat,0)"></div></template>  
                <template #item.protein="{item}"><div v-html="my_round(item.protein,0)"></div></template>  
                <template #item.carbohydrate="{item}"><div v-html="my_round(item.carbohydrate,0)"></div></template>  
                <template #item.salt="{item}"><div v-html="my_round(item.salt,0)"></div></template>  
                <template #item.fiber="{item}"><div v-html="my_round(item.fiber,0)"></div></template>  
                <template #item.sugars="{item}"><div v-html="my_round(item.sugars,0)"></div></template>  
                <template #item.saturated_fat="{item}"><div v-html="my_round(item.saturated_fat,0)"></div></template>  
                <template #item.cholesterol="{item}"><div v-html="my_round(item.cholesterol,0)"></div></template>  
                <template #item.sodium="{item}"><div v-html="my_round(item.sodium,0)"></div></template>  
                <template #item.potassium="{item}"><div v-html="my_round(item.potassium,0)"></div></template>  
                <template #item.ferrum="{item}"><div v-html="my_round(item.ferrum,0)"></div></template>  
                <template #item.magnesium="{item}"><div v-html="my_round(item.magnesium,0)"></div></template>  
                <template #item.phosphor="{item}"><div v-html="my_round(item.phosphor,0)"></div></template>  
                <template #item.calcium="{item}"><div v-html="my_round(item.calcium,0)"></div></template>                 
                <template #tbody>
                    <tr class="totalrow">
                        <td>{{ $t(`Total ([0] items):`).format(items.length) }} </td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'amount'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'calories'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'fat'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'protein'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'carbohydrate'),0)"></td>
                        <td class="text-right" @click="on_icon_salt_info()" ><v-icon small >mdi-information-outline</v-icon></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'fiber'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'sugars'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'saturated_fat'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'cholesterol'),0)"></td>
                        <td class="text-right" v-html="total_sodium()"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'potassium'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'ferrum'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'magnesium'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'phosphor'),0)"></td>
                        <td class="text-right" v-html="my_round(listobjects_sum(items,'calcium'),0)"></td>
                        <td></td>      
                    </tr>
                    <tr class="totalrow" v-if="elaboration.final_amount">
                            <td>{{ $t(`Nutritional information in 100 g:`)}}</td>
                            <td class="text-right" v-html="100"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'calories')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'fat')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'protein')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'carbohydrate')/elaboration.final_amount,0)"></td>
                            <td class="text-right" @click="on_icon_salt_info()" ><v-icon small >mdi-information-outline</v-icon></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'fiber')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'sugars')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'saturated_fat')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'cholesterol')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*total_sodium()/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'potassium')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'ferrum')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'magnesium')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'phosphor')/elaboration.final_amount,0)"></td>
                            <td class="text-right" v-html="my_round(100*listobjects_sum(items,'calcium')/elaboration.final_amount,0)"></td>
                    </tr>
                </template>
                <template #bottom></template>
        </v-data-table>
    </div>
</template>
<script>
    import fraction from 'fraction.js'
    import {my_round} from 'vuetify_rules'
    export default {
        components: {
        },
        props: {
            elaboration: { 
                required: true
            },
        },
        data(){ 
            return{
                products_in_headers: [
                    { title: this.$t('Product'), sortable: true, key: 'products',width:"30%"},
                    { title: this.$t('Amount (g)'), sortable: true, key: 'amount',align:'end'},
                    { title: this.$t('Calories (kcal)'), sortable: true, key: 'calories',align:'end'},
                    { title: this.$t('Fat (g)'), sortable: true, key: 'fat',align:'end'},
                    { title: this.$t('Protein (g)'), sortable: true, key: 'protein',align:'end'},
                    { title: this.$t('Carbohydrate (g)'), sortable: true, key: 'carbohydrate',align:'end'},
                    { title: this.$t('Salt (g)'), sortable: true, key: 'salt',align:'end'},
                    { title: this.$t('Fiber (g)'), sortable: true, key: 'fiber',align:'end'},
                    { title: this.$t('Sugars (g)'), sortable: true, key: 'sugars',align:'end'},
                    { title: this.$t('Saturated fat (g)'), sortable: true, key: 'saturated_fat',align:'end'},
                    { title: this.$t('Cholesterol (g)'), sortable: true, key: 'cholesterol',align:'end'},
                    { title: this.$t('Sodium (mg)'), sortable: true, key: 'sodium',align:'end'},
                    { title: this.$t('Potassium (mg)'), sortable: true, key: 'potassium',align:'end'},
                    { title: this.$t('Ferrum (mg)'), sortable: true, key: 'ferrum',align:'end'},
                    { title: this.$t('Magnesium (mg)'), sortable: true, key: 'magnesium',align:'end'},
                    { title: this.$t('Phosphor (mg)'), sortable: true, key: 'phosphor',align:'end'},
                    { title: this.$t('Calcium (mg)'), sortable: true, key: 'calcium',align:'end'},
                ],

                items:[],
                key:0,
            }
        },
        methods: {
            fraction,
            my_round,
            on_ElaborationProductsInCRUD_cruded(){
                this.dialog_products_in_crud=false  
                this.key=this.key+1
                this.$emit("cruded")
            },
            refresh(){
                this.elaboration.elaborations_products_in.forEach(o => {
                    var product=this.store().products.get(o.products)
                    if (o.ni){
                        var item={}
                        item.products=o.products
                        item.amount=o.final_grams
                        item.calories=o.amount*product.calories/product.amount
                        item.fat=o.amount*product.fat/product.amount
                        item.protein=o.amount*product.protein/product.amount
                        item.carbohydrate=o.amount*product.carbohydrate/product.amount
                        item.salt=o.amount*product.salt/product.amount
                        item.fiber=o.amount*product.fiber/product.amount
                        item.sugars=o.amount*product.sugars/product.amount
                        item.saturated_fat=o.amount*product.saturated_fat/product.amount
                        item.cholesterol=o.amount*product.cholesterol/product.amount
                        item.sodium=o.amount*product.sodium/product.amount
                        item.potassium=o.amount*product.potassium/product.amount
                        item.ferrum=o.amount*product.ferrum/product.amount
                        item.magnesium=o.amount*product.magnesium/product.amount
                        item.phosphor=o.amount*product.phosphor/product.amount
                        item.calcium=o.amount*product.calcium/product.amount
                        this.items.push(item)
                    }
                });
                this.key=this.key+1
                console.log(this.items)

            },
            on_icon_salt_info(){
                var salt=this.listobjects_sum(this.items,"salt")
                var salt_as_sodium=salt*396
                var sodium=this.listobjects_sum(this.items,'sodium')
                var total=sodium+salt_as_sodium



                alert(this.$t(`Salt is converted to sodium to calculate recommended daily amount.
    - Salt amount: [0] g => [1] sodium mg
    - Sodium amount: [2] mg
    - Total sodium: [3] mg
                `).format(this.my_round(salt,2) , this.my_round(salt_as_sodium,0), sodium, this.my_round(total,0)))
            },
            total_sodium(){
                var sum_sodium=this.listobjects_sum(this.items,'sodium')
                var salt=this.listobjects_sum(this.items,"salt")
                return  this.my_round(sum_sodium+salt*396,0)
            },
        },
        created(){
            this.refresh()
        }
    }
</script>

