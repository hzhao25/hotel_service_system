<!--  -->
<template>
  <div class="tab-change">
    <div
      v-for="item in statusList"
      :key="item.value"
      class="tab-item"
      :class="{ active: item.value === activeStatus }"
      @click="tabChange(item.value)">
      <el-badge
        :class="{'special-item': item.count < 10}"
        class="item"
        :value="item.count > 99 ? '99+' : item.count"
        :hidden="!item.count || item.count <= 0">
        {{ item.label }}
      </el-badge>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'TabChange'
})
export default class extends Vue {
  @Prop({ default: '全部' }) defaultActivity!: string
  @Prop({ default: {} }) orderStatics: any
  private activeStatus = '全部'

  created() {
    this.activeStatus = this.defaultActivity
  }

  @Watch('defaultActivity')
  private onChange(val) {
    this.activeStatus = val
  }

  get statusList() {
    return [
      {
        label: '全部',
        value: '全部',
        count: 0
      },
      {
        label: '未接单',
        value: '未接单',
        count: this.orderStatics.pending || 0
      },
      {
        label: '已接单',
        value: '已接单',
        count: this.orderStatics.accepted || 0
      },
      {
        label: '已完成',
        value: '已完成',
        count: 0
      },
      {
        label: '已取消',
        value: '已取消',
        count: 0
      }
    ]
  }

  private tabChange(status) {
    this.activeStatus = status
    this.$emit('tabChange', status)
  }
}
</script>

<style lang="scss">
.tab-change {
  display: flex;
  border-radius: 4px;
  margin-bottom: 20px;

  .tab-item {
    width: 120px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #333;
    border: 1px solid #e5e4e4;
    background-color: white;
    border-left: none;
    cursor: pointer;
    .special-item {
      .el-badge__content {
        width: 20px;
        padding: 0 5px;
      }
    }
    .item {
      .el-badge__content {
        background-color: #fd3333 !important;
        line-height: 18px;
        height: auto;
        min-width: 18px;
        min-height: 18px;
      }
      .el-badge__content.is-fixed {
        top: 14px;
        right: 2px;
      }
    }
  }
  .active {
    background-color: rgb(76,175,80);
    color: white;
    font-weight: bold;
  }

  .tab-item:first-child {
    border-left: 1px solid #e5e4e4;
  }
}
</style>
