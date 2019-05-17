<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="searchName" placeholder="试卷名称"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-input v-model="filters.subjectId" placeholder="科目ID"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="getList('name')">查询</el-button>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="downloadRecord">下载考场记录表</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="list" fit highlight-current-row v-loading="listLoading" style="width: 100%;" @filter-change="filterQuestionType">
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
      <el-table-column label="科目" align="center" prop="subject" column-key="subject" :filters="subjectFilters" :filter-multiple="false" >
				<template slot-scope="scope">
					<span>{{scope.row.subject.subjectName}}</span>
				</template>
			</el-table-column>
      <el-table-column label="创建人" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.user.nickname}}</span>
				</template>
			</el-table-column>
      <el-table-column label="创建时间" align="center" width="120px">
				<template slot-scope="scope">
					<span>{{scope.row.createTime*1000|formatDate('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="更新时间" align="center" width="120px">
				<template slot-scope="scope">
					<span>{{scope.row.updateTime*1000|formatDate('yyyy-MM-dd')}}</span>
				</template>
			</el-table-column>

      <el-table-column label="操作" align="center" width="350px" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="showDetail(scope.row)">详情</el-button>
          <el-button size="small" @click="downloadPaper(scope.row)">下载试卷</el-button>
          <!-- <el-button size="small">编辑</el-button> -->
          <el-button size="small" @click="downloadAns(scope.row)">下载答案</el-button>
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
import SubjectAPI from '@/api/subject.js'
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
      filterListObj: {}, // 试题分组对象
      searchName: '',
      subjectList: []
    }
  },
  computed: {
    subjectFilters() {
      const tmp = []
      if (this.subjectList) {
        this.subjectList.map(e => {
          tmp.push({
            'text': e.subjectName,
            'value': e.uuid
          })
        })
      }
      return tmp
    }
  },
  components: { Pagination },
  created() {
    this.getList()
    this.getSubjectList()
  },
  methods: {
    getSubjectList() {
      const vm = this
      const data = {
        pageNum: 1
      }
      SubjectAPI.getSubject(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.subjectList = res.data.data.list
          // debugger
        } else {
          vm.$message({
            message: '获取科目列表出错',
            type: 'error'
          })
        }
      })
    },
    async getList(arg) {
      this.listLoading = true

      const vm = this
      if (arg === 'name') {
        this.listQuery = Object.assign({}, this.listQuery, { name: this.searchName })
      } else {
        // debugger
        this.$delete(this.listQuery, 'name')
      }
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
    },
    downloadRecord() {
      window.open('http://94.191.89.57:8080/export/downloadRecord', '_blank') // 新开窗口下载
    },
    downloadAns(row) {
      const url = `http://94.191.89.57:8080/export/downloadAnswer?paperId=${row.uuid}`
      window.open(url, '_blank') // 新开窗口下载
    },
    downloadPaper(row) {
      const url = `http://94.191.89.57:8080/export/downloadPaper?paperId=${row.uuid}`
      window.open(url, '_blank') // 新开窗口下载
    },
    filterQuestionType(filters) {
      console.log(filters)
      // debugger
      const vm = this
      // const data = Object.assign({}, this.listQuery)
      if (filters.subject) {
        this.$set(this.listQuery, 'subjectId', filters.subject[0])
      }

      PaperAPI.getPaper(this.listQuery).then(res => {
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
