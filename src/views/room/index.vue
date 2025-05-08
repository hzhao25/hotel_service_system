<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px">客房名称：</label>
        <el-input
          v-model="input"
          placeholder="请输入客房名称"
          style="width: 15%"
          clearable
          @clear="init"
          @keyup.enter.native="initFun"
        />
        <label style="margin-right: 10px; margin-left: 20px">客房状态：</label>
        <el-select v-model="roomStatus"
                   style="width: 14%"
                   placeholder="请选择"
                   clearable
                   @clear="init">
          <el-option v-for="item in saleStatus"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <el-button class="normal-btn continue" @click="init(true)"
          >查询</el-button
        >
        <el-button
          type="primary"
          style="float: right"
          @click="addRoomHandle('add')"
        >
          + 添加客房
        </el-button>
      </div>
      <el-table
        :data="tableData"
        stripe
        v-if="tableData.length"
        class="tableBox"
      >
        <el-table-column prop="name" label="客房名称" />
        <el-table-column prop="userId" label="住户编号" />
        <el-table-column prop="qrCode"
                         label="客房二维码">
          <template slot-scope="{ row }">
            <el-image style="width: 80px; height: 40px; border: none; cursor: pointer"
                      :src="row.qrCode">
              <div slot="error"
                   class="image-slot">
                <img src="./../../assets/noImg.png"
                     style="width: auto; height: 40px; border: none">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="客房状态">
          <template slot-scope="scope">
            <div
              class="tableColumn-status"
              :class="{ 'stop-use': String(scope.row.status) === '0' }"
            >
              {{ String(scope.row.status) === '0' ? '忙碌' : '空闲' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="最后操作时间" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="blueBug"
              @click="addRoomHandle(scope.row.id, scope.row.username)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              class="delBut"
              @click="deleteHandle(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              class="non"
              @click="statusHandle(scope.row)"
            >
              {{ scope.row.status == '1' ? '忙碌' : '空闲' }}
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
import { getRoomList, enableOrDisableRoom, deleRoom } from '@/api/room'
import { UserModule } from '@/store/modules/user'
import InputAutoComplete from '@/components/InputAutoComplete/index.vue'
import Empty from '@/components/Empty/index.vue'
import Cookies from 'js-cookie'

@Component({
  name: 'Room',
  components: {
    HeadLable,
    InputAutoComplete,
    Empty,
  },
})
export default class extends Vue {
  private input: any = ''
  private counts: number = 0
  private page: number = 1
  private pageSize: number = 10
  private tableData = []
  private id = ''
  private status = ''
  private isSearch: boolean = false
  private roomStatus: string | null = null; // 新增：存储选择的售卖状态
  private saleStatus = [
    { label: '空闲', value: '1' },
    { label: '忙碌', value: '0' }
  ]; // 新增：售卖状态列表

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
      status: this.roomStatus ? this.roomStatus : undefined // 新增：添加售卖状态参数
    }
    await getRoomList(params)
      .then((res: any) => {
        if (String(res.data.code) === '1') {
          this.tableData = res.data && res.data.data && res.data.data.records
          this.counts = res.data.data.total
        }
      })
      .catch((err) => {
        this.$message.error('请求出错了：' + err.message)
      })
  }

  // 添加
  private addRoomHandle(st: string, username: string) {
    if (st === 'add') { //添加客房信息
      this.$router.push({ path: '/room/add' })
    } else { //修改客房信息
      /* if (username === 'admin') {
        return
      } */
      this.$router.push({ path: '/room/add', query: { id: st } })
    }
  }

  //状态修改
  private statusHandle(row: any) {
    this.id = row.id
    this.status = row.status
    this.$confirm('确认调整该客房的状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      enableOrDisableRoom({ id: this.id, status: !this.status ? 1 : 0 })
        .then((res) => {
          if (String(res.status) === '200') {
            this.$message.success('客房状态更改成功！')
            this.init()
          }
        })
        .catch((err) => {
          this.$message.error('请求出错了：' + err.message)
        })
    })
  }

      //删除
  private deleteHandle(id: any) {
    this.$confirm('此操作将永久删除该客房，是否继续？', '确定删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      deleRoom(id)
        .then((res) => {
          if (res.data.code === 1) {
            this.$message.success('删除成功！')
            // this.$refs.classData.resetFields()
            this.init()
          } else {
            this.$message.error(res.data.msg)
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
