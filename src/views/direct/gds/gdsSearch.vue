<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">


      <el-form-item label="行程类型" prop="tripType">
        <el-input
          v-model="queryParams.tripType"
          placeholder="请输入行程类型"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="出发地" prop="fromCity">
        <el-input
          v-model="queryParams.fromCity"
          placeholder="请输入出发地"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="目的地" prop="toCity">
        <el-input
          v-model="queryParams.toCity"
          placeholder="请输入目的地"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="出发日期" prop="fromDate">
        <el-input
          v-model="queryParams.fromDate"
          placeholder="请输入出发日期"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="回程日期" prop="retDate">
        <el-input
          v-model="queryParams.retDate"
          placeholder="请输入回程日期"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="站点" prop="otaSites">
        <el-input
          v-model="queryParams.otaSites"
          placeholder="请输入站点"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>



      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="gdsSearchList" >
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
  import { listGdsSearch} from "@/api/direct/gds/gdsSearch";

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
        gdsSearchList: [],
        // 弹出层标题
        open: false,
        // 查询参数
        queryParams: {
          tripType: undefined,
          fromCity: undefined,
          toCity: undefined,
          fromDate: undefined,
          retDate: undefined,
          otaSites: undefined
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
        listGdsSearch(this.queryParams).then(
          responseData => {
            const response = responseData.data;
            this.gdsSearchList = response;
            this.loading = false;
          }
        );
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
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
