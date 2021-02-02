<template>
    <div>
      <div class="container" align="center">
        <h1>权限管理</h1>

         <el-tree :data="data" show-checkbox node-key="id"
      default-expand-all  :props="defaultProps" accordion>


          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => append(node,data)">
                新增
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => update(node,data)">
                修改
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>

        </el-tree>


      </div>


      <el-dialog title="权限信息" :visible.sync="showForm" width="500px">
           <el-form :model="form">

             <el-form-item label="权限名称" >
               <el-input v-model="form.name" autocomplete="off" ></el-input>
             </el-form-item>

             <el-form-item label="权限路径" >
               <el-input v-model="form.url" autocomplete="off" ></el-input>
             </el-form-item>

             <el-form-item label="是否为目录" >
               <el-radio-group v-model="form.type">
                 <el-radio :label="0">否</el-radio>
                 <el-radio :label="1">是目录</el-radio>
               </el-radio-group>
             </el-form-item>

           </el-form>

           <div slot="footer" class="dialog-footer">
             <el-button @click="showForm = false">取 消</el-button>
             <el-button type="primary" @click="updateData">提 交</el-button>
           </div>
      </el-dialog>
    </div>
</template>

<script>

    const defaulForm = {
              id:null,
              name:'',
              url:'',
              type:null,
              pid:null
    };


    export default {
        name: "Menu",
        data(){
          return {
            axiosData:[],
            data:[],
            strData:'',
            defaultProps: {},



            showForm:false,
            form:Object.assign({},defaulForm)
          }
        },
        async created(){
          await this.queryData();
        },
        methods:{
          update(node,data){
              this.showForm=true;
              this.form.id=data.id;
              this.form.name=data.label;
              this.form.url=data.url;
              this.form.type=data.type;
          },
          append(node,data){
              this.showForm=true;
              this.form=Object.assign({},defaulForm);
              this.form.pid=data.id;
          },
          updateData:async function(){

             let res=await this.$axios.post('http://localhost:8080/api/menu/updateData',this.$qs.stringify(this.form));
                this.showForm = false;
                alert('修改成功');

                this.axiosData=[];
                this.queryData();


          },

          async remove(node, data) {
              if (node.childNodes.length<=0) {

                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {


                  var params={};
                  params.id=data.id;
                  params.isDel=1;
                  this.$axios.post('http://localhost:8080/api/menu/updateData',this.$qs.stringify(params)).then(res=>{
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


          queryData:async function () {
            let res = await this.$axios.get('http://localhost:8080/api/menu/queryData');
             this.axiosData=res.data.data;  // 把请求的数据  赋给全局
                this.chandleData();
          },
          chandleData: function () {

            for (let i = 0; i < this.axiosData.length; i++) {
              if (this.axiosData[i].pid == 0) {
                this.diguiNode(this.axiosData[i]);
                break;
              }
            }
            console.log(this.strData);
            //将字符串 转为json对象
            this.data.push(JSON.parse(this.strData));
          },
          diguiNode: function (node) {
            // 判断是否为父节点
            var flag = this.isParent(node.id);
            if (flag == true) {
              this.strData += '{"id":' + node.id + ',"url":"'+node.url+'","type":'+node.type+',"label":"' + node.name + '","children":[';
              //拼接子节点
              //查找此节点的子节点
              let count = 0;
              for (let i = 0; i < this.axiosData.length; i++) {
                if (this.axiosData[i].pid == node.id) {
                  count++;
                  this.diguiNode(this.axiosData[i]);
                  this.strData += ",";
                }
              }
              //处理多余的,号
              if (count != 0) {
                this.strData = this.strData.substr(0, this.strData.length - 1);
              }

              //拼完整
              this.strData += ']}';
            } else {
              this.strData += '{"id":' + node.id + ',"url":"'+node.url+'","type":'+node.type+',"label":"' + node.name + '"}';
            }
          },
          isParent: function (id) {
            for (let i = 0; i < this.axiosData.length; i++) {
              if (this.axiosData[i].pid == id) {
                return true;
              }
            }
            return false
          },

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
