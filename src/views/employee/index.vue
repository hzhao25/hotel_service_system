<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px">员工姓名：</label>
        <el-input
          v-model="input"
          placeholder="请输入员工姓名"
          style="width: 15%"
          clearable
          @clear="init"
          @keyup.enter.native="initFun"
        />
        <!-- 新增：员工类型选择框 -->
        <label style="margin-right: 5px; margin-left: 10px">员工类型：</label>
        <el-select
          v-model="selectedType"
          placeholder="请选择员工类型"
          style="width: 15%"
        >
          <el-option
            v-for="type in employeeTypes"
            :key="type"
            :label="type"
            :value="type"
          />
        </el-select>
        <el-button class="normal-btn continue" @click="init(true)"
          >查询</el-button
        >
        <el-button
          type="primary"
          style="float: right"
          @click="addEmployeeHandle('add')"
        >
          + 添加员工
        </el-button>
      </div>
      <el-table
        :data="tableData"
        stripe
        v-if="tableData.length"
        class="tableBox"
      >
        <el-table-column prop="name" label="员工姓名" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="phone" label="手机号" />
        <!-- 新增：员工类型列 -->
        <el-table-column prop="type" label="员工类型" />
        <el-table-column label="账号状态">
          <template slot-scope="scope">
            <div
              class="tableColumn-status"
              :class="{ 'stop-use': String(scope.row.status) === '0' }"
            >
              {{ String(scope.row.status) === '0' ? '禁用' : '启用' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="最后操作时间" />
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="blueBug"
              @click="addEmployeeHandle(scope.row.id, scope.row.username)"
            >
            <!-- :class="{ 'disabled-text': scope.row.username === 'admin' }"
              :disabled="scope.row.username === 'admin'" -->
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              class="non"
              @click="statusHandle(scope.row)"
            >
            <!-- :disabled="scope.row.username === 'admin'" -->
            <!-- :class="{
                'disabled-text': scope.row.username === 'admin',
                blueBug: scope.row.status == '0',
                delBut: scope.row.status != '0'
              }" -->
              {{ scope.row.status == '1' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Empty v-else :is-search="isSearch" />
      <el-pagination
        class="pageList"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HeadLable from '@/components/HeadLable/index.vue'
import { getEmployeeList, enableOrDisableEmployee } from '@/api/employee'
import { UserModule } from '@/store/modules/user'
import InputAutoComplete from '@/components/InputAutoComplete/index.vue'
import Empty from '@/components/Empty/index.vue'
import Cookies from 'js-cookie'

@Component({
  name: 'Employee',
  components: {
    HeadLable,
    InputAutoComplete,
    Empty,
  },
})
export default class extends Vue {
  private input: any = ''
  // 新增：用于存储选择的员工类型
  private selectedType: string = ''
  // 新增：员工类型列表
  private employeeTypes: string[] = [
    '前台',
    '管理员',
    '厨师',
    '修理工',
    '清洁工',
    '送餐员',
  ]
  private counts: number = 0
  private page: number = 1
  private pageSize: number = 10
  private tableData = []
  private id = ''
  private status = ''
  private isSearch: boolean = false

  created() {
    this.init()
  }

  initProp(val) {
    this.input = val
    this.initFun()
  }

  initFun() {
    this.page = 1
    this.init()
  }

  get userName() {
    return UserModule.username
  }

  private async init(isSearch?: boolean) {
    this.isSearch = isSearch
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      name: this.input ? this.input : undefined,
      // 新增：添加员工类型参数
      type: this.selectedType ? this.selectedType : undefined,
    }
    await getEmployeeList(params)
      .then((res: any) => {
        if (String(res.data.code) === '1') {
          this.tableData = res.data && res.data.data && res.data.data.records
          this.counts = res.data.data.total
        }
        // if (!res.data.data.records.length && type === 'search') {
        //   this.$message.error('未搜索到相关员工，请核对员工姓名是否正确')
        // }
      })
      .catch((err) => {
        this.$message.error('请求出错了：' + err.message)
      })
  }

  // 添加
  private addEmployeeHandle(st: string, username: string) {
    if (st === 'add') { //添加员工信息
      this.$router.push({ path: '/employee/add' })
    } else { //修改员工信息
      /* if (username === 'admin') {
        return
      } */
      this.$router.push({ path: '/employee/add', query: { id: st } })
    }
  }

  //状态修改
  private statusHandle(row: any) {
    /* if (row.username === 'admin') {
      return
    } */
   if(row.username === Cookies.get('username')){
    this.$message.error('无法禁用本人账户')
    return
   }
    this.id = row.id
    this.status = row.status
    this.$confirm('确认调整该账号的状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      enableOrDisableEmployee({ id: this.id, status: !this.status ? 1 : 0 })
        .then((res) => {
          if (String(res.status) === '200') {
            this.$message.success('账号状态更改成功！')
            this.init()
          }
        })
        .catch((err) => {
          this.$message.error('请求出错了：' + err.message)
        })
    })
  }

  private handleSizeChange(val: any) {
    this.pageSize = val
    this.init()
  }

  private handleCurrentChange(val: any) {
    this.page = val
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.disabled-text {
  color: #bac0cd !important;
}
</style>
