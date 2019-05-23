webpackJsonp([31],{NJQZ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("Gu7T"),i=a.n(n),l=a("8ghC"),s=a("7hsi"),r={components:{Pagination:a("1onU").a},data:function(){return{salesFormData:{name:"",seckillStatus:"0"},tableData:[],restartVisible:!1,restartFormData:{timeRange:[]},restartRule:{timeRange:[{validator:function(t,e,a){if(!e||e.length<=0)return a(new Error("请选择时间"));a()},trigger:"change"}]},pagination:{currentPage:1,pageSize:20,totalCount:0},loading:!1,id:"",seckillStatusList:[{label:0,value:"0"},{label:1,value:"1"},{label:2,value:"2"},{label:3,value:"3"}]}},created:function(){this.initTableList(!1),this.seckillStatusList.forEach(function(t){t.label=Object(s.j)(t.label)})},methods:{initTableList:function(t){var e=this;this.loading=!0;var a={name:this.salesFormData.name,seckillStatus:this.salesFormData.seckillStatus};a.pageNo=t?this.pagination.currentPage:1,Object(l.r)(a).then(function(t){var a=[].concat(i()(t.data));a.forEach(function(t,e){t.isDisable=t.isDisable?"已禁用":"已启用",t.date=t.gmtStartTime+" 至 "+t.gmtEndTime,t.seckillStatus=Object(s.j)(t.seckillStatus)}),e.tableData=a,e.pagination.totalCount=t.totalCount,e.pagination.pageSize=t.pageSize,e.loading=!1}).catch(function(){e.loading=!1})},onSearch:function(){this.handleCurrentChange(1)},onAdd:function(){this.$router.push({name:"addActivity"})},edit:function(t){this.$router.push({name:"editActivity",params:{id:t.id}})},openOrClose:function(t){var e=this,a={id:t.id},n="";"已启用"===t.isDisable?(a.isDisable=1,n="禁用成功"):(a.isDisable=0,n="启用成功"),Object(l.w)(a).then(function(t){e.$message({message:n,type:"success"}),e.handleCurrentChange(e.pagination.currentPage)})},restart:function(t){this.restartVisible=!0,this.restartFormData.timeRange=[],this.id=t.id},submitTime:function(t){var e=this;this.$refs[t].validate(function(t){if(t){var a={id:e.id,gmtStartTime:e.restartFormData.timeRange[0].getTime(),gmtEndTime:e.restartFormData.timeRange[1].getTime(),isDisable:0};Object(l.w)(a).then(function(t){e.$message({message:"一键重启成功",type:"success"}),e.handleCurrentChange(e.pagination.currentPage)}),e.restartVisible=!1}})},handleCurrentChange:function(t){this.pagination.currentPage=t,this.initTableList(!0)}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"salesIndex"},[a("el-form",{staticClass:"salesForm",attrs:{inline:!0,model:t.salesFormData}},[a("el-form-item",{attrs:{label:"活动名称："}},[a("el-input",{attrs:{placeholder:"请输入活动名称"},model:{value:t.salesFormData.name,callback:function(e){t.$set(t.salesFormData,"name",e)},expression:"salesFormData.name"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"状态："}},[a("el-select",{attrs:{placeholder:"全部"},model:{value:t.salesFormData.seckillStatus,callback:function(e){t.$set(t.salesFormData,"seckillStatus",e)},expression:"salesFormData.seckillStatus"}},t._l(t.seckillStatusList,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}))],1),t._v(" "),a("el-form-item",[a("el-button",{staticClass:"searchBtn",attrs:{type:"primary"},on:{click:t.onSearch}},[t._v("查询")])],1)],1),t._v(" "),a("div",{staticClass:"btn"},[a("el-button",{attrs:{type:"primary"},on:{click:t.onAdd}},[t._v("新增")])],1),t._v(" "),a("el-table",{staticClass:"listTable",staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:""}},[a("el-table-column",{attrs:{prop:"id",label:"活动ID","min-width":"125"}}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"活动名称","min-width":"125"}}),t._v(" "),a("el-table-column",{attrs:{prop:"goodsCount",label:"活动商品","min-width":"125"}}),t._v(" "),a("el-table-column",{attrs:{prop:"date",label:"有效期","min-width":"220"}}),t._v(" "),a("el-table-column",{attrs:{prop:"seckillStatus",label:"状态","min-width":"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"isDisable",label:"启用状态","min-width":"100"}}),t._v(" "),a("el-table-column",{attrs:{label:"操作","min-width":"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){t.edit(e.row)}}},[t._v("编辑")]),t._v(" "),a("el-button",{attrs:{type:"text"},on:{click:function(a){t.openOrClose(e.row)}}},[t._v("\n\t\t\t\t\t\t"+t._s("已启用"===e.row.isDisable?"禁用":"启用")+"\n\t\t\t\t\t")]),t._v(" "),"已过期"===e.row.seckillStatus?a("el-button",{attrs:{type:"text"},on:{click:function(a){t.restart(e.row)}}},[t._v("一键重启")]):t._e()]}}])})],1),t._v(" "),a("Pagination",{attrs:{pageNo:t.pagination.currentPage,pageSize:t.pagination.pageSize,totalCount:t.pagination.totalCount,handleChange:t.handleCurrentChange}}),t._v(" "),a("el-dialog",{staticClass:"restart",attrs:{title:"一键重启",visible:t.restartVisible,width:"580px"},on:{"update:visible":function(e){t.restartVisible=e}}},[a("el-form",{ref:"restartForm",attrs:{model:t.restartFormData,rules:t.restartRule}},[a("el-form-item",{attrs:{label:"活动时间:",prop:"timeRange"}},[a("el-date-picker",{attrs:{type:"datetimerange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:t.restartFormData.timeRange,callback:function(e){t.$set(t.restartFormData,"timeRange",e)},expression:"restartFormData.timeRange"}},[t._v("\n\t\t\t\t\t>")])],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.restartVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.submitTime("restartForm")}}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var c=a("VU/8")(r,o,!1,function(t){a("qdJT")},"data-v-c4a6b618",null);e.default=c.exports},baer:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,"\n.salesIndex[data-v-c4a6b618] {\n  padding: 20px;\n}\n.salesIndex b[data-v-c4a6b618] {\n  display: block;\n  padding-bottom: 15px;\n}\n.salesIndex .listTable .el-table th .cell[data-v-c4a6b618] {\n  text-align: center !important;\n}\n.salesIndex .el-form-item[data-v-c4a6b618] {\n  display: inline-block;\n}\n.salesIndex .searchBtn[data-v-c4a6b618] {\n  margin-left: 30px;\n}\n.restart[data-v-c4a6b618] .el-form-item__content {\n  padding-left: 80px;\n}\n.btn[data-v-c4a6b618] {\n  padding-bottom: 10px;\n}\n",""])},qdJT:function(t,e,a){var n=a("baer");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("rjj0")("e7400a5e",n,!0)}});