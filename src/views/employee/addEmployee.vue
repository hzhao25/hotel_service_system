<template>
  <div class="addBrand-container">
    <HeadLable :title="title"
               :goback="true" />
    <div class="container">
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               :inline="false"
               label-width="180px"
               class="demo-ruleForm">
        <!--          <el-form-item label="员工职级" prop="region">-->
        <!--            <el-select v-model="ruleForm.region" placeholder="请选择品牌名称">-->
        <!--              <el-option label="区域一" value="shanghai"></el-option>-->
        <!--              <el-option label="区域二" value="beijing"></el-option>-->
        <!--            </el-select>-->
        <!--            <el-button @click="submitForm('ruleForm')" type="primary" class="continue" style="margin-left: 10px;" >+新增职级</el-button>-->
        <!--          </el-form-item>-->
        <el-form-item label="账号:"
                      prop="username">
          <el-input v-model="ruleForm.username"
                    placeholder="请输入账号"
                    maxlength="20" />
        </el-form-item>
        <el-form-item label="员工姓名:"
                      prop="name">
          <el-input v-model="ruleForm.name"
                    placeholder="请输入员工姓名"
                    maxlength="12" />
        </el-form-item>
        <!-- <el-form-item
          label="密码:"
          prop="password"
        >
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
          />
        </el-form-item> -->
        <!-- <el-form-item
          label="确认密码:"
          prop="rePassword"
        >
          <el-input
            v-model="ruleForm.rePassword"
            type="password"
            autocomplete="off"
            placeholder="请输入确认密码"
          />
        </el-form-item> -->
        <el-form-item label="手机号:"
                      prop="phone">
          <el-input v-model="ruleForm.phone"
                    placeholder="请输入手机号"
                    maxlength="11" />
        </el-form-item>
        <el-form-item label="性别:"
                      prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号:"
                      prop="idNumber"
                      class="idNumber">
          <el-input v-model="ruleForm.idNumber"
                    placeholder="请输入身份证号"
                    maxlength="20" />
        </el-form-item>
        <!-- 新增员工类型字段 -->
        <el-form-item label="员工类型:"
                      prop="type">
          <el-select v-model="ruleForm.type"
                     placeholder="请选择员工类型">
            <el-option label="前台" value="前台"></el-option>
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="厨师" value="厨师"></el-option>
            <el-option label="修理工" value="修理工"></el-option>
            <el-option label="清洁工" value="清洁工"></el-option>
            <el-option label="送餐员" value="送餐员"></el-option>
          </el-select>
        </el-form-item>
        <!-- 新增具备技能字段 -->
        <el-form-item label="具备技能:"
                      prop="skills">
          <el-input v-model="ruleForm.skills"
                    placeholder="请输入具备技能" />
        </el-form-item>
        <div class="subBox address">
          <!-- <el-form-item> -->
          <el-button @click="() => $router.push('/employee')">
            取消
          </el-button>
          <el-button type="primary"
                     :class="{ continue: actionType === 'add' }"
                     @click="submitForm('ruleForm', false)">
            保存
          </el-button>
          <el-button v-if="actionType == 'add'"
                     type="primary"
                     @click="submitForm('ruleForm', true)">
            保存并继续添加
          </el-button>
          <!-- </el-form-item> -->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HeadLable from '@/components/HeadLable/index.vue'
import { queryEmployeeById, addEmployee, editEmployee } from '@/api/employee'

@Component({
  name: 'addShop',
  components: {
    HeadLable
  }
})
export default class extends Vue {
  private title = '添加员工'
  private actionType = ''
  private ruleForm = {
    name: '',
    phone: '',
    // 'password': '',
    // 'rePassword': '',
    sex: '男',
    idNumber: '',
    username: '',
    type: '',
    skills: ''
  }

  // private validateRepassword (rule:any, value:any, callback:any) {
  //   if (value === '') {
  //     callback(new Error('请再次输入密码'))
  //   } else if (value !== this.ruleForm.password) {
  //     callback(new Error('两次输入密码不一致!'))
  //   } else {
  //     callback()
  //   }
  // }

