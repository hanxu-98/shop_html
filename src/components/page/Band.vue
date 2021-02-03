<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-goods"></i> 基础表格
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
                <el-input v-model="query.name" placeholder="品牌名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
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
                <el-table-column prop="bandE" label="首字母" align="center"></el-table-column>


                <el-table-column prop="imgpath" label="Log(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.imgpath"
                            :preview-src-list="[scope.row.imgpath]"
                        ></el-image>
                    </template>
                </el-table-column>

              <el-table-column prop="bandDesc" label="描述" align="center"></el-table-column>
                <el-table-column prop="ord" label="排序" align="center"></el-table-column>
                <!--<el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column>-->

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-edit"
                            @click="bandEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="bandDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total,sizes,prev,pager,next,jumper"
                    :current-page="query.currentPage"
                    :page-size="query.pageSize"
                    :page-sizes="pageSizes"
                    :total="totalPage"
                    @size-change="sizeChange"
                    @current-change="pageChange"
                ></el-pagination>
            </div>
        </div>






        <div id="saveDataDiv">
          <el-dialog title="品牌信息"   :visible.sync="addFormFlag" width="30%">

            <el-form :model="saveBandForm" ref="saveBandForm"  :rules="rule"  label-width="80px">
              <el-form-item label="品牌名称" prop="name">
                <el-input v-model="saveBandForm.name"  width="200px"></el-input>
              </el-form-item>

               <el-form-item label="首字母" prop="bandE">
                 <el-input v-model="saveBandForm.bandE"  width="200px"></el-input>
              </el-form-item>

               <el-form-item label="图片">
                 <el-upload
                   class="upload-demo"
                   action="http://localhost:8080/api/band/upload"
                   :on-success="imgCallBack"
                   name="image"
                   list-type="picture">
                   <el-button size="small" type="primary">点击上传</el-button>
                 </el-upload>
              </el-form-item>

              <el-form-item label="描述" prop="bandDesc">
                <el-input v-model="saveBandForm.bandDesc" type="textarea" maxlength="200" show-word-limit></el-input>
              </el-form-item>

              <el-form-item label="排序" prop="ord">
                <el-input-number v-model="saveBandForm.ord"  :min="1" :max="9999" label="描述文字"></el-input-number>
              </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addFormFlag = false">取 消</el-button>
              <el-button type="primary" @click="saveBandData">确 定</el-button>
            </div>
          </el-dialog>
        </div>





        <div id="updateDataDiv">
          <el-dialog title="品牌信息"   :visible.sync="updateFormFlag" width="30%">

            <el-form :model="upBandForm" ref="upBandForm"    label-width="80px">
              <el-form-item label="品牌名称" prop="name">
                <el-input v-model="upBandForm.name"  width="200px"></el-input>
              </el-form-item>

               <el-form-item label="首字母" prop="bandE">
                 <el-input v-model="upBandForm.bandE"  width="200px"></el-input>
              </el-form-item>

               <el-form-item label="图片">
                 <el-upload
                   class="upload-demo"
                   action="http://localhost:8080/api/band/upload"
                   :on-success="upimgCallBack"
                   name="image"
                   list-type="picture">
                   <el-button size="small" type="primary">点击上传</el-button>
                 </el-upload>
              </el-form-item>

              <el-form-item label="描述" prop="bandDesc">
                <el-input v-model="upBandForm.bandDesc" maxlength="200" show-word-limit type="textarea" ></el-input>
              </el-form-item>

              <el-form-item label="排序" prop="ord">
                <el-input-number v-model="upBandForm.ord"  :min="1" :max="9999" label="描述文字"></el-input-number>
              </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="updateFormFlag = false">取 消</el-button>
              <el-button type="primary" @click="updateBandData">确 定</el-button>
            </div>
          </el-dialog>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Band",
        data(){


          return {
            query:{
              name:"",
              currentPage:1,
              pageSize:5
            },
            totalPage:0,
            pageSizes:[2,3,5],

            tableData:[],



            rule: { //from的验证规则
                  name: [ // form表单自己提供的验证规则
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
                  ]
            },



            addFormFlag:false,
            saveBandForm:{
              name:'',
              bandE:'',
              imgpath:'',
              bandDesc:'',
              ord:1
            },
            updateFormFlag:false,
            upBandForm:{
              name:'',
              bandE:'',
              imgpath:'',
              bandDesc:'',
              ord:1
            }
          }
        },
        created(){
            this.queryBand();
        },
        methods:{
            saveBandData(){

              this.$refs['saveBandForm'].validate((res,obj)=>{
                debugger;
                if (res==true){

                  var saveParam=this.$qs.stringify(this.saveBandForm);
                  this.$axios.post('http://localhost:8080/api/band/saveBand',saveParam).then(res=>{
                     //关闭弹框
                      this.addFormFlag=false;
                      this.$refs['saveBandForm'].resetFields();
                      this.queryBand();
                  }).catch(er=>{
                    alert("保存系统异常")
                  });
                }
              })
            },
            updateBandData(){
              var updateParam=this.$qs.stringify(this.upBandForm);
                  this.$axios.post('http://localhost:8080/api/band/saveBand',updateParam).then(res=>{
                     //关闭弹框
                      this.updateFormFlag=false;
                      this.$refs['upBandForm'].resetFields();
                      this.queryBand();
                  }).catch(er=>{
                    alert("保存系统异常")
                  });
            },
            imgCallBack(response, file, fileList){//图片上传的回调函数
                this.saveBandForm.imgpath=response.filePath;
            },
            upimgCallBack(response, file, fileList){//图片上传的回调函数
                this.upBandForm.imgpath=response.filePath;
            },

            bandEdit(index,row){
                this.updateFormFlag=true;
                this.upBandForm=row;

            },
            bandDelete(index,row){
              this.$axios.delete('http://localhost:8080/api/band/delBand?id='+row.id).then(data=>{
                  alert('删除成功');
                this.queryBand();
                }).catch(er=>{
                  alert("删除异常");
                });
            },
            queryBand(){
              this.$axios.post('http://localhost:8080/api/band/queryBand',this.$qs.stringify(this.query))
                .then(res=>{
                  debugger;
                  this.tableData=res.data.data.data;
                  this.totalPage=res.data.data.totalPage;
                }).catch(er=>{
                  alert('查询系统异常')
              });
            },
              // 多选操作
            handleSelectionChange(val) {
              this.multipleSelection = val;
            },

            pageChange:function (currentPage) {
              this.query.currentPage=currentPage;
              this.queryBand();
            },
            sizeChange:function (pageSize) {
               this.query.pageSize=pageSize;
               this.queryBand();
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

