<!-- // INFORMACION NUTRICIONAL -->
<template>
    <div>    
        <v-data-table density="compact" :headers="products_in_headers" :items="items" :sort-by="[{key:'amount',order:'desc'}]"  class="elevation-1" hide-default-footer :items-per-page="10000" :key="'T'+key" height="50vh" fixed-header>
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
                <template v-slot:[`body.append`]="{headers}" v-if="items.length>0">
                    <tr style="background-color: WhiteSmoke">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'products'">{{ $t(`Total ({0} items):`).format(items.length)}}</div>
                            <div v-if="header.value == 'amount'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'amount'),0)"></div>
                            <div v-if="header.value == 'calories'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'calories'),0)"></div>
                            <div v-if="header.value == 'fat'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'fat'),0)"></div>
                            <div v-if="header.value == 'protein'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'protein'),0)"></div>
                            <div v-if="header.value == 'carbohydrate'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'carbohydrate'),0)"></div>
                            <div v-if="header.value == 'fiber'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'fiber'),0)"></div>
                            <div v-if="header.value == 'salt'" class="d-flex justify-end" @click="on_icon_salt_info()" ><v-icon small >mdi-information-outline</v-icon></div>
                            <div v-if="header.value == 'cholesterol'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'cholesterol'),0)"></div>
                            <div v-if="header.value == 'sodium'"  class="d-flex justify-end" v-html="total_sodium()"></div>
                            <div v-if="header.value == 'potassium'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'potassium'),0)"></div>
                            <div v-if="header.value == 'ferrum'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'ferrum'),0)"></div>
                            <div v-if="header.value == 'magnesium'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'magnesium'),0)"></div>
                            <div v-if="header.value == 'phosphor'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'phosphor'),0)"></div>
                            <div v-if="header.value == 'calcium'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'calcium'),0)"></div>
                            <div v-if="header.value == 'sugars'"  class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'sugars'),0)"></div>
                            <div v-if="header.value == 'saturated_fat'" class="d-flex justify-end" v-html="my_round(listobjects_sum(items,'saturated_fat'),0)"></div>
                        </td>
                    </tr>
                    <tr style="background-color: WhiteSmoke" v-if="elaboration.final_amount">
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="header.value == 'products'">{{ $t(`Nutritional information in 100 g:`)}}</div>
                            <div v-if="header.value == 'amount'" class="d-flex justify-end" v-html="100"></div>
                            <div v-if="header.value == 'calories'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'calories')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'fat'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'fat')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'protein'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'protein')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'carbohydrate'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'carbohydrate')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'fiber'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'fiber')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'salt'" class="d-flex justify-end" @click="on_icon_salt_info()" ><v-icon small >mdi-information-outline</v-icon></div>
                            <div v-if="header.value == 'cholesterol'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'cholesterol')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'sodium'"  class="d-flex justify-end" v-html="my_round(100*total_sodium()/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'potassium'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'potassium')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'ferrum'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'ferrum')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'magnesium'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'magnesium')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'phosphor'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'phosphor')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'calcium'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'calcium')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'sugars'"  class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'sugars')/elaboration.final_amount,0)"></div>
                            <div v-if="header.value == 'saturated_fat'" class="d-flex justify-end" v-html="my_round(100*listobjects_sum(items,'saturated_fat')/elaboration.final_amount,0)"></div>
                        </td>
                    </tr>
                </template>
        </v-data-table>
    </div>
</template>
<script>
    import fraction from 'fraction.js'
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
                    { text: this.$t('Product'), sortable: true, value: 'products',width:"30%"},
                    { text: this.$t('Amount (g)'), sortable: true, value: 'amount',align:'right'},
                    { text: this.$t('Calories (kcal)'), sortable: true, value: 'calories',align:'right'},
                    { text: this.$t('Fat (g)'), sortable: true, value: 'fat',align:'right'},
                    { text: this.$t('Protein (g)'), sortable: true, value: 'protein',align:'right'},
                    { text: this.$t('Carbohydrate (g)'), sortable: true, value: 'carbohydrate',align:'right'},
                    { text: this.$t('Salt (g)'), sortable: true, value: 'salt',align:'right'},
                    { text: this.$t('Fiber (g)'), sortable: true, value: 'fiber',align:'right'},
                    { text: this.$t('Sugars (g)'), sortable: true, value: 'sugars',align:'right'},
                    { text: this.$t('Saturated fat (g)'), sortable: true, value: 'saturated_fat',align:'right'},
                    { text: this.$t('Cholesterol (g)'), sortable: true, value: 'cholesterol',align:'right'},
                    { text: this.$t('Sodium (mg)'), sortable: true, value: 'sodium',align:'right'},
                    { text: this.$t('Potassium (mg)'), sortable: true, value: 'potassium',align:'right'},
                    { text: this.$t('Ferrum (mg)'), sortable: true, value: 'ferrum',align:'right'},
                    { text: this.$t('Magnesium (mg)'), sortable: true, value: 'magnesium',align:'right'},
                    { text: this.$t('Phosphor (mg)'), sortable: true, value: 'phosphor',align:'right'},
                    { text: this.$t('Calcium (mg)'), sortable: true, value: 'calcium',align:'right'},
                ],

                items:[],
                key:0,
            }
        },
        methods: {
            fraction,
            on_ElaborationProductsInCRUD_cruded(){
                this.dialog_products_in_crud=false  
                this.key=this.key+1
                this.$emit("cruded")
            },
            refresh(){
                this.elaboration.elaborations_products_in.forEach(o => {
                    var product=this.store().getters.getObjectByUrl("products",o.products)
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
    - Salt amount: {0} g => {1} sodium mg
    - Sodium amount: {2} mg
    - Total sodium: {3} mg
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

