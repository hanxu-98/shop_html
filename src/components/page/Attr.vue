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
          <el-table-column prop="name" label="品牌名" align="center"></el-table-column>
          <el-table-column prop="nameCH" label="首字母" align="center"></el-table-column>
          <el-table-column prop="typeId" label="分类" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" align="center"></el-table-column>
          <el-table-column prop="isSKU" label="是否SKU" align="center"></el-table-column>


          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit"
                         @click="editData(scope.$index, scope.row)">编辑
              </el-button>
              <el-button type="text" icon="el-icon-delete" class="red"
                         @click="delData(scope.$index, scope.row)">删除
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
        <el-dialog title="品牌信息" :visible.sync="addFormFlag" width="30%">

          <el-form :model="saveDataForm" ref="saveDataForm"  label-width="100px">
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
      <!--新增模板-->
      <div id="updateDataDiv">
        <el-dialog title="品牌信息" :visible.sync="updateFormFlag" width="30%">

          <el-form :model="updateDataForm" ref="updateDataForm"  label-width="100px">
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


            /*类型信息*/
            typeData:[],

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
            }
          }
        },
        created(){
          this.queryData();
          this.queryTypeData();
        },
        methods:{
          editData(index,row){
            this.$axios.get('http://localhost:8080/api/attr/echoAttr?id='+row.id).then(res => {
              this.updateDataForm=res.data.data;
              this.updateFormFlag=true;
            }).catch(er => {
              alert("回显系统异常")
            });
          },

          updateData(){
            let params = this.$qs.stringify(this.updateDataForm);
            debugger;
            this.$axios.post('http://localhost:8080/api/attr/updateAttr', params).then(res => {
              //关闭弹框
              this.updateFormFlag = false;
              this.queryData();
            }).catch(er => {
              alert("修改系统异常")
            });
          },

          saveData() {
            let params = this.$qs.stringify(this.saveDataForm);
            this.$axios.post('http://localhost:8080/api/attr/saveAttr', params).then(res => {
              //关闭弹框
              this.addFormFlag = false;
              this.queryData();
            }).catch(er => {
              alert("保存系统异常")
            });
          },
          queryTypeData(){
            this.$axios.get('http://localhost:8080/api/type/getData').then(data=>{
                this.typeData=data.data.data;  // 把请求的数据  赋给全局
            }).catch(er=>{
              alert('查询分类异常');
            });
          },
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
