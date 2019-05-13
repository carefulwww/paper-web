<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="作品名称"></el-input>
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
    <el-table highlight-current-row :data="excellentWorkList" v-loading="listLoading" style="width: 100%;">
      <el-table-column type="selection" style="width: 10%;"></el-table-column>

      <el-table-column prop="id" style="width: 10%;" label="ID"></el-table-column>

      <el-table-column prop="name" style="width: 25%;" label="作品名称"></el-table-column>

      <el-table-column prop="subject" style="width: 15%;" label="所属科目"></el-table-column>

      <el-table-column prop="writer" style="width: 15%;" label="作者"></el-table-column>

      <el-table-column prop="time" style="width: 15%;" label="时间"></el-table-column>

      <el-table-column label="操作" style="width: 10%">
        <template slot-scope="scope">
          <el-button size="small" @click="$router.push({path:'/workDetail',query:{id:scope.row.id}})">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
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
import ExcellentWorkAPI from '@/api/excellentWork'
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      listLoading: false,
      excellentWorkList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0
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
      await ExcellentWorkAPI.getExcellentWork(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.excellentWorkList = res.data.data.list
          this.total = res.data.data.total
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

<style scoped>
</style>
