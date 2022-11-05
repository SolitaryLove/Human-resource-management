<template>
    <el-card class="page-tools">
        <!-- 左侧-提示信息 -->
        <div class="left">
            <div class="tips">
                <i class="el-icon-info" />
                <slot name="slot-left">
                    <span>文字区域</span>
                </slot>
            </div>
        </div>
        <!-- 右侧-操作区域 -->
        <div class="right">
            <slot name="slot-right">
                <span>按钮区域</span>
            </slot>
        </div>
    </el-card>
</template>

<script>
export default {
    name:'PageTools'
}
</script>

<style lang="scss" scoped>
.page-tools  {
  ::v-deep .el-card__body{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);

    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>