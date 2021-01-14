<template>
      <div class="container" align="center">
        <h1>商品分类管理</h1>

        <el-tree :data="data" show-checkbox node-key="id"
      default-expand-all  :props="defaultProps" accordion>


          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="button"
                size="mini"
                @click="() => append(node,data)">
                新增
              </el-button>
              <el-button
                type="button"
                size="mini"
                @click="() => update(node,data)">
                修改
              </el-button>
              <el-button
                type="button"
                size="mini"
                @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>

        </el-tree>


        <!--新增弹框的模板-->
      <el-dialog title="新增类型信息" :visible.sync="showTypeAddForm" width="500px">
           <el-form :model="form">

             <el-form-item label="商品名称" >
               <el-input v-model="form.name" autocomplete="off" ></el-input>
             </el-form-item>

           </el-form>
           <div slot="footer" class="dialog-footer">
             <el-button @click="showTypeAddForm = false">取 消</el-button>
             <el-button type="primary" @click="saveData">提 交</el-button>
           </div>
      </el-dialog>



          <!--新增弹框的模板-->
      <el-dialog title="新增类型信息" :visible.sync="showTypeUpForm" width="500px">
           <el-form :model="upform">

             <el-form-item label="商品名称" >
               <el-input v-model="upform.name" autocomplete="off" ></el-input>
             </el-form-item>

           </el-form>
           <div slot="footer" class="dialog-footer">
             <el-button @click="showTypeUpForm = false">取 消</el-button>
             <el-button type="primary" @click="updateData">提 交</el-button>
           </div>
      </el-dialog>




      </div>
</template>

<script>
    export default {
        name: "Type",
        data(){
          return {
            data:[],
            axiosData:[],
            strData:'',
            defaultProps: {},

            showTypeAddForm:false,
            form:{
              id:null,
              name:'',
              pid:null

            },


            showTypeUpForm:false,
            upform:{
              id:null,
              name:'',
              pid:null
            }








          }
        },
        created(){

          this.queryTypeData();
        },
        methods:{
          update(node,data){
              this.showTypeUpForm=true;
              this.upform.id=data.id;
              this.upform.name=data.label;
          },
          updateData:function(){

              this.$axios.post('http://localhost:8080/api/type/update',this.$qs.stringify(this.upform)).then(data=>{
                this.showTypeUpForm = false;
                alert('修改成功');

                this.axiosData=[];
                this.queryTypeData();

              }).catch(er=>{
                alert('修改系统异常')
              });
          },
          append(node,data) {
              debugger;
              this.showTypeAddForm=true;
              this.form.pid=data.id;
          },
          saveData:function(){

              this.$axios.post('http://localhost:8080/api/type/add',this.$qs.stringify(this.form)).then(data=>{
                this.showTypeAddForm = false;
                alert('新增成功');

                this.axiosData=[];
                this.queryTypeData();

              }).catch(er=>{
                alert('新增系统异常')
              });
          },
          remove(node, data) {
            debugger;
              if (node.childNodes.length<=0) {

                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {


                  var params={};
                  params.id=data.id;
                  params.isDel=1;
                  this.$axios.post('http://localhost:8080/api/type/update',this.$qs.stringify(params)).then(res=>{
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });






                    const parent = node.parent;
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);





                  }).catch(er=>{
                    alert("删除系统异常");
                  })


                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });


              }else {
                  alert("该节点还有子节点,不可删除");
              }

          },
          chandleData:function(){

            for (let i = 0; i < this.axiosData.length; i++) {
              if (this.axiosData[i].pid==0) {
                this.diguiNode(this.axiosData[i]);
                break;
              }
            }
            debugger;
            console.log(this.strData);
            //将字符串 转为json对象
            this.data.push(JSON.parse(this.strData));
          },
          diguiNode:function(node){
             // 判断是否为父节点
               var flag=this.isParent(node.id);
               if (flag==true){
                  this.strData+='{"id":'+node.id+',"label":"'+node.name+'","children":[';
                  //拼接子节点
                 //查找此节点的子节点
                  let count=0;
                 for (let i = 0; i < this.axiosData.length; i++) {
                   if (this.axiosData[i].pid==node.id) {
                     count++;
                     this.diguiNode(this.axiosData[i]);
                      this.strData+=",";
                   }
                 }
                 //处理多余的,号
                 if(count!=0){
                   this.strData=this.strData.substr(0,this.strData.length-1);
                 }

                 //拼完整
                  this.strData+=']}';
               } else {
                   this.strData+='{"id":'+node.id+',"label":"'+node.name+'"}';
               }
          },
          isParent:function(id){
            for (let i = 0; i < this.axiosData.length; i++) {
              if (this.axiosData[i].pid==id) {
                return true;
              }
            }
            return false
          },
          queryTypeData:function () {
            this.$axios.get('http://localhost:8080/api/type/getData').then(data=>{

                this.axiosData=data.data.data;  // 把请求的数据  赋给全局
                this.chandleData();
            }).catch(er=>{
              alert('查询异常');
            });
          }
        }

    }
</script>

<style scoped>
     .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
