<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
            <el-form :inline="true">
                <el-form-item>
                    <el-input placeholder="科目名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form-item>

                <!--管理员才可以进行新增操作-->
                <el-form-item>
                    <el-button type="primary">新增</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table highlight-current-row v-loading="listLoading" style="width: 100%;">

            <el-table-column type="selection" style="width: 10%;"></el-table-column>

            <el-table-column prop="id" style="width: 10%;" label="ID"></el-table-column>

            <el-table-column prop="name" style="width: 35%;" label="科目名称"></el-table-column>

            <el-table-column prop="time" style="width: 35%;" label="创建时间"></el-table-column>

            <el-table-column label="操作" style="width: 10%">
                <template>
                    <el-button size="small" >编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
    export default {
        name: "have_subject"
    }
</script>

<style scoped>

</style>
