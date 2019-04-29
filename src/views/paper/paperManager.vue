<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="试卷名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.subjectId" placeholder="科目ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button type="primary">新增</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="list" fit highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column label="序号" align="center" width="65px">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
      <!-- <el-table-column label="试卷ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.uuid}}</span>
				</template>
			</el-table-column> -->
      <el-table-column label="试卷名称" align="center" >
				<template slot-scope="scope">
					<span>{{scope.row.paperName}}</span>
				</template>
			</el-table-column>
      <el-table-column label="科目ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.subjectId}}</span>
				</template>
			</el-table-column>
      <el-table-column label="创建人ID" align="center" width="280px">
				<template slot-scope="scope">
					<span>{{scope.row.createUserId}}</span>
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

      <el-table-column label="操作" align="center" width="300px" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="showDetail(scope.row)">详情</el-button>
          <el-button size="small">下载</el-button>
          <el-button size="small">编辑</el-button>
          <el-button type="danger" size="small" @click="deletePaper(scope.row)">删除</el-button>
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
      <el-dialog
        :visible.sync="showDialog"
				title="试卷预览"
				:before-close="handleClose"
				style="text-align:center;padding: 0 20px">
        <div class="prepaper">
          <el-scrollbar style="height:100%">
          <div v-for="(v,k,i) in filterListObj" :key="i">
            <h1>{{k}}</h1>
            <div v-for="(item,index) in v" :key="index">
              <p>{{`${index+1}.${item.questionContent}（${item.score}分）`}}</p>
              <p>{{`选项${item.options}`}}</p>
            </div>
          </div>
          </el-scrollbar>
        </div>
        <!-- <div>
          <el-button type="primary" @click="confirm">确认</el-button>
          <el-button @click="cancel">取消</el-button>
        </div> -->
      </el-dialog>
  </section>
</template>

<script>
import PaperAPI from '@/api/paper'
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      filters: {
        id: '',
        subjectId: ''
      },
      listLoading: false,
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      showDialog: false,
      filterListObj: {}// 试题分组对象
    }
  },
  components: { Pagination },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true

      const vm = this
      await PaperAPI.getPaper(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.list = res.data.data.list
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
    },
    deletePaper(row) {
      const vm = this
      this.$confirm('是否确认删除该试卷', '提示', {
        type: 'warning'
      }).then(() => {
        // debugger
        PaperAPI.delPaper(row).then(res => {
          // debugger
          if (res && res.status === 200) {
            vm.$message({
              type: 'success',
              message: '删除试卷成功'
            })
            vm.getList()
          } else {
            vm.$message({
              type: 'error',
              message: res.data.statusMessage
            })
          }
        })
      }).catch()
    },
    filterQuestions(row) {
      row.questions.map(e => {
        if (e.type in this.filterListObj) {
          this.filterListObj[e.type].push(e)
        } else {
          this.$set(this.filterListObj, e.type, [e])
        }
      })
    },
    showDetail(row) {
      this.filterQuestions(row)
      this.showDialog = true
    },
    handleClose() {
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
.prepaper{
  height:50vh;
  text-align:left;
  padding:10px 50px;
}
</style>
