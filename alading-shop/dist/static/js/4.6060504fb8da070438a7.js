webpackJsonp([4],{"8ghD":function(t,i,a){(t.exports=a("FZ+f")(!1)).push([t.i,"\n.checkGoods[data-v-13202b6c] {\n  padding-bottom: 20px;\n}\nh4[data-v-13202b6c] {\n  font-weight: 700;\n  font-size: 16px;\n  padding-bottom: 10px;\n}\n.imgBox[data-v-13202b6c] {\n  width: 60px;\n  height: 60px;\n}\n.imgBox img[data-v-13202b6c] {\n  width: auto;\n  max-height: 100%;\n}\n",""])},"9WEG":function(t,i,a){(t.exports=a("FZ+f")(!1)).push([t.i,"\n.tip[data-v-0c03233d] {\n  text-align: right;\n  color: #999;\n  padding-bottom: 5px;\n}\n.btnBox[data-v-0c03233d] {\n  padding-top: 30px;\n  padding-right: 50px;\n  text-align: right;\n}\n.cell .el-form-item[data-v-0c03233d] {\n  margin-bottom: 0;\n}\n.cell .el-form-item.is-success[data-v-0c03233d] .el-input__inner {\n  border-color: #dcdfe6;\n}\n.cell .el-form-item__error[data-v-0c03233d] {\n  display: none;\n}\n.el-table--medium td[data-v-0c03233d],\n.el-table--medium th[data-v-0c03233d] {\n  padding: 2px 0;\n}\n.imgBox[data-v-0c03233d] {\n  width: 60px;\n  height: 60px;\n}\n.imgBox img[data-v-0c03233d] {\n  width: auto;\n  max-height: 100%;\n}\n.limit[data-v-0c03233d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n.limit li[data-v-0c03233d] {\n  width: 300px;\n  padding-bottom: 10px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.limit .title[data-v-0c03233d] {\n  width: 130px;\n}\n.limit .content[data-v-0c03233d] {\n  color: #666;\n}\n",""])},Cf94:function(t,i,a){(t.exports=a("FZ+f")(!1)).push([t.i,"\n.card[data-v-27dea4ae] {\n  margin-bottom: 20px;\n}\n.card h4[data-v-27dea4ae] {\n  font-weight: 700;\n  padding-bottom: 20px;\n  font-size: 16px;\n}\n.card ul[data-v-27dea4ae] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n.card ul li[data-v-27dea4ae] {\n  width: 40%;\n  padding-bottom: 30px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.card ul li.statusLi[data-v-27dea4ae] {\n  width: 100%;\n}\n.card ul span[data-v-27dea4ae] {\n  vertical-align: middle;\n}\n.card ul .title[data-v-27dea4ae] {\n  width: 130px;\n}\n.card ul .content[data-v-27dea4ae] {\n  color: #666;\n}\n",""])},DCvx:function(t,i,a){var e=a("SvP+");"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);a("rjj0")("4d62d383",e,!0)},EY4V:function(t,i,a){var e=a("8ghD");"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);a("rjj0")("38a863df",e,!0)},FR6e:function(t,i,a){var e=a("Cf94");"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);a("rjj0")("0a433954",e,!0)},"SvP+":function(t,i,a){(t.exports=a("FZ+f")(!1)).push([t.i,"\n.activityDetail[data-v-dee42186] {\n  padding: 20px;\n}\n.btn[data-v-dee42186] {\n  padding-bottom: 30px;\n}\n.btn span[data-v-dee42186] {\n  margin-left: 10px;\n}\n",""])},Uyx3:function(t,i,a){var e=a("9WEG");"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);a("rjj0")("13ed6e40",e,!0)},Ypil:function(t,i,a){"use strict";var e=a("Gu7T"),n=a.n(e),s=a("1onU"),o=a("8ghC"),l={props:["id","goodsId","callback","limit"],components:{Pagination:s.a},data:function(){var t=this;return{model:{rules:{specialPrice:[{validator:function(i,a,e){if(a&&(a=+a),!a)return t.$message({type:"warning",message:"活动价不能为空"}),e(new Error(""));var n=i.field.slice(i.field.indexOf(".")+1,i.field.lastIndexOf(".")),s=+t.model.tableData[n].saleAmount,o="售价";if(t.limit.priceDemand&&+t.limit.priceDemand<s?o=s=+t.limit.priceDemand:t.limit.priceDisDemand&&(s=s*+t.limit.priceDisDemand/10,o="售价的"+t.limit.priceDisDemand+"折"),a>s)return t.$message({type:"warning",message:"活动价不能大于"+o}),e(new Error(""));e()},trigger:"blur"}],limitCount:[{validator:function(i,a,e){if(a&&(a=+a),!a)return t.$message({type:"warning",message:"活动库存不能为空"}),e(new Error(""));var n=i.field.slice(i.field.indexOf(".")+1,i.field.lastIndexOf("."));return a>t.model.tableData[n].stock?(t.$message({type:"warning",message:"活动库存不能大于该规格剩余库存"}),e(new Error(""))):t.amountLimitJudge(t.model.tableData[n].goodsId)?(t.$message({type:"warning",message:"商品活动库存不符合要求"}),e(new Error(""))):void e()},trigger:"blur"}]},tableData:[]},totalData:[],pageNo:1,pageSize:20,totalCount:0,times:0,type:null,min:0,max:0,deleteIds:[]}},created:function(){this.init()},computed:{priceLimit:function(){return this.limit.priceDemand?"<= "+this.limit.priceDemand+"元":this.limit.priceDisDemand?"<= "+this.limit.priceDisDemand+"折":"不限"},stockLimit:function(){return this.limit.minAmount&&this.limit.maxAmount?this.limit.minAmount+" ~ "+this.limit.maxAmount:this.limit.minAmount?">= "+this.limit.minAmount:this.limit.maxAmount?"<= "+this.limit.maxAmount:"不限"}},methods:{init:function(){if(console.log(this.limit),this.type=this.$route.query.type,this.min=this.$route.query.min||this.limit.pintuanManMin,this.max=this.$route.query.max||this.limit.pintuanManMax,this.limit.editTimes?this.times=this.limit.editTimes:this.times=this.$route.query.min||this.limit.pintuanManMin,this.goodsId)this.getTypeGoodsList(this.goodsId);else{var t=JSON.parse(localStorage.getItem("joinableActivityGoods"));if(t&&+t.activityId==+this.$route.query.id){var i=t.data.map(function(t){return t.id}).join();this.getTypeGoodsList(i)}}},getPeopleNum:function(t){return t<=this.min?(this.times=this.min,!1):t>=this.max?(this.times=this.max,!1):void 0},handleChange:function(t){console.log(t)},getTypeGoodsList:function(t){var i=this,a={activityEnterId:this.id},e=null;this.goodsId?(e=o.k,a.goodsId=t):(e=o.s,a.goodsIds=t),e(a).then(function(t){i.totalData=t.data,i.totalCount=i.totalData.length,i.totalData.forEach(function(t){t.specialPrice||(t.specialPrice=void 0),t.limitCount||(t.limitCount=void 0)}),0!==i.totalCount||i.goodsId||i.$message({type:"warning",message:"您选择的商品都已存在报名详情列表，请返回重选",duration:5e3}),i.getTableData()})},handleCurrentChange:function(t){var i;(i=this.totalData).splice.apply(i,[this.pageSize*(this.pageNo-1),this.model.tableData.length].concat(n()(this.model.tableData))),this.$refs.checkForm.clearValidate(),this.pageNo=t,this.getTableData()},getTableData:function(){var t=this.pageSize*(this.pageNo-1);this.pageNo>=this.totalCount/this.pageSize?(this.model.tableData=this.totalData.slice(t),this.model.tableData.length<=0&&this.pageNo>1&&(this.pageNo--,this.getTableData())):this.model.tableData=this.totalData.slice(t,t+this.pageSize)},delGoods:function(t){var i=this;this.$confirm("确定删除该项？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){i.totalData.splice(i.pageSize*(i.pageNo-1)+t.$index,1),i.totalCount=i.totalData.length,i.getTableData(),i.$refs.checkForm.clearValidate(),i.deleteIds.push(t.row.id)}).catch(function(){})},submitList:function(t){var i=this;this.$refs.checkForm.validate(function(t,a){if(t&&i.globalValidate()){var e={activityEnterId:+i.id,activityEnterGoodsVos:[],times:i.times};i.totalData.forEach(function(t,a){var n={goodsId:t.goodsId,priceId:t.priceId,specialPrice:t.specialPrice,limitCount:t.limitCount};i.goodsId&&(n.id=t.id),e.activityEnterGoodsVos.push(n)}),i.goodsId?(e.enterActivityGoodsIds=i.deleteIds.join(),Object(o.G)(e).then(function(t){i.$emit("callback",{isSubmit:!0}),i.$message({type:"success",message:"保存成功"})})):Object(o.B)(e).then(function(t){localStorage.removeItem("joinableActivityGoods"),i.$message({type:"success",message:"提交成功"}),i.$router.push({name:"joinableActivityDetail",query:{id:i.id,type:i.type}})})}})},globalValidate:function(){for(var t=this,i=0;i<this.totalData.length;i++)if(this.priceValidate(this.totalData[i])||this.amountValidate(this.totalData[i])){var a=i>=this.pageSize?Math.ceil((i+1)/this.pageSize):1;return this.handleCurrentChange(a),this.$nextTick(function(){t.$refs.checkForm.validate(function(){})}),!1}return!0},priceValidate:function(t){var i=+t.saleAmount;if(this.limit.priceDemand&&+this.limit.priceDemand<i?i=+this.limit.priceDemand:this.limit.priceDisDemand&&(i=i*+this.limit.priceDisDemand/10),!t.specialPrice||t.specialPrice>i)return!0},amountValidate:function(t){if((t.limitCount||0===t.limitCount)&&(!t.limitCount||t.limitCount>t.stock||this.amountLimitJudge(t.goodsId)))return!0},amountLimitJudge:function(t){var i={};this.totalData.forEach(function(t,a){i[t.goodsId]||(i[t.goodsId]=[]),i[t.goodsId].push(t)});for(var a=0,e=0;e<i[t].length;e++){if(!i[t][e].limitCount)return!1;a+=+i[t][e].limitCount}return!!(this.limit.minAmount&&a<+this.limit.minAmount)||(!!(this.limit.maxAmount&&a>+this.limit.maxAmount)||void 0)},goBack:function(){this.goodsId?this.$emit("callback",{isSubmit:!1}):this.$router.push({name:"joinableActivityDetail",query:{id:this.id}})}}},d={render:function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"editGoods"},[a("ul",{staticClass:"limit"},[a("li",[a("span",{staticClass:"title"},[t._v("商品活动库存要求：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.stockLimit))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("商品活动价格要求：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.priceLimit))])])]),t._v(" "),a("p",{staticClass:"tip"},[t._v("商品活动库存要求，是针对同一商品下所有规格的活动库存之和")]),t._v(" "),a("el-form",{ref:"checkForm",attrs:{model:t.model,rules:t.model.rules}},[a("el-table",{attrs:{data:t.model.tableData,stripe:""}},[a("el-table-column",{attrs:{prop:"goodsId",label:"商品ID"}}),t._v(" "),a("el-table-column",{attrs:{label:"商品图片"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("div",{staticClass:"imgBox"},[a("img",{attrs:{src:t.row.goodsIcon,alt:""}})])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"商品名称","min-width":"150"}}),t._v(" "),a("el-table-column",{attrs:{prop:"specNames",label:"规格","min-width":"150"}}),t._v(" "),a("el-table-column",{attrs:{prop:"saleAmount",label:"售价"}}),t._v(" "),a("el-table-column",{attrs:{prop:"stock",label:"库存"}}),t._v(" "),a("el-table-column",{attrs:{label:"活动价","min-width":"120"},scopedSlots:t._u([{key:"default",fn:function(i){return[a("el-form-item",{attrs:{prop:"tableData."+i.$index+".specialPrice",rules:t.model.rules.specialPrice}},[a("el-input-number",{attrs:{size:"small","controls-position":"right",min:.01,step:.01,precision:2},model:{value:i.row.specialPrice,callback:function(a){t.$set(i.row,"specialPrice",a)},expression:"scope.row.specialPrice"}})],1)]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"活动库存","min-width":"120"},scopedSlots:t._u([{key:"default",fn:function(i){return[a("el-form-item",{attrs:{prop:"tableData."+i.$index+".limitCount",rules:t.model.rules.limitCount}},[a("el-input-number",{attrs:{size:"small","controls-position":"right",min:1,step:1,precision:0},model:{value:i.row.limitCount,callback:function(a){t.$set(i.row,"limitCount",a)},expression:"scope.row.limitCount"}})],1)]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(i){return[a("a",{on:{click:function(a){a.preventDefault(),t.delGoods(i)}}},[t._v("删除")])]}}])})],1)],1),t._v(" "),a("Pagination",{attrs:{pageNo:t.pageNo,pageSize:t.pageSize,totalCount:t.totalCount,handleChange:t.handleCurrentChange}}),t._v(" "),4==t.type?[a("p",{},[a("span",[t._v("成团人数：")]),t._v(" "),0==t.max&&0==t.min?a("span",[t._v("不限")]):a("el-input-number",{attrs:{step:1,min:+t.min,max:+t.max,precision:0},on:{change:t.getPeopleNum},model:{value:t.times,callback:function(i){t.times=i},expression:"times"}})],1),t._v(" "),0!=t.max&&0!=t.min?a("p",{staticStyle:{color:"red","margin-top":"10px","font-size":"12px"}},[t._v("(成团人数必填大于等于"+t._s(t.min)+"且小于等于"+t._s(t.max)+"的正整数)")]):t._e()]:t._e(),t._v(" "),a("div",{staticClass:"btnBox"},[t.model.tableData.length>0?a("el-button",{attrs:{type:"primary"},on:{click:function(i){t.submitList()}}},[t._v("\n        "+t._s(t.goodsId?"保存":"确认提交")+"\n      ")]):a("el-button",{on:{click:function(i){t.goBack()}}},[t._v("\n        "+t._s(t.goodsId?"关闭":"返回重选")+"\n      ")])],1)],2)},staticRenderFns:[]};var c=a("VU/8")(l,d,!1,function(t){a("Uyx3")},"data-v-0c03233d",null);i.a=c.exports},kJAB:function(t,i,a){"use strict";var e=a("9ZUB"),n=a("7hsi"),s=a("GKmE"),o={props:["data","isJoined","type"],components:{ImgPreview:e.a},filters:{activityTypeTrans:n.a,formatTimestamp:s.c,joinedActivityStatusTrans:n.h},computed:{baseInfo:function(){return this.data&&this.data.baseInfo?this.data.baseInfo:{}},demand:function(){if(this.data&&this.data.demand){var t=this.data.demand;return t.goodsAmountDemand?t.priceLimit="<= "+t.goodsAmountDemand+"元":t.goodsAmountDiscountDemand&&(t.priceLimit="<= "+t.goodsAmountDiscountDemand+"折"),t.goodsStockDemandMin&&(t.stockLimit=">= "+t.goodsStockDemandMin),t.goodsStockDemandMax&&(t.stockLimit="<= "+t.goodsStockDemandMax),t.goodsStockDemandMin&&t.goodsStockDemandMax&&(t.stockLimit=t.goodsStockDemandMin+" ~ "+t.goodsStockDemandMax),t}return{}}}},l={render:function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"activityInfo"},[a("el-card",{staticClass:"baseInfo card"},[a("h4",[t._v("活动基本信息")]),t._v(" "),a("ul",[t.isJoined?a("li",{staticClass:"statusLi"},[a("span",{staticClass:"title"},[t._v("活动状态：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t._f("joinedActivityStatusTrans")(t.baseInfo.status)))])]):t._e(),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("活动类型：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t._f("activityTypeTrans")(t.baseInfo.activityType)))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("活动名称：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.baseInfo.name))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("活动展现位置：")]),t._v(" "),a("span",{staticClass:"content"},[a("ImgPreview",{attrs:{imgList:[t.baseInfo.showAddress]}})],1)]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("活动起止时间：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.baseInfo.time))])]),t._v(" "),2===t.baseInfo.activityType?a("li",[a("span",{staticClass:"title"},[t._v("活动力度：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.baseInfo.level))])]):t._e()])]),t._v(" "),t.isJoined?t._e():a("el-card",{staticClass:"demand card"},[a("h4",[t._v("活动报名要求")]),t._v(" "),a("ul",[a("li",[a("span",{staticClass:"title"},[t._v("类目要求：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.demand.categoryDemand?t.demand.categoryDemand:"不限"))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("品牌要求：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.demand.brandDemand?t.demand.brandDemand:"不限"))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("商品销量要求：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.demand.goodsSaleDemand?">= "+t.demand.goodsSaleDemand:"不限"))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v(t._s(2===t.baseInfo.activityType?"商品库存要求：":"商品活动库存要求："))]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.demand.stockLimit?t.demand.stockLimit:"不限"))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v(t._s(2===t.baseInfo.activityType?"商品价格要求：":"商品活动价格要求："))]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.demand.priceLimit?t.demand.priceLimit:"不限"))])]),t._v(" "),4==t.type?a("li",[a("span",{staticClass:"title"},[t._v("商品成团人数要求：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(0==t.demand.pintuanManMin&&0==t.demand.pintuanManMax?"不限":t.demand.pintuanManMin+"-"+t.demand.pintuanManMax+"人"))])]):t._e(),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("商品运费要求：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(2===t.demand.freightType?"包邮（活动期间用户下单默认包邮）":"不限"))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("报名商品数量限制：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t.demand.goodsCountDemand?"<= "+t.demand.goodsCountDemand:"不限"))])]),t._v(" "),a("li",[a("span",{staticClass:"title"},[t._v("报名结束时间：")]),t._v(" "),a("span",{staticClass:"content"},[t._v(t._s(t._f("formatTimestamp")(t.demand.gmtEnd)))])])])])],1)},staticRenderFns:[]};var d=a("VU/8")(o,l,!1,function(t){a("FR6e")},"data-v-27dea4ae",null);i.a=d.exports},rBWC:function(t,i,a){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var e=a("Dd8w"),n=a.n(e),s=a("mvHQ"),o=a.n(s),l=a("xkLq"),d=a("1onU"),c=a("Ypil"),r=a("8ghC"),m=a("7hsi"),u={props:["id","type","onChange","limit"],components:{Pagination:d.a,EditGoods:c.a},filters:{joinableGoodsStatusTrans:m.g},data:function(){return{tableData:[],pagination:{currentPage:1,pageSize:20,totalCount:0},dialogVisible:!1,goodsId:""}},created:function(){var t=this;setTimeout(function(){t.getTableData()},1)},methods:{getTableData:function(){var t=this,i={pageNo:this.pagination.currentPage,activityEnterId:this.id,activityType:1};Object(r.n)(i).then(function(a){if(a.data.length<=0&&i.pageNo>1)t.handleCurrentChange(1);else{t.tableData=a.data,t.pagination.totalCount=a.totalCount,t.pagination.pageSize=a.pageSize;var e=0;t.tableData.forEach(function(t){switch(t.verify){case 1:t.verify=1;break;case 2:case 3:t.verify=2;break;case 4:t.verify=3;break;case 5:case 6:t.verify=4;break;case 7:case 8:t.verify=5;break;default:t.verify=0}[2,3].indexOf(t.verify)>-1&&e++}),t.$emit("onChange",{totalLen:a.totalCount,submitLen:e})}})},handleCurrentChange:function(t){this.pagination.currentPage=t,this.getTableData()},onCancel:function(t){var i=this;this.$confirm("确定取消审核?","提示",{confirmButtonText:"确定",cancelButtonText:"再想想",type:"warning"}).then(function(){var a={goodsId:t.goodsId,activityEnterId:i.id,activityEnterGoodsId:t.id};Object(r.C)(a).then(function(t){i.$message({type:"success",message:"取消成功"}),i.getTableData()})}).catch(function(){})},onSubmit:function(t){var i=this,a={goodsId:t.goodsId,activityEnterId:this.id,activityEnterGoodsId:t.id};Object(r.J)(a).then(function(t){i.$message({type:"success",message:"提交成功"}),i.getTableData()})},onEdit:function(t,i){this.goodsId=t,this.limit.editTimes=i,this.dialogVisible=!0},onDialog:function(t){this.dialogVisible=!1,t.isSubmit&&this.getTableData()}}},p={render:function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"checkGoods"},[a("el-card",[a("h4",[t._v("报名的商品")]),t._v(" "),a("el-table",{attrs:{data:t.tableData,stripe:""}},[a("el-table-column",{attrs:{prop:"goodsId",label:"商品ID"}}),t._v(" "),a("el-table-column",{attrs:{label:"商品图片"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("div",{staticClass:"imgBox"},[a("img",{attrs:{src:t.row.goodsIcon,alt:""}})])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"商品名称","min-width":"150"}}),t._v(" "),2!==t.type?a("el-table-column",{attrs:{label:"售价"},scopedSlots:t._u([{key:"default",fn:function(i){return[a("span",[t._v(t._s(i.row.minSaleAmount))]),t._v(" "),i.row.minSaleAmount!==i.row.maxSaleAmount?a("span",[t._v("-")]):t._e(),t._v(" "),i.row.minSaleAmount!==i.row.maxSaleAmount?a("span",[t._v(t._s(i.row.maxSaleAmount))]):t._e()]}}])}):t._e(),t._v(" "),2!==t.type?a("el-table-column",{attrs:{prop:"specialPrice",label:"活动价"},scopedSlots:t._u([{key:"default",fn:function(i){return[a("span",[t._v(t._s(i.row.minSpecialPrice))]),t._v(" "),i.row.minSpecialPrice!==i.row.maxSpecialPrice?a("span",[t._v("-")]):t._e(),t._v(" "),i.row.minSpecialPrice!==i.row.maxSpecialPrice?a("span",[t._v(t._s(i.row.maxSpecialPrice))]):t._e()]}}])}):t._e(),t._v(" "),2!==t.type?a("el-table-column",{attrs:{prop:"limitCount",label:"活动库存"}}):t._e(),t._v(" "),a("el-table-column",{attrs:{label:"审核状态"},scopedSlots:t._u([{key:"default",fn:function(i){return[a("span",[t._v(t._s(t._f("joinableGoodsStatusTrans")(i.row.verify)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"备注"},scopedSlots:t._u([{key:"default",fn:function(i){return[[4,5].indexOf(i.row.verify)>-1?a("span",[t._v(t._s(i.row.remark))]):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作","min-width":2!==t.type?120:40},scopedSlots:t._u([{key:"default",fn:function(i){return[2===i.row.verify?a("el-button",{attrs:{type:"text"},on:{click:function(a){t.onCancel(i.row)}}},[t._v("取消")]):t._e(),t._v(" "),[1,5].indexOf(i.row.verify)>-1&&2!==t.type?a("el-button",{attrs:{type:"text"},on:{click:function(a){t.onEdit(i.row.goodsId,i.row.times)}}},[t._v("编辑")]):t._e(),t._v(" "),[1,5].indexOf(i.row.verify)>-1?a("el-button",{attrs:{type:"text"},on:{click:function(a){t.onSubmit(i.row)}}},[t._v("提交")]):t._e()]}}])})],1),t._v(" "),a("Pagination",{attrs:{pageNo:t.pagination.currentPage,pageSize:t.pagination.pageSize,totalCount:t.pagination.totalCount,handleChange:t.handleCurrentChange}})],1),t._v(" "),a("el-dialog",{attrs:{title:"编辑",visible:t.dialogVisible,width:"90%","close-on-click-modal":!1},on:{"update:visible":function(i){t.dialogVisible=i}}},[t.dialogVisible?a("EditGoods",{attrs:{id:t.id,goodsId:t.goodsId,limit:t.limit},on:{callback:t.onDialog}}):t._e()],1)],1)},staticRenderFns:[]};var v=a("VU/8")(u,p,!1,function(t){a("EY4V")},"data-v-13202b6c",null).exports,f={components:{ActivityInfo:a("kJAB").a,GoodsSelect:l.a,ListGoods:v},data:function(){return{id:"",type:null,infoData:{baseInfo:{},demand:{}},isJoined:!1,api:r.o,visible:!1,joinedCount:0,limit:{}}},created:function(){this.getParams(),this.getActivityInfo()},methods:{getParams:function(){this.id=this.$route.query.id,this.type=this.$route.query.type},getActivityInfo:function(){var t=this,i={id:this.id,activityType:1};Object(r.m)(i).then(function(i){t.infoData={baseInfo:{activityType:i.data.afActivityEnterDo.activityType,name:i.data.name,showAddress:i.data.afActivityEnterDo.showAddress,time:i.data.gmtStartTime+" 至 "+i.data.gmtEndTime,level:Object(m.f)(i.data.type,i.data.threshold,i.data.discountAmount,i.data.discountType)},demand:i.data.afActivityEnterDo},t.limit.pintuanManMax=t.infoData.demand.pintuanManMax,t.limit.pintuanManMin=t.infoData.demand.pintuanManMin,t.infoData.demand.goodsStockDemandMin&&(t.limit.minAmount=t.infoData.demand.goodsStockDemandMin),t.infoData.demand.goodsStockDemandMax&&(t.limit.maxAmount=t.infoData.demand.goodsStockDemandMax),t.infoData.demand.goodsAmountDemand&&(t.limit.priceDemand=t.infoData.demand.goodsAmountDemand),t.infoData.demand.goodsAmountDiscountDemand&&(t.limit.priceDisDemand=t.infoData.demand.goodsAmountDiscountDemand)})},addBtn:function(){this.visible=!0},saveGoods:function(t){var i=this;if(2===this.infoData.baseInfo.activityType){var a={activityEnterId:this.id,goodsId:t.map(function(t){return t.id}).join()};Object(r.y)(a).then(function(t){i.$message({type:"success",message:"保存成功"}),i.getActivityInfo(),i.$refs.goodsRef.getTableData()})}else{var e={activityId:this.id+"",data:t};localStorage.setItem("joinableActivityGoods",o()(e)),this.$router.push({name:"joinableEditActivityGoods",query:n()({id:this.id,type:this.type,min:this.infoData.demand.pintuanManMin,max:this.infoData.demand.pintuanManMax},this.limit)})}},onChange:function(t){this.isJoined=t.totalLen>0,this.joinedCount=t.submitLen}}},g={render:function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"activityDetail"},[a("ListGoods",{directives:[{name:"show",rawName:"v-show",value:t.isJoined,expression:"isJoined"}],ref:"goodsRef",attrs:{id:t.id,type:t.infoData.baseInfo.activityType,limit:t.limit},on:{onChange:t.onChange}}),t._v(" "),t.isJoined?a("div",{staticClass:"chooseButton btn"},[a("el-button",{attrs:{type:"primary",disabled:!!t.infoData.demand.goodsCountDemand&&t.joinedCount===t.infoData.demand.goodsCountDemand},on:{click:t.addBtn}},[t._v("添加报名商品")]),t._v(" "),t.infoData.demand.goodsCountDemand?a("span",[t._v("\n      "+t._s("已/可提交商品数量（"+t.joinedCount+" / "+t.infoData.demand.goodsCountDemand+"）")+"\n    ")]):t._e()],1):t._e(),t._v(" "),a("ActivityInfo",{ref:"infoRef",attrs:{data:t.infoData,type:t.type}}),t._v(" "),t.isJoined?t._e():a("div",{staticClass:"chooseButton"},[a("el-button",{attrs:{type:"primary"},on:{click:t.addBtn}},[t._v("选择报名商品")])],1),t._v(" "),a("GoodsSelect",{attrs:{isShow:t.visible,onSubmit:t.saveGoods,replace:{api:t.api,params:{activityEnterId:this.id}}},on:{"update:isShow":function(i){t.visible=i}}})],1)},staticRenderFns:[]};var h=a("VU/8")(f,g,!1,function(t){a("DCvx")},"data-v-dee42186",null);i.default=h.exports}});