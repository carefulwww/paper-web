<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="questionList" v-loading="loading" fit highlight-current-row :row-key="questionList.uuid" :current-row-key="0" >
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
				<el-table-column label="添加到组卷车" width="70" fixed="left" disabled>
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isAdd" size="small" icon="el-icon-plus" circle @click="add(scope.row)"></el-button>
					<el-button v-else size="small" type="success" icon="el-icon-check" circle @click="deleteR(scope.row)"></el-button>
        </template>
      </el-table-column>
			<el-table-column label="序号" align="center" width="65px">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<el-table-column label="试题ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.uuid}}</span>
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
			<el-table-column label="创建时间" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.createTime*1000|formatDate('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="更新时间" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.updateTime*1000|formatDate('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			</el-table>
			<pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
        style="margin-top:20px"
      />
		</template>
		<shopping-cart :users="cartList" />
	</section>
</template>
<script>
import QuestionAPI from '@/api/questions'
import shoppingCart from '../../components/shoppingCart'
import Pagination from '@/components/Pagination'
// import NProgress from 'nprogress'
export default {
  data() {
    return {
      filters: {
        name: ''
      },
      loading: false,
      questionList: [
      ],
      cartList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  components: {
    shoppingCart,
    Pagination
  },
  methods: {
    add(row) {
      row.isAdd = true
      this.cartList.push(row)
      this.$message({
        message: '添加试题到组卷车成功！',
        type: 'success'
      })
      this.$nextTick()
    },
    deleteR(row) {
      row.isAdd = false
      this.cartList.map((e, i) => {
        if (e.id === row.id) {
          this.cartList.splice(i, 1)
          return
        }
      })
      this.$message({
        message: '从组卷车删除试题成功！',
        type: 'success'
      })
    },
    async getList() {
      this.listLoading = true

      const vm = this
      await QuestionAPI.getQuestion(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.questionList = res.data.data.list
          this.total = res.data.data.total
          // vm.$message({
          //   type: 'success',
          //   message: '用户表加载成功'
          // })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.listLoading = false
    }
  },
  mounted() {
    this.getList()
  }
}

</script>

<style scoped>

</style>