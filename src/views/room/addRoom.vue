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
        <el-form-item label="客房名称:"
                      prop="name">
          <el-input v-model="ruleForm.name"
                    placeholder="请输入客房名称"
                    maxlength="12" />
        </el-form-item>
        <!-- <div>
          <el-form-item label="客房二维码:" prop="qrCode">
            <image-upload :prop-image-url="imageUrl" @imageChange="imageChange">
              图片大小不超过5M<br />仅能上传 PNG JPEG JPG类型图片<br />建议上传200*200或300*300尺寸的图片
            </image-upload>
          </el-form-item>
        </div> -->
        <div class="subBox address">
          <!-- <el-form-item> -->
          <el-button @click="() => $router.push('/room')">
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
import { queryRoomById, addRoom, editRoom, } from '@/api/room'
import ImageUpload from '@/components/ImgUpload/index.vue'

@Component({
  name: 'addShop',
  components: {
    HeadLable,
    ImageUpload,
  }
})
export default class extends Vue {
  private title = '添加客房'
  private actionType = ''
  private imageUrl: string = ''
  private ruleForm = {
    name: '',
    status: true,
    qrCode: '',
  }
  get rules() {
    return {
      name: [
        {
          required: true,
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请输入客房名称'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      /* qrCode: {
        required: true,
        message: '客房二维码不能为空',
        trigger: 'blur'
      }, */
    }
  }

  created() {
    //判断当前路由路径是否存在id，如果有id则是修改信息(index会传过来id和username)，没有id就是添加员工信息(index传过来add)
    this.actionType = this.$route.query.id ? 'edit' : 'add'
    if (this.$route.query.id) {
      //如果是修改，则把标题改了
      this.title = '修改客房信息'
      this.init()
    }
  }

  private async init() {
    const id = this.$route.query.id
    queryRoomById(id).then((res: any) => {
      // String(res.status) === '200'
      if (res.data.code === 1) {
        this.ruleForm = res.data.data
        this.imageUrl = res.data.data.qrCode
        this.ruleForm.status = res.data.data.status == '1'
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }

  private submitForm(formName: any, st: any) {
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        // if (!this.ruleForm.qrCode) return this.$message.error('客房二维码不能为空')
        let params: any = { ...this.ruleForm }
        params.status =
          this.actionType === 'add' ? 1 : this.ruleForm.status ? 1 : 0
        if (this.actionType === 'add') {
          addRoom(params)
            .then((res: any) => {
              if (res.data.code === 1) {
                this.$message.success('客房添加成功！')
                if (!st) { //保存
                  this.$router.push({ path: '/room' })
                } else { //保存并继续添加
                this.imageUrl = ''
                  this.ruleForm = {
                    name: '',
                    qrCode: '',
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
          editRoom(params)
            .then((res: any) => {
              if (res.data.code === 1) {
                this.$message.success('客房信息修改成功！')
                this.$router.push({ path: '/room' })
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
    this.ruleForm.qrCode = value
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
