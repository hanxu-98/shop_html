<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-goods"></i> 属性表格
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>


      <div class="container">
        <div class="handle-box">
          <!--<el-button
              type="primary"
              icon="el-icon-delete"
              class="handle-del mr10"
              @click="delAllSelection"
          >批量删除</el-button>-->
          <el-input v-model="seachForm.name" placeholder="属性名" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
          <el-button type="success" icon="el-icon-plus" @click="addFormFlag=true">新增</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          class="table"
          ref="bandTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
          <el-table-column prop="typeId" label="分类" :formatter="typeIdFun" align="center"></el-table-column>
          <el-table-column prop="name" label="属性名" align="center"></el-table-column>
          <el-table-column prop="nameCH" label="首字母" align="center"></el-table-column>
          <!--<el-table-column prop="type" label="类型" align="center"></el-table-column>-->
          <el-table-column prop="isSKU" label="是否SKU" :formatter="isSKU_fun" align="center"></el-table-column>


          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit"
                         @click="editData(scope.$index, scope.row)">编辑
              </el-button>
              <el-button type="text" icon="el-icon-delete" class="red"
                         @click="delData(scope.$index, scope.row)">删除
              </el-button>
              <el-button type="text" icon="el-icon-chat-line-square" v-if="scope.row.type!=3"
                         @click="attrValueBtn(scope.$index, scope.row)">数据维护
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total,sizes,prev,pager,next,jumper"
            :current-page="seachForm.currentPage"
            :page-size="seachForm.pageSize"
            :page-sizes="pageSizes"
            :total="totalPage"
            @size-change="sizeChange"
            @current-change="pageChange"
          ></el-pagination>
        </div>
      </div>


      <!--新增模板-->
      <div id="saveDataDiv">
        <el-dialog title="属性新增"   :visible.sync="addFormFlag" width="30%">

          <el-form :model="saveDataForm" ref="saveDataForm" :rules="rules" label-width="100px">
            <el-form-item label="属性名称" prop="name">
              <el-input v-model="saveDataForm.name" width="200px"></el-input>
            </el-form-item>

            <el-form-item label="首字母" prop="nameCH">
              <el-input v-model="saveDataForm.nameCH" width="200px"></el-input>
            </el-form-item>

            <el-form-item label="分类" prop="typeId">
              <el-select v-model="saveDataForm.typeId" placeholder="请选择">
                <el-option
                  v-for="item in typeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="saveDataForm.type">
                <el-radio label="1" name="type">单选</el-radio>
                <el-radio label="2" name="type">复选</el-radio>
                <el-radio label="3" name="type">输入框</el-radio>
                <el-radio label="4" name="type">下拉框</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="是否是SKU" prop="isSKU">
              <el-radio-group v-model="saveDataForm.isSKU">
                <el-radio label="1" name="isSKU">是</el-radio>
                <el-radio label="2" name="isSKU">否</el-radio>
              </el-radio-group>
            </el-form-item>


          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addFormFlag = false">取 消</el-button>
            <el-button type="primary" @click="saveData">确 定</el-button>
          </div>
        </el-dialog>
      </div>



      <!--修改模板-->
      <div id="updateDataDiv">
        <el-dialog title="属性修改" :visible.sync="updateFormFlag" width="30%">

          <el-form :model="updateDataForm" :rules="rules" ref="updateDataForm"  label-width="100px">
            <el-form-item label="属性名称" prop="name">
              <el-input v-model="updateDataForm.name" width="200px"></el-input>
            </el-form-item>

            <el-form-item label="首字母" prop="nameCH">
              <el-input v-model="updateDataForm.nameCH" width="200px"></el-input>
            </el-form-item>

            <el-form-item label="分类" prop="typeId">
              <el-select v-model="updateDataForm.typeId" placeholder="请选择">
                <el-option
                  v-for="item in typeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="updateDataForm.type">
                <el-radio :label="1" name="type">单选</el-radio>
                <el-radio :label="2" name="type">复选</el-radio>
                <el-radio :label="3" name="type">输入框</el-radio>
                <el-radio :label="4" name="type">下拉框</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="是否是SKU" prop="isSKU">
              <el-radio-group v-model="updateDataForm.isSKU">
                <el-radio :label="1" name="isSKU">是</el-radio>
                <el-radio :label="2" name="isSKU">否</el-radio>
              </el-radio-group>
            </el-form-item>


          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="updateFormFlag = false">取 消</el-button>
            <el-button type="primary" @click="updateData">确 定</el-button>
          </div>
        </el-dialog>
      </div>







      <!--值表框-->

      <div id="valueDataTableDiv">
        <el-dialog :title="attrName" :visible.sync="valueTableFlag" width="60%">
          <div class="handle-box">
            <el-button type="success" icon="el-icon-plus" @click="addValueFormFlag=true">新增</el-button>
          </div>

          <el-table
            :data="valueData"
            border
            class="table"
            ref="valueTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
            <el-table-column prop="attrName" label="属性" align="center"></el-table-column>
            <el-table-column prop="name" label="属性值" align="center"></el-table-column>
            <el-table-column prop="nameCH" label="首字母" align="center"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit"
                           @click="editValueData(scope.$index, scope.row)">编辑
                </el-button>
                <el-button type="text" icon="el-icon-delete" class="red"
                           @click="delValueData(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-dialog>
      </div>


      <!--值新增 -->
      <div id="saveValueDataDiv">
        <el-dialog title="属性新增"  :visible.sync="addValueFormFlag" width="30%">

          <el-form :model="saveValueDataForm" ref="saveValueDataForm"  :rules="rulesValue" label-width="100px">
            <el-form-item label="属性值" prop="name">
              <el-input v-model="saveValueDataForm.name" width="200px"></el-input>
            </el-form-item>

            <el-form-item label="首字母" prop="nameCH">
              <el-input v-model="saveValueDataForm.nameCH" width="200px"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addValueFormFlag = false">取 消</el-button>
            <el-button type="primary" @click="saveValueData">确 定</el-button>
          </div>
        </el-dialog>
      </div>


      <!--值修改 -->
      <div id="updateValueDataDiv">
        <el-dialog title="属性修改" :visible.sync="updateValueFormFlag" width="30%">

          <el-form :model="updateValueDataForm" ref="updateValueDataForm" :rules="rulesValue"  label-width="100px">
            <el-form-item label="属性值" prop="name">
              <el-input v-model="updateValueDataForm.name" width="200px"></el-input>
            </el-form-item>

            <el-form-item label="首字母" prop="nameCH">
              <el-input v-model="updateValueDataForm.nameCH" width="200px"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="updateValueFormFlag = false">取 消</el-button>
            <el-button type="primary" @click="updateValueData">确 定</el-button>
          </div>
        </el-dialog>
      </div>




    </div>
