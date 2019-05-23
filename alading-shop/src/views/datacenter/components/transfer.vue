<template>
        <el-container>
        <el-header>
            <el-row>
                <el-col :span="12">
                    <span>交易转化看板</span>
                </el-col>
                <el-col :span="12" class="dateType">
                    <el-select placeholder="请选择日期模式" v-model="type">
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
                     />
                    <el-date-picker
                        v-model="weekFmt"
                        type="week"
                        format="yyyy 第 WW 周"
                        placeholder="选择周"
                        v-if="type == '周'"
                    />
                    <el-date-picker
                    v-model="monthFmt"
                    type="month"
                    placeholder="选择月"
                    v-if="type == '月'"
                    />
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row type="flex" class="panel">
                <el-col :span="4">
                    <el-col>下单数</el-col>
                    <el-col>1000</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
                <el-col :span="4">
                    <el-col>支付订单数</el-col>
                    <el-col>1000</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
                <el-col :span="4">
                    <el-col>下单转化率</el-col>
                    <el-col>3</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
                <el-col :span="4">
                    <el-col>支付转化率</el-col>
                    <el-col>3%</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
                <el-col :span="4">
                    <el-col>支付金额</el-col>
                    <el-col>￥50.00</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
                <el-col :span="4">
                    <el-col>客单价</el-col>
                    <el-col>￥50.00</el-col>
                    <el-col>较前一{{type}} <span>10.00%↓</span></el-col>
                </el-col>
            </el-row>
            <chart  height='300px' width='100%' id="transfer"/>
        </el-main>
    </el-container>
</template>
<script>
import chart from './chart.vue';
export default {
    components:{
        chart
    },
    methods:{
        pickerOption(a){
        },
        weekPicker(a){
        },
        monthPicker(a){
            
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

