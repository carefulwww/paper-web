<template>
    <div style="height: 300px;">
        <br>
        <el-steps direction="vertical" :active="1">
            <el-step title="步骤 1" description="前往试题页面"></el-step>
            <el-step title="步骤 2" description="将需要的试题添加至组卷车"></el-step>
            <el-step title="步骤 3" description="在组卷车中预览试卷并出卷"></el-step>
        </el-steps>
    </div>
</template>

<script>
    export default {
      name: 'manual_paper'
    }
</script>

<style scoped>

</style>