</template>

<script>
    export default {
        name: "Attr",
        data(){
          return {
            /*查询*/
            seachForm:{
              name:"",
              currentPage:1,
              pageSize:5
            },
            totalPage:0,
            pageSizes:[2,3,5],
            /*表格*/
            tableData:[],

            rules: {
              name: [
                {required: true, message: '请输入属性名称', trigger: 'blur'},
                {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
              ],
              nameCH: [
                {required: true, message: '请输入属性中文名称', trigger: 'blur'},
                {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
              ],
              typeId: [
                {required: true, message: '请选择一个类型', trigger: 'change'}
              ]
            },

            /*类型信息*/
            typeData:[],
            axiosData:[],
            str:'',
            /*新增*/
            addFormFlag:false,
            saveDataForm:{
              id:null,
              name:"",
              nameCH:'',
              typeId:null,
              type:'',
              isSKU:null
            },

            /*修改*/
            updateFormFlag:false,
            updateDataForm:{
              id:null,
              name:"",
              nameCH:'',
              typeId:null,
              type:null,
              isSKU:null
            },
            /*值表格*/
            attrName:'',
            valueTableFlag:false,
            valueData:[],

            valueFormAttrId:null,


            //属性值的验证
            rulesValue: {
              name: [
                {required: true, message: '请输入属性值英文名称', trigger: 'blur'},
                {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
              ],
              nameCH: [
                {required: true, message: '请输入属性值中文名称', trigger: 'blur'},
                {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
              ]
            },

            /*值新增*/

            addValueFormFlag:false,
            saveValueDataForm:{
                id:null,
                name:'',
                nameCH:'',
                attrId:null
            },

            /*值修改*/
            updateValueFormFlag:false,
            updateValueDataForm:{
                id:null,
                name:'',
                nameCH:'',
                attrId:null
            }
          }
        },
        created(){
          this.queryData();
          this.queryTypeData();
        },
        methods:{

          delValueData(index,row){
             this.$axios.delete('http://localhost:8080/api/attr/delAttrValue?id='+row.id).then(res => {
              this.queryValueData();
            }).catch(er => {
              alert("删除值系统异常")
            });
          },


          updateValueData() {
            this.$refs['updateValueDataForm'].validate((re, obj) => {
              if (re == true) {
                var params = this.$qs.stringify(this.updateValueDataForm);
                this.$axios.post('http://localhost:8080/api/attr/saveAttrValue', params).then(res => {
                  this.updateValueFormFlag = false;
                  this.$refs['updateValueDataForm'].resetFields();
                  this.queryValueData();

                }).catch(er => {
                  alert("查询值系统异常")
                });
              }
            })
          },


          editValueData(index,row){
            this.$axios.get('http://localhost:8080/api/attr/echoAttrValue?id='+row.id).then(res => {
              this.updateValueDataForm=res.data.data;
              this.updateValueFormFlag=true;
            }).catch(er => {
              alert("值回显系统异常")
            });
          },

          saveValueData(){
            this.$refs['saveValueDataForm'].validate((re, obj) => {
              if (re == true) {
                this.saveValueDataForm.attrId = this.valueFormAttrId;
                var params = this.$qs.stringify(this.saveValueDataForm);

                this.$axios.post('http://localhost:8080/api/attr/saveAttrValue', params).then(res => {
                  alert("新增成功");
                  this.addValueFormFlag = false;
                  this.$refs['saveValueDataForm'].resetFields();
                  this.queryValueData();

                }).catch(er => {
                  alert("查询值系统异常")
                });
              }
            })


          },
          attrValueBtn(index,row){
            this.attrName=row.name;
            this.valueTableFlag=true;
            this.valueFormAttrId=row.id;
            this.queryValueData();


          },
          queryValueData(){

            this.$axios.get('http://localhost:8080/api/attr/queryAttrValue?attrId='+this.valueFormAttrId).then(res => {
              if (res.data.data.length>0){
                this.valueData = res.data.data;

              this.valueFormAttrId=res.data.data[0].attrId;
              } else {
                alert('此属性暂无值');
              }

            }).catch(er => {
              alert("查询值系统异常")
            });
          },
          isSKU_fun(row,column,cell,index){
            return cell==1?"是":cell==2?"否":"未知";
          },
          typeIdFun(row,column,cell,index){
            for (let i = 0; i < this.axiosData.length; i++) {
              if (cell==this.axiosData[i].id){
                return this.axiosData[i].name;
              }
            }
          },
          editData(index,row){
            this.$axios.get('http://localhost:8080/api/attr/echoAttr?id='+row.id).then(res => {
              this.updateDataForm=res.data.data;
              this.updateFormFlag=true;
            }).catch(er => {
              alert("回显系统异常")
            });
          },

          updateData() {
            this.$refs['updateDataForm'].validate((re, obj) => {
              if (re == true) {
                let params = this.$qs.stringify(this.updateDataForm);
                this.$axios.post('http://localhost:8080/api/attr/updateAttr', params).then(res => {
                  //关闭弹框
                  this.updateFormFlag = false;
                  this.queryData();
                }).catch(er => {
                  alert("修改系统异常")
                });
              }
            })
          },

          saveData() {
            this.$refs['saveDataForm'].validate((re, obj) => {
              if (re == true) {
                let params = this.$qs.stringify(this.saveDataForm);
                this.$axios.post('http://localhost:8080/api/attr/saveAttr', params).then(res => {
                  //关闭弹框
                  this.addFormFlag = false;
                  this.queryData();
                }).catch(er => {
                  alert("保存系统异常")
                });
              }
            })
          },
          queryTypeData(){
            this.$axios.get('http://localhost:8080/api/type/getData').then(data=>{
                this.axiosData=data.data.data;  // 把请求的数据  赋给全局
                this. getChildrenType();



                for (let i = 0; i < this.typeData.length; i++) {
                   this.str="";
                   this.createTypeData(this.typeData[i]);
                    this.typeData[i].name=this.str.split("/").reverse().join("/").substr(0,this.str.length-1);
                }

            }).catch(er=>{
              alert('查询分类异常');
            });
          },
          //得到types的数据      遍历所有ajaxtypedata
          getChildrenType: function () {
            //遍历所有的节点数据
            for (let i = 0; i < this.axiosData.length; i++) {
              let node = this.axiosData[i];
              this.isChildrenNode(node);
            }
          },

          isChildrenNode: function (node) {
            let rs = true; //标示
            for (let i = 0; i < this.axiosData.length; i++) {
              if (node.id == this.axiosData[i].pid) {
                rs = false;
                break;
              }
            }
            if (rs == true) {
              this.typeData.push(node);
            }
          },
          createTypeData(obj){
             if (obj.pid!=1){
               this.str+="/"+obj.name;
               for (let i = 0; i < this.axiosData.length; i++) {
                 if (obj.pid==this.axiosData[i].id){
                   this.createTypeData(this.axiosData[i]);
                 }
               }
             }else {
                this.str+="/"+obj.name;
             }
          },


          /*queryTypeData(){
            this.$axios.get('http://localhost:8080/api/type/getData').then(data=>{
                let li=this.axiosData=data.data.data;  // 把请求的数据  赋给全局

                for (let i = 0; i < li.length; i++) {
                   this.str="";
                    if (li[i].pid==1){
                        this.createTypeData(li[i]);
                    }
                }




            }).catch(er=>{
              alert('查询分类异常');
            });
          },
          createTypeData(obj){
              let flag=this.isParent(obj.id);
              if (flag==true){
                this.str+=obj.name+"/";
                let li = this.axiosData;
                for (let i = 0; i < li.length; i++) {
                  if (li[i].pid == obj.id) {
                    this.createTypeData(li[i]);
                  }
                }
              }
              /!*slse*!/
              else {
                let ty={};
                ty.id=obj.id;
                ty.name=this.str+obj.name;
                this.typeData.push(ty);

              }
          },
          isParent(id){
            let li = this.axiosData;
            for (let i = 0; i < li.length; i++) {
              if (li[i].pid == id) {
                return true;
                /!*return 子节点数量*!/
              }
            }
            return false;

          },*/

          queryData(){
            let params=this.$qs.stringify(this.seachForm);
            this.$axios.post('http://localhost:8080/api/attr/queryAttr',params).then(res=>{
                this.tableData=res.data.data.data;
                this.totalPage=res.data.data.totalPage;
            }).catch(er=>{
              alert("查询系统异常")
            });
          },

          delData(index,row){
            this.$axios.delete('http://localhost:8080/api/attr/delAttr?id='+row.id).then(data=>{
                  alert('删除成功');
                this.queryData();
                }).catch(er=>{
                  alert("删除异常");
                });
          },
          // 多选操作
          handleSelectionChange(val) {
            this.multipleSelection = val;
          },
          pageChange: function (currentPage) {
            this.seachForm.currentPage = currentPage;
            this.queryData();
          },
          sizeChange: function (pageSize) {
            this.seachForm.pageSize = pageSize;
            this.queryData();
          }
        }
    }
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
