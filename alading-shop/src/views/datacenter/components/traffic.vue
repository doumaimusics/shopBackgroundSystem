<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="12">
                    <span>流量看板</span>
                </el-col>
                <el-col :span="12" class="dateType">
                    <el-select placeholder="请选择日期模式" v-model="type"
                            @change ="changeType"
                    >
                        <el-option
                            v-for = "item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-date-picker
                    v-model="dayFmt"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    v-if="type == '日'"
                    @change="pickerOption"
                     />
                    <el-date-picker
                        v-model="weekFmt"
                        type="week"
                        format="yyyy 第 WW 周"
                        placeholder="选择周"
                        v-if="type == '周'"
                        @change = "weekPicker"
                    />
                    <el-date-picker
                    v-model="monthFmt"
                    type="month"
                    placeholder="选择月"
                    v-if="type == '月'"
                    @change = "monthPicker"
                    />
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row type="flex" class="panel">
                <el-col :span="6">
                    <el-col>访客数</el-col>
                    <el-col>1000</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
                <el-col :span="6">
                    <el-col>商品浏览量</el-col>
                    <el-col>1000</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
                <el-col :span="6">
                    <el-col>人均浏览次数</el-col>
                    <el-col>3</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
                <el-col :span="6">
                    <el-col>人均访问时长</el-col>
                    <el-col>5:00</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
            </el-row>
            <chart  height='300px' :width='width'/>
        </el-main>
    </el-container>
</template>
<script>
import chart from './chart.vue';
export default {
    name:'traffic',
    components:{
        chart
    },
    methods:{
        pickerOption(a){
            console.log("day");
            this.width= "50%";
        },
        weekPicker(a){
            console.log("week");
            this.width= "50%";
        },
        monthPicker(a){

        },
        changeType(a){
            this.width="100%";  
        },
        getWeek(dt){
            let d1 = new Date(dt);
            let d2 = new Date(dt);
            d2.setMonth(0);
            d2.setDate(1);
            let rq = d1-d2;
            let days = Math.ceil(rq/(24*60*60*1000));
            let num = Math.ceil(days/7);
            return num;
        }
    },
    data(){
        return {
            type:'日',
            dayFmt:new Date(),
            weekFmt:new Date(),
            monthFmt:new Date(),
            width:'100%',
            options:[{
                value:'日',
                label:'按日选择'
            },{
                value:'周',
                label:'按周选择'
            },{
                value:'月',
                label:'按月选择'
            }]
        }
    }
}
</script>
<style lang="scss">
    .databoard{
        .dateType{
            text-align: right;  
        }
        .panel{
            > .el-col{
                padding: 10px;
                background: #5d5a5a;
                margin-right: 15px;
                border-radius: 6px;
                color: #fff;
                line-height: 30px;
                cursor: pointer;
                .el-col{
                    &:first-child{
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                }
                &:hover{
                    // transform: scale(1.05);
                    opacity: .9;
                    transition: opacity .2s .2s ease-in;
                }
                &:last-child{
                    margin-right: 0;
                }
            }
        }
    }
</style>
