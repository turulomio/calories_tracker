<template>
    <div>
        <p v-if="items.length==0">No data to show</p>
        <v-card flat  v-if="items.length>0">
            <v-row no-gutters :style="styleheight">
                <v-col>
                    <v-chart ref="chart" autoresize :option="options" :key="key" @finished="on_finished"/>
                </v-col>
                <v-col v-show="showtable" >
                    <v-data-table dense :headers="tableHeaders"  :items="items" class="elevation-1" disable-pagination  hide-default-footer :sort-by="['value']" :sort-desc="['value']">
                        <template v-slot:[`item.percentage`]="{ item }">
                            {{ getPercentage(item) }}
                        </template>    
                        <template v-slot:[`body.append`]="{headers}">
                            <tr style="background-color: lightgrey">
                                <td v-for="(header,i) in headers" :key="i">
                                    <div v-if="header.value == 'name'">
                                        Total
                                    </div>
                                    <div v-if="header.value == 'value'" align="right">
                                        {{total}}
                                    </div>
                                    <div v-if="header.value == 'percentage'" align="right">
                                        100 %
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>       
        </v-card>  
        <v-row>
            <v-col align="center">
                <v-btn  v-if="show_data" color="primary" @click="buttonClick">{{buttontext}}</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        props: {
            items: {
                required: true
            },
            height: {
                required: false,
                default:600
            },
            width: {
                required: false,
                default:1200
            },
            save_prefix:{
                required:false,
            },
            show_data:{
                required:false,
                default:true,
            },
        },
        data: function () {
            return {
                showtable: false,
                key:0,
                tableHeaders: [
                    { text: 'Name', value: 'name',sortable: true },
                    { text: 'Value', value: 'value',sortable: true, align: 'right'},
                    { text: 'Percentage', value: 'percentage',sortable: false, align: 'right'},
                ],   
            }
        },
        computed:{
            options: function(){
                return {
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: this.name,
                            type: "pie",
                            radius: "80%",
                            center: ["50%", "50%"],
                            data: this.items,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                }
            },
            styleheight: function(){
                return `height: ${this.height}px; width: ${this.width}px;`
            },
            buttontext: function(){
                if (this.showtable){
                    return "Hide table data"
                } else {
                    return "Show table data"
                }
            },
            total: function(){
                console.log("computed total")
                return this.items.reduce((accum,item) => accum + item.value, 0)
            }
        },
        methods: {
            buttonClick(){
                this.showtable=!this.showtable
                this.key=this.key+1
            },
            getPercentage(item){
                return `${(item.value/this.total*100).toFixed(2)} %`
                
            },
            on_finished(){
                if (this.save_prefix!=null){
                    var filename=this.save_prefix
                    var data=this.$refs.chart.getDataURL().replace('data:image/png;base64,','')
                    axios.post(`${this.$store.state.apiroot}/binary/to/global/`, {global:filename,data:data,}, this.myheaders())
                    .then(() => {
                        this.$emit("finished")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
                
            }
        },
    }
</script>