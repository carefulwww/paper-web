<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" v-loading="loading" style="width: 100%;">
				<el-table-column label="添加到组卷车" width="70">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isAdd" size="small" icon="el-icon-plus" circle @click="add(scope.row)"></el-button>
					<el-button v-else size="small" type="success" icon="el-icon-check" circle @click="deleteR(scope.row)"></el-button>
        </template>
      </el-table-column>
				<el-table-column prop="name" label="姓名" width="120" sortable>
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
				</el-table-column>
				<el-table-column prop="age" label="年龄" width="100" sortable>
				</el-table-column>
				<el-table-column prop="birth" label="生日" width="120" sortable>
				</el-table-column>
				<el-table-column prop="addr" label="地址" min-width="180" sortable>
				</el-table-column>
			</el-table>
		</template>
		<shopping-cart :users="cartList" />
	</section>
</template>
<script>
	import { getUserList } from '../../api/api'
	import shoppingCart from '../../components/shoppingCart'
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				users: [
				],
				cartList:[]
			}
		},
		components:{
			shoppingCart
		},
		methods: {
			add(row){
				row.isAdd = true
				this.cartList.push(row)
				this.$message({
					message:'添加试题到组卷车成功！',
					type:'success'
				})
			},
			deleteR(row){
				row.isAdd = false
				this.cartList.map((e,i) => {
					if(e.id === row.id){
						this.cartList.splice(i,1)
						return
					}
				})
				this.$message({
					message:'从组卷车删除试题成功！',
					type:'success'
				})
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			//获取用户列表
			getUser: function () {
				let para = {
					name: this.filters.name
				};
				this.loading = true;
				//NProgress.start();
				getUserList(para).then((res) => {
					this.users = res.data.users;
					this.loading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>

</style>