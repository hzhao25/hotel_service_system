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
        <el-form-item label="消耗品名称:"
                      prop="name">
          <el-input v-model="ruleForm.name"
                    placeholder="请输入消耗品名称"
                    maxlength="12" />
        </el-form-item>
        <el-form-item label="消耗品库存:"
                      prop="stock">
          <el-input v-model="ruleForm.stock"
                    placeholder="请输入消耗品库存"
                    maxlength="11" />
        </el-form-item>
        <div>
          <el-form-item label="消耗品图片:" prop="image">
            <image-upload :prop-image-url="imageUrl" @imageChange="imageChange">
              图片大小不超过5M<br />仅能上传 PNG JPEG JPG类型图片<br />建议上传200*200或300*300尺寸的图片
            </image-upload>
          </el-form-item>
        </div>
        <div class="subBox address">
          <!-- <el-form-item> -->
          <el-button @click="() => $router.push('/consume')">
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
import { queryConsumeById, addConsume, editConsume } from '@/api/consume'
import ImageUpload from '@/components/ImgUpload/index.vue'

@Component({
  name: 'addShop',
  components: {
    HeadLable,
    ImageUpload,
  }
})
export default class extends Vue {
  private title = '添加消耗品'
  private actionType = ''
  private imageUrl: string = ''
  private ruleForm = {
    name: '',
    stock: '',
    status: true,
    image: '',
  }
  get rules() {
    return {
      name: [
        {
          required: true,
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请输入消耗品名称'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      image: {
        required: true,
        message: '消耗品图片不能为空',
        trigger: 'blur'
      },
    stock: [
      {
        required: true,
        message: '请输入消耗品库存',
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
      this.title = '修改消耗品信息'
      this.init()
    }
  }

  private async init() {
    const id = this.$route.query.id
    queryConsumeById(id).then((res: any) => {
      // String(res.status) === '200'
      if (res.data.code === 1) {
        this.ruleForm = res.data.data
        this.imageUrl = res.data.data.image
        this.ruleForm.status = res.data.data.status == '1'
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }

  private submitForm(formName: any, st: any) {
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        if (!this.ruleForm.image) return this.$message.error('消耗品图片不能为空')
        let params: any = { ...this.ruleForm }
        params.status =
          this.actionType === 'add' ? 0 : this.ruleForm.status ? 1 : 0
        if (this.actionType === 'add') {
          addConsume(params)
            .then((res: any) => {
              if (res.data.code === 1) {
                this.$message.success('消耗品添加成功！')
                if (!st) { //保存
                  this.$router.push({ path: '/consume' })
                } else { //保存并继续添加
                this.imageUrl = ''
                  this.ruleForm = {
                    name: '',
                    image: '',
                    stock:'',
                    status: true
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
          editConsume(params)
            .then((res: any) => {
              if (res.data.code === 1) {
                this.$message.success('消耗品信息修改成功！')
                this.$router.push({ path: '/consume' })
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
  imageChange(value: any) {
    this.ruleForm.image = value
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
