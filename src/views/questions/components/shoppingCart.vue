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
        <el-button type="primary" size="mini" style="float:right" @click="rollOut">出卷</el-button>
      </div>
      <div style="width: 550px;height: 70vh;">

      <el-scrollbar style="height:100%;">

      <el-table :data="list" style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" >
							<el-form-item label="出题人ID">
                <span>{{ props.row.createUserId }}</span>
              </el-form-item>
              <el-form-item label="试题内容">
                <span>{{ props.row.questionContent }}</span>
              </el-form-item>
              <el-form-item label="试题选项">
                <span>{{ props.row.options }}</span>
              </el-form-item>
              <el-form-item label="试题答案">
                <span>{{ props.row.answer }}</span>
              </el-form-item>
							<el-form-item label="试题分值">
                <span>{{ props.row.score }}</span>
              </el-form-item>
							<el-form-item label="试题难度">
                <span>{{ props.row.difficulty }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
			<el-table-column label="序号" align="center" width="65px">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<el-table-column label="试题类型" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.type}}</span>
				</template>
			</el-table-column>
			<el-table-column label="所属科目ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.subjectId}}</span>
				</template>
			</el-table-column>
      </el-table>
      </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    rollOut() {
      if (this.list.length < 10) {
        this.$message({
          type: 'warning',
          message: '选择的试题不足10题，无法组卷。'
        })
      } else {
        this.$emit('rollOut')
        this.isShow = false
      }
    }
  }
}
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
  /* opacity: 0.2; */
}
/* .cartDialog:hover{
  opacity: 1;
} */
</style>