  //手机号是否符合规定
  private isCellPhone(val: any) {
    if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
      return false
    } else {
      return true
    }
  }

  private checkphone(rule: any, value: any, callback: any) {
    // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
    if (value == '') {
      callback(new Error('请输入手机号'))
    } else if (!this.isCellPhone(value)) {
      //引入methods中封装的检查手机格式的方法
      callback(new Error('请输入正确的手机号!'))
    } else {
      callback()
    }
  }

  //身份证号是否符合标准
  private validID(rule: any, value: any, callback: any) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (value == '') {
      callback(new Error('请输入身份证号码'))
    } else if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('身份证号码不正确'))
    }
  }

  get rules() {
    return {
      name: [
        {
          required: true,
          // 'message': '请输入员工姓名',
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请输入员工姓名'))
            } else {
              // const reg = /^[\u4e00-\u9fa5_a-zA-Z]{1,12}$/
              // if (!reg.test(value)) {
              //   callback(new Error('姓名输入不符，请输入1-12个字符'))
              // } else {
              //   callback()
              // }
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      username: [
        {
          required: true,
          // message: '请输入账号',
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请输入账号'))
            } else {
              const reg = /^([a-z]|[0-9]){3,20}$/
              if (!reg.test(value)) {
                callback(new Error('账号输入不符，请输入3-20个字符'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      phone: [{ required: true, validator: this.checkphone, trigger: 'blur' }],
      idNumber: [{ required: true, validator: this.validID, trigger: 'blur' }],
      type: [
        {
          required: true,
          message: '请选择员工类型',
          trigger: 'change'
        }
      ],
      // 新增 skills 字段的验证规则
      skills: [
        {
          required: true,
          message: '请输入具备技能',
          trigger: 'blur'
        }
      ]
    }
  }

  created() {
    //判断当前路由路径是否存在id，如果有id则是修改信息(index会传过来id和username)，没有id就是添加员工信息(index传过来add)
    this.actionType = this.$route.query.id ? 'edit' : 'add'
    if (this.$route.query.id) {
      //如果是修改，则把标题改了
      this.title = '修改员工信息'
      this.init()
    }
  }

  private async init() {
    const id = this.$route.query.id
    queryEmployeeById(id).then((res: any) => {
      // String(res.status) === '200'
      if (res.data.code === 1) {
        this.ruleForm = res.data.data
        this.ruleForm.sex = res.data.data.sex === '0' ? '女' : '男'
        // this.ruleForm.password = ''
      } else {
        this.$message.error(res.data.msg)
      }
      // if (res.data.code == 200) {
      //   const { data } = res.data
      //   this.ruleForm = data
      //   this.ruleForm.password = ''
      //   // this.ruleForm.rePassword = '' //JSON.parse(JSON.stringify(data.password));
      // } else {
      //   this.$message.error(res.data.desc)
      // }
    })
  }

  private submitForm(formName: any, st: any) {
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        if (this.actionType === 'add') {
          const params = {
            ...this.ruleForm,
            sex: this.ruleForm.sex === '女' ? '0' : '1'
          }
          addEmployee(params)
            .then((res: any) => {
              if (res.data.code === 1) {
                this.$message.success('员工添加成功！')
                if (!st) { //保存
                  this.$router.push({ path: '/employee' })
                } else { //保存并继续添加
                  this.ruleForm = {
                    username: '',
                    name: '',
                    phone: '',
                    // 'password': '',
                    // 'rePassword': '',/
                    sex: '男',
                    idNumber: '',
                    type: '',
                    skills: ''
                  }
                }
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(() => {
              // this.$message.error('请求出错了：' + err.message)
            })
        } else {
          const params = {
            ...this.ruleForm,
            sex: this.ruleForm.sex === '女' ? '0' : '1'
          }
          editEmployee(params)
            .then((res: any) => {
              if (res.data.code === 1) {
                this.$message.success('员工信息修改成功！')
                this.$router.push({ path: '/employee' })
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(() => {
              // this.$message.error('请求出错了：' + err.message)
            })
        }
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 0px;
    .HeadLable {
      background-color: transparent;
      margin-bottom: 0px;
      padding-left: 0px;
    }
    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 30px;
      border-radius: 4px;
      // min-height: 500px;
      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px $gray-5;
      }
    }
    .idNumber {
      margin-bottom: 39px;
    }

    .el-form-item {
      margin-bottom: 29px;
    }
    .el-input {
      width: 293px;
    }
  }
}
</style>
