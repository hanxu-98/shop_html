<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="login_param" :rules="login_rules" ref="login_rules" label-width="0px" class="ms-content">
                <el-form-item prop="name">
                    <el-input v-model="login_param.name" placeholder="name">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="login_param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>


                <div align="center" class="login-btn">
                  <el-button type="primary" @click="loginUser">登录</el-button>
                  <el-button type="success" @click="registerUser">注册</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>




        <!--注册-->

        <div id="registerHtml">
          <el-dialog title="用户注册信息"   :visible.sync="registerFormFlag" width="50%">
            <el-form :model="registerForm" ref="registerForm"  :rules="register_rules"   label-width="80px">
              <el-form-item label="用户名" prop="name">
                <el-input v-model="registerForm.name"  width="200px"></el-input>
              </el-form-item>

              <el-form-item label="真实名称" prop="realName">
                 <el-input v-model="registerForm.realName"  width="200px"></el-input>
              </el-form-item>

              <el-form-item label="密码" prop="password">
                 <el-input v-model="registerForm.password"  width="200px"></el-input>
              </el-form-item>

              <el-form-item label="确认密码" prop="password2">
                 <el-input v-model="registerForm.password2"  width="200px"></el-input>
              </el-form-item>

              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="registerForm.sex">
                  <el-radio label="0">男</el-radio>
                  <el-radio label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="手机号码" prop="phone">
                 <el-input v-model="registerForm.phone"  width="200px"></el-input>
              </el-form-item>

              <el-form-item label="电子邮箱" prop="email">
                 <el-input v-model="registerForm.email"  width="200px"></el-input>
              </el-form-item>

              <el-form-item label="身份证号" prop="idCard">
                 <el-input v-model="registerForm.idCard"  width="200px"></el-input>
              </el-form-item>

              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  v-model="registerForm.birthday"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>

               <!-- 图片插件  -->
            <el-form-item label="主图" prop="imgPath">
              <el-upload
                class="avatar-uploader"
                action="http://localhost:8080/api/band/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                name="image"
                :before-upload="beforeAvatarUpload">
                <img v-if="registerForm.imgUrl" :src="registerForm.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="学历" prop="eduId">
              <el-select v-model="registerForm.eduId" placeholder="请选择">
                <el-option  label="高中" value="1"></el-option>
                <el-option  label="大学" value="2"></el-option>
                <el-option  label="硕士" value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="部门" prop="deptId">
              <el-select v-model="registerForm.deptId" placeholder="请选择">
                <el-option  label="开发部" value="1"></el-option>
                <el-option  label="销售部" value="2"></el-option>
                <el-option  label="行政部" value="3"></el-option>
              </el-select>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
              <el-button @click="registerFormFlag = false">取 消</el-button>
              <el-button type="primary" @click="saveregisterUser">注 册</el-button>
            </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data: function () {
          var validateName=async (rule, value, callback)=>{
            if (value === '') {
              callback(new Error('请输入用户名'));
            }else {
                let flag=await this.valiUserName(value);
                if (flag==true){
                  callback();
                } else {
                  callback(new Error('用户名已存在'));
                }
            }
          };
          var validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              if (this.registerForm.password !== '') {
                this.$refs.registerForm.validateField('password2');
              }
              callback();
            }
          };
          var validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          };

          return {
            login_param: {
              name: '',
              password: '',
            },
            login_rules: {
              name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
              password: [{required: true, message: '请输入密码', trigger: 'blur'}],
            },


            /*注册*/
            registerFormFlag:false,

            registerForm:{
              name:'',
              realName:'',
              password:'',
              sex:null,
              phone:null,
              email:'',
              idCard:'',
              birthday:'',
              imgUrl:'',
              eduId:null,
              deptId:null,
              password2:'',
            },

            register_rules: {
              name: [{ validator: validateName, trigger: 'blur' }],
              password: [{ validator: validatePass, trigger: 'blur' }],
              password2: [ { validator: validatePass2, trigger: 'blur' }],
              sex: [ { required: true, message: '请选择性别', trigger: 'change' } ],
            },
          };
        },
        methods: {
          loginUser() {
            this.$refs['login_rules'].validate((valid) => {
              debugger;
              if (valid) {
                this.$axios.post('http://localhost:8080/api/login/loginUser', this.$qs.stringify(this.login_param)).then(res => {
                  if (res.data.code == 200) {
                    alert("登录成功");
                    this.$router.push("/show");
                  } else {
                    alert("密码错误");
                  }
                });

              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
            saveregisterUser(){
             this.$refs['registerForm'].validate((valid) => {
              if (valid) {

                this.$axios.post('http://localhost:8080/api/login/registerUser',this.$qs.stringify(this.registerForm)).then(res=>{
                  if (res.data.code == 200) {
                    alert('submit!');
                    this.$refs.registerForm.resetFields();
                    this.registerFormFlag=false;
                  }
                });




              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },

          async valiUserName(name){

            let res=await this.$axios.get('http://localhost:8080/api/login/valUserName?name='+name);
                if (res.data.code==202){
                  return false;
                }
                if (res.data.code==200) {
                  return true;
                }
          },
          registerUser(){
              this.registerFormFlag=true;
          },
          handleAvatarSuccess(response, file) {
            //打断点 看怎么取返回值
            this.registerForm.imgUrl=response.filePath;
          },
          beforeAvatarUpload(file) {
            //限制类型    name  来限制
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 4;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
          },

          /*submitForm() {
            this.$refs.login.validate(valid => {
              if (valid) {
                this.$message.success('登录成功');
                localStorage.setItem('ms_username', this.login_param.name);
                this.$router.push('/');
              } else {
                this.$message.error('请输入账号和密码');
                console.log('error submit!!');
                return false;
              }
            });
          },*/
        },
    }
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 40%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
