<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">




      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="siteRulesSwitchList" 　tooltip-effect="light"
              　　　　highlight-current-row
              　　　　:cell-style="cellStyle">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" prop="id" width="120" />
      <el-table-column label="Key分组" prop="groupKey" width="100" />
      <el-table-column label="键" prop="parameterKey" width="100" />
      <el-table-column label="参数名称" prop="parameterName" width="100" />
      <el-table-column label="值" prop="parameterValue" width="100" />
    </el-table>

  </div>
</template>

<script>
  import { listSiteRulesSwitch} from "@/api/direct/gds/siteRulesSwitch";

  export default {
    name: "gdsSearch",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // OTA表格数据
        siteRulesSwitchList: [],
        // 弹出层标题
        open: false,
        // 查询参数
        queryParams: {
        },
        // 表单参数
        form: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listSiteRulesSwitch(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.siteRulesSwitchList = response;
            this.loading = false;
          }
        );
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          groupKey: undefined,
          parameterKey: undefined,
          parameterName: undefined,
          parameterValue: undefined,
          status: "0",
          remark: undefined
        };
        this.resetForm("form");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
      }
    }
  };
</script>
