<template>
  <div>
    <el-button
      :type="isShow ? 'primary' : ''"
      class="cardButton"
      icon="el-icon-goods"
      circle
      @click="isShow = !isShow"
    ></el-button>
    <el-card class="cartDialog" v-if="isShow">
      <div slot="header" class="clearfix">
        <span>组卷车</span>
        <el-button type="primary" size="mini" style="float:right">出卷</el-button>
      </div>
      <el-table :data="users" style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left">
              <el-form-item label="生日">
                <span>{{ props.row.birth }}</span>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ props.row.addr }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" sortable></el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatSex" sortable></el-table-column>
        <el-table-column prop="age" label="年龄" sortable></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    }
  }
};
</script>

<style scoped>
.cardButton {
  position: absolute;
  right: 40px;
  bottom: 20px;
  z-index: 3000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
}
.cartDialog {
  position: absolute;
  right: 40px;
  bottom: 70px;
  z-index: 3000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  width: 60vh;
  height: 80vh;
  /* opacity: 0.2; */
}
/* .cartDialog:hover{
  opacity: 1;
} */
</style>
