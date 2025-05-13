<template>
  <div class="dashboard-container">
    <!-- 订单状态按钮 -->
    <div class="tab-buttons">
      <el-button
        v-for="(status, index) in orderStatusList"
        :key="index"
        :class="{ active: currentStatus === status.value }"
        class="status-btn"
        @click="changeStatus(status.value)">
        {{ status.label }}
      </el-button>
    </div>
    <div class="container" :class="{ hContainer: tableData.length }">
      <!-- 搜索项 -->
      <div class="tableBar">
        <label style="margin-right: 10px">订单号：</label>
        <el-input
          v-model="searchForm.id"
          placeholder="请填写订单号"
          style="width: 15%"
          clearable
          @clear="init(currentStatus)"
          @keyup.enter.native="initFun(currentStatus)"
        />
        <label style="margin-left: 20px">手机号：</label>
        <el-input
          v-model="searchForm.phone"
          placeholder="请填写手机号"
          style="width: 15%"
          clearable
          @clear="init(currentStatus)"
          @keyup.enter.native="initFun(currentStatus)"
        />
        <label style="margin-left: 20px">紧急状态：</label>
        <el-select
          v-model="searchForm.emergency"
          placeholder="请选择订单类型"
          style="width: 15%"
          clearable
          @clear="init(currentStatus)">
          <el-option label="紧急订单" :value="0"></el-option>
          <el-option label="正常订单" :value="1"></el-option>
        </el-select>
        <el-button class="normal-btn continue" @click="init(currentStatus, true)">
          查询
        </el-button>
      </div>
      <el-table
        v-if="tableData.length"
        :data="tableData"
        stripe
        class="tableBox"
      >
        <el-table-column key="id" prop="id" label="订单号" />
        <el-table-column key="roomId" prop="roomId" label="房间号" />
        <el-table-column key="username" prop="username" label="用户名" show-overflow-tooltip />
        <el-table-column key="phone" prop="phone" label="手机号" />
        <el-table-column key="description" prop="description" label="描述" show-overflow-tooltip />
        <el-table-column key="image" label="图片">
          <template slot-scope="{ row }">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.image"
              :preview-src-list="[row.image]"
              fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column key="price" prop="price" label="价格" align="center">
          <template slot-scope="{ row }">
            <span>￥{{ (row.price.toFixed(2) * 100) / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column key="emergency" prop="emergency" label="紧急状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.emergency === 0 ? 'danger' : 'success'">
              {{ row.emergency === 0 ? '紧急' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column key="status" prop="status" label="订单状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column key="bookTime" prop="bookTime" label="预约时间" />
        <el-table-column
          prop="btn"
          label="操作"
          align="center"
          class-name="operate"
          min-width="180"
        >
          <template slot-scope="{ row }">
            <div class="btn-group">
              <el-button
                type="text"
                class="blueBug non"
                @click="viewOrderDetail(row)"
              >
                查看
              </el-button>
              <template v-if="row.status === '未接单'">
                <el-button
                  type="text"
                  class="blueBug"
                  @click="acceptOrder(row)"
                >
                  接单
                </el-button>
                <el-button
                  type="text"
                  class="redBug"
                  @click="cancelOrder(row)"
                >
                  取消
                </el-button>
              </template>
              <template v-if="row.status === '已接单'">
                <el-button
                  type="text"
                  class="blueBug"
                  @click="completeOrder(row)"
                >
                  完成
                </el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="empty-box">
        <i class="el-icon-folder-remove no-data-icon"></i>
        <p>暂无数据</p>
      </div>
      <el-pagination
        v-if="counts > 10"
        class="pageList"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 订单详情弹窗 -->
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      width="53%"
      :before-close="handleClose"
      class="order-dialog"
    >
      <el-scrollbar style="height: 100%">
        <div class="order-top">
          <div class="top-header">
            <div style="display: flex; align-items: center;">
              <div style="display: inline-block">
                <label style="font-size: 16px">订单号：</label>
                <div class="order-num">
                  {{ currentOrder.id }}
                </div>
              </div>
              <div
                style="display: inline-block"
                class="order-status"
                :class="{ status3: currentOrder.emergency === 0 }"
              >
                {{ currentOrder.status }}
              </div>
            </div>
          </div>
          <div class="time-info">
            <div class="time-row">
              <div class="time-item">
                <label>预约时间：</label>
                <span>{{ currentOrder.bookTime }}</span>
              </div>
              <div class="time-item" v-if="currentOrder.completedTime">
                <label>完成时间：</label>
                <span>{{ currentOrder.completedTime }}</span>
              </div>
            </div>
            <div class="time-row">
              <div class="time-item" v-if="currentOrder.createdAt">
                <label>创建时间：</label>
                <span>{{ currentOrder.createdAt }}</span>
              </div>
              <div class="time-item" v-if="currentOrder.updatedAt">
                <label>更新时间：</label>
                <span>{{ currentOrder.updatedAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="order-middle">
          <div class="user-info">
            <div class="user-info-box">
              <div class="user-name">
                <label>用户名：</label>
                <span>{{ currentOrder.username }}</span>
              </div>
              <div class="user-phone">
                <label>手机号：</label>
                <span>{{ currentOrder.phone }}</span>
              </div>
              <div class="user-room">
                <label>房间号：</label>
                <span>{{ currentOrder.roomId }}</span>
              </div>
              <div class="room-and-type">
                <div class="user-room-name">
                  <label>房间名称：</label>
                  <span>{{ currentOrder.roomName }}</span>
                </div>
                <div class="order-type" v-if="currentOrder.type">
                  <label>订单类型：</label>
                  <span>{{ currentOrder.type }}</span>
                </div>
              </div>
              <div class="user-emergency">
                <label>紧急状态：</label>
                <span>{{ currentOrder.emergency === 0 ? '紧急' : '正常' }}</span>
              </div>
              <div class="staff-info" v-if="currentOrder.staffName">
                <label>服务人员：</label>
                <span>{{ currentOrder.staffName }}</span>
              </div>
            </div>
            <div class="user-remark">
              <div>描述</div>
              <span>{{ currentOrder.description }}</span>
            </div>
          </div>

          <div class="image-info" v-if="currentOrder.image">
            <div class="image-label">图片</div>
            <div class="image-content">
              <el-image
                style="width: 200px; height: 200px"
                :src="currentOrder.image"
                :preview-src-list="[currentOrder.image]"
                fit="cover">
              </el-image>
            </div>
          </div>
        </div>

        <div class="order-bottom">
          <div class="amount-info">
            <div class="amount-label">费用</div>
            <div class="amount-list">
              <div class="all-amount">
                <span class="amount-name">金额：</span>
                <span class="amount-price">￥{{ currentOrder.price ? (currentOrder.price.toFixed(2) * 100) / 100 : '' }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
        <el-button
          v-if="currentOrder.status === '未接单'"
          type="primary"
          @click="acceptOrder(currentOrder)">接 单</el-button>
        <el-button
          v-if="currentOrder.status === '未接单'"
          @click="cancelOrder(currentOrder)">取 消</el-button>
        <el-button
          v-if="currentOrder.status === '已接单'"
          type="primary"
          @click="completeOrder(currentOrder)">完 成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import{
  getOrderDetailPage,
  queryOrderDetailById,
  orderAccept,
  completeOrder as completeOrderApi,
  updateOrderStatus
} from '@/api/order'
@Component({
  components: {},
})
export default class extends Vue {
  private currentStatus: string = '全部'
  private searchForm = {
    id: '',
    phone: '',
    emergency: null
  }
  private dialogVisible = false
  private counts: number = 0
  private page: number = 1
  private pageSize: number = 10
  private tableData = []
  private currentOrder = {}
  private isSearch: boolean = false

  private orderStatusList = [
    { label: '全部', value: '全部' },
    { label: '未接单', value: '未接单' },
    { label: '已接单', value: '已接单' },
    { label: '已完成', value: '已完成' },
    { label: '已取消', value: '已取消' }
  ]

  created() {
    this.init('全部')
  }

  initFun(status) {
    this.page = 1
    this.init(status)
  }

  changeStatus(status) {
    if (status === this.currentStatus) return
    this.currentStatus = status
    this.searchForm = {
      id: '',
      phone: '',
      emergency: null
    }
    this.init(status)
  }

  async init(status: string = '全部', isSearch?) {
    this.isSearch = isSearch || false
    // 构建请求参数
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      phone: this.searchForm.phone || undefined,
      status: status !== '全部' ? status : undefined,
      emergency: this.searchForm.emergency !== null ? this.searchForm.emergency : undefined,
      id: this.searchForm.id || undefined
    }
    try {
      // 调用后端接口获取订单数据
      const res = await getOrderDetailPage(params)
      if (res.data.code === 1) {
        this.tableData = res.data.data.records || []
        this.counts = Number(res.data.data.total)
      } else {
        this.$message.error(res.data.msg || '获取订单数据失败')
      }
    } catch (err) {
      this.$message.error('请求出错了：' + err.message)
      this.tableData = []
      this.counts = 0
    }
  }

  getStatusType(status) {
    switch (status) {
      case '未接单': return 'warning'
      case '已接单': return 'primary'
      case '已完成': return 'success'
      case '已取消': return 'info'
      default: return ''
    }
  }

  async viewOrderDetail(row) {
    try {
      // 调用查询订单详情API
      const res = await queryOrderDetailById(row.id)
      if (res.data.code === 1) {
        this.currentOrder = res.data.data
      } else {
        this.currentOrder = { ...row }
        this.$message.error(res.data.msg || '获取订单详情失败')
      }
    } catch (err) {
      this.currentOrder = { ...row }
      this.$message.error('请求出错了：' + err.message)
    }
    this.dialogVisible = true
  }

  acceptOrder(row) {
    this.$confirm('确认接单吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        // 调用接单API
        const res = await updateOrderStatus('已接单', row.id)
        if (res.data.code === 1) {
          // 如果是在详情弹窗内操作，更新当前订单数据
          if (this.dialogVisible && this.currentOrder['id'] === row.id) {
            this.currentOrder = { ...this.currentOrder, status: '已接单' }
          }
          this.$message.success('接单成功')
          // 重新加载数据
          this.init(this.currentStatus)
        } else {
          this.$message.error(res.data.msg || '接单失败')
        }
      } catch (err) {
        this.$message.error('请求出错了：' + err.message)
      }
    }).catch(() => {
      this.$message.info('已取消接单')
    })
  }

  completeOrder(row) {
    this.$confirm('确认完成订单吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        // 调用完成订单API
        const res = await updateOrderStatus('已完成', row.id)
        if (res.data.code === 1) {
          // 如果是在详情弹窗内操作，更新当前订单数据并关闭弹窗
          if (this.dialogVisible && this.currentOrder['id'] === row.id) {
            this.currentOrder = { ...this.currentOrder, status: '已完成' }
            this.dialogVisible = false
          }
          this.$message.success('订单已完成')
          // 重新加载数据
          this.init(this.currentStatus)
        } else {
          this.$message.error(res.data.msg || '完成订单失败')
        }
      } catch (err) {
        this.$message.error('请求出错了：' + err.message)
      }
    }).catch(() => {
      this.$message.info('已取消操作')
    })
  }

  cancelOrder(row) {
    this.$confirm('确认取消订单吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        // 调用取消订单API
        const res = await updateOrderStatus('已取消', row.id)
        if (res.data.code === 1) {
          // 如果是在详情弹窗内操作，更新当前订单数据并关闭弹窗
          if (this.dialogVisible && this.currentOrder['id'] === row.id) {
            this.currentOrder = { ...this.currentOrder, status: '已取消' }
            this.dialogVisible = false
          }
          this.$message.success('订单已取消')
          // 重新加载数据
          this.init(this.currentStatus)
        } else {
          this.$message.error(res.data.msg || '取消订单失败')
        }
      } catch (err) {
        this.$message.error('请求出错了：' + err.message)
      }
    }).catch(() => {
      this.$message.info('已取消操作')
    })
  }

  handleClose() {
    this.dialogVisible = false
  }

  private handleSizeChange(val: any) {
    this.pageSize = val
    this.init(this.currentStatus)
  }

  private handleCurrentChange(val: any) {
    this.page = val
    this.init(this.currentStatus)
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    min-height: 700px;
    .tab-buttons {
      display: flex;
      margin-bottom: 20px;
      .status-btn {
        width: 120px;
        margin-right: 10px;
        background-color: white;
        color: #333;
        border: 1px solid #e5e4e4;
        &.active {
          background-color: rgb(76,175,80);
          color: white;
          font-weight: bold;
          border: 1px solid rgb(76,175,80);
        }
      }
    }
    .container {
      background: #fff;
      position: relative;
      z-index: 1;
      padding: 30px 28px;
      border-radius: 4px;
      height: calc(100% - 55px);

      .tableBar {
        margin-bottom: 20px;
        justify-content: space-between;
      }

      .tableBox {
        width: 100%;
        border: 1px solid #ebeef5;
        border-bottom: 0;
      }

      .pageList {
        text-align: center;
        margin-top: 30px;
      }
      //查询黑色按钮样式
      .normal-btn {
        background: #333333;
        color: white;
        margin-left: 20px;
      }
    }
    .hContainer {
      height: auto !important;
    }
    .empty-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 100px;
      .no-data-icon {
        font-size: 60px;
        color: #909399;
        margin-bottom: 20px;
      }
      p {
        color: #909399;
        font-size: 14px;
      }
    }
  }
}

