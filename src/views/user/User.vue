<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table highlight-current-row v-loading="listLoading" :data="userList" fit>

			<!-- <el-table-column type="selection" min-width="10%"></el-table-column> -->
			<el-table-column label="序号" align="center" width="65px">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>

			<el-table-column label="ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.uuid}}</span>
				</template>
			</el-table-column>
			<el-table-column label="用户名" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.userName}}</span>
				</template>
			</el-table-column>

			<!-- <el-table-column prop="password" min-width="25%" label="密码"></el-table-column> -->

			<el-table-column label="用户类型" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.type|filterByDic(userDic)}}</span>
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

			<el-table-column label="操作" width="300px" align="center" fixed="right">
				<template>
					<el-button size="small">编辑</el-button>
					<el-button size="small">重置密码</el-button>
					<el-button size="small" type="danger">删除</el-button>
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
	</section>
</template>

<script>
import UserAPI from '@/api/user'
import Pagination from '@/components/Pagination'
import userDic from '@/utils/dic/user'
export default {
  data() {
    return {
      listLoading: false,
      userList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      userDic: userDic
    }
  },
  components: { Pagination },
  filters: {
    filterByDic(val, dic) {
      // debugger
      if (val && dic) {
        return dic.find(e => e.value === val).label
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true

      const vm = this
      await UserAPI.getUser(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.userList = res.data.data.list
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
  }
}
</script>

