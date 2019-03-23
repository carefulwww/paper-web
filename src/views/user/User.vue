<template>
	<section>
		<!--工具条-->
		<el-col span="24" class="toolbar" style="padding-bottom: 0px;">
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
		<el-table highlight-current-row v-loading="listLoading" style="width: 100%;">

			<el-table-column type="selection" min-width="10%"></el-table-column>

			<el-table-column prop="id" min-width="10%" label="ID"></el-table-column>

			<el-table-column prop="name" min-width="20%" label="用户名"></el-table-column>

			<el-table-column prop="password" min-width="25%" label="密码"></el-table-column>

			<el-table-column prop="type" min-width="10%" label="类别"></el-table-column>

			<el-table-column prop="time" min-width="15%" label="最后更新时间"></el-table-column>

			<el-table-column label="操作" min-width="10%">
				<template>
					<el-button size="small">编辑</el-button>
					<el-button size="small" type="danger">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>