.order-top {
  border-bottom: 1px solid #e7e6e6;
  padding-bottom: 26px;
  padding-left: 22px;
  padding-right: 22px;
  display: flex;
  flex-direction: column;
  .top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .order-status {
    width: 57.25px;
    height: 27px;
    background: #333333;
    border-radius: 13.5px;
    color: white;
    margin-left: 19px;
    text-align: center;
    line-height: 27px;
  }
  .status3 {
    background: #f56c6c;
  }
  .time-info {
    display: flex;
    flex-direction: column;
    .time-row {
      display: flex;
      margin-bottom: 5px;
      .time-item {
        flex: 1;
        display: flex;
        label {
          width: 85px;
          color: #666;
          flex-shrink: 0;
          text-align: right;
          padding-right: 8px;
        }
        span {
          flex: 1;
        }
      }
    }
  }
  .order-num {
    font-size: 16px;
    color: #2a2929;
    font-weight: bold;
    display: inline-block;
  }
}

.order-middle {
  .user-info {
    min-height: 140px;
    background: #fbfbfa;
    margin-top: 23px;
    padding: 20px 43px;
    color: #333;
    .user-info-box {
      min-height: 55px;
      display: flex;
      flex-wrap: wrap;
      .user-name, .user-room, .user-emergency, .user-phone, .staff-info {
        flex: 50%;
        margin-bottom: 14px;
        display: flex;
        label {
          width: 80px;
          text-align: right;
          margin-right: 10px;
          color: #666;
          flex-shrink: 0;
        }
        span {
          flex: 1;
        }
      }
      .room-and-type {
        display: flex;
        flex: 100%;
        margin-bottom: 14px;
        .user-room-name, .order-type {
          flex: 50%;
          display: flex;
          label {
            width: 80px;
            text-align: right;
            margin-right: 10px;
            color: #666;
            flex-shrink: 0;
          }
          span {
            flex: 1;
          }
        }
      }
    }
    .user-remark {
      min-height: 43px;
      line-height: 43px;
      background: #fffbf0;
      border: 1px solid #fbe396;
      border-radius: 4px;
      margin-top: 10px;
      padding: 6px;
      display: flex;
      align-items: center;
      div {
        display: inline-block;
        min-width: 53px;
        height: 32px;
        background: #fbe396;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        color: #333;
        margin-right: 30px;
      }
      span {
        color: #333;
        line-height: 1.15;
      }
    }
  }
  .image-info {
    display: flex;
    padding: 20px 40px;
    border-bottom: 1px solid #e7e6e6;
    .image-label {
      color: #666;
      margin-right: 65px;
    }
    .image-content {
      flex: 1;
    }
  }
}

.order-bottom {
  .amount-info {
    display: flex;
    padding: 20px 40px;
    .amount-label {
      color: #666;
      margin-right: 65px;
    }
    .amount-list {
      flex: 80%;
      color: #333;
      .all-amount {
        .amount-name {
          margin-right: 24px;
        }
        .amount-price {
          color: #f56c6c;
        }
      }
    }
  }
}

.operate {
  .cell {
    display: flex;
    justify-content: center;
    .btn-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .el-button {
        margin: 0 5px;
      }
      .blueBug {
        color: rgb(76,175,80);
      }
      .redBug {
        color: #F56C6C;
      }
    }
  }
}
</style>

<style lang="scss">
.order-dialog {
  .el-dialog {
    max-height: 764px !important;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
  }
  .el-dialog__body {
    height: 520px !important;
    padding-top: 34px;
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
