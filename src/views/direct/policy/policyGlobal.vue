<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="产品类型" prop="productType">
        <el-input
          v-model="queryParams.productType"
          placeholder="请输入产品类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运价类型" prop="priceType">
        <el-input
          v-model="queryParams.priceType"
          placeholder="请输入运价类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行程类型" prop="tripType">
        <el-input
          v-model="queryParams.tripType"
          placeholder="请输入行程类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="是否中转" prop="permitTransit">
        <el-input
          v-model="queryParams.permitTransit"
          placeholder="请输入是否中转"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="GDS状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['direct/policy_global/add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['direct/policy_global/edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['direct/policy_global/remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="policyGlobalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" prop="id" width="120" />
      <el-table-column label="GDS类型" prop="bookGdsChannel" width="100" />
      <el-table-column label="产品类型" prop="productType" width="100" />
      <el-table-column label="运价类型" prop="priceType" width="100" />
      <el-table-column label="航司" prop="airline" width="100" />
      <el-table-column label="行程类型" prop="tripType" width="100" />
      <el-table-column label="是否共享" prop="permitCodeShare" width="100" />
      <el-table-column label="是否混合" prop="permitInterline" width="100" />
      <el-table-column label="是否中转" prop="permitTransit" width="100" />
      <el-table-column label="成人票面留钱" prop="adultPrice" width="100" />
      <el-table-column label="成人税费留钱" prop="adultTax" width="100" />
      <el-table-column label="儿童票面留钱" prop="childPrice" width="100" />
      <el-table-column label="儿童税费留钱" prop="childTax" width="100" />
      <el-table-column label="销售开始时间" prop="saleStartTime" width="100" />
      <el-table-column label="销售结束时间" prop="saleEndTime" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['direct/policy_global/edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['direct/policy_global/remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
        <el-form-item label="GDS类型" prop="bookGdsChannel">
          <el-input v-model="form.bookGdsChannel" placeholder="请输入OTA编码" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="航司" prop="airline">
          <el-input v-model="form.airline" placeholder="请输入航司二字码" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="产品类型" prop="productType">
          <el-input v-model="form.productType" placeholder="请输入OTA英文名" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="运价类型" prop="priceType">
          <el-input v-model="form.priceType" placeholder="请输入OTA全中文名" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="行程类型" prop="permitCodeShare">
          <el-input v-model="form.permitCodeShare"  placeholder="请输入OTA全英文名" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="是否共享" prop="gdsFullEname">
          <el-input v-model="form.otaFullEname"  placeholder="请输入OTA全英文名" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="是否混合" prop="permitInterline">
          <el-input v-model="form.permitInterline"  placeholder="请输入OTA全英文名" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="是否中转" prop="permitTransit">
          <el-input v-model="form.permitTransit"  placeholder="请输入OTA全英文名" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="成人票面留钱" prop="adultPrice">
          <el-input v-model="form.adultPrice"  placeholder="请输入OTA全英文名" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="成人税费留钱" prop="adultTax">
          <el-input v-model="form.adultTax"  placeholder="请输入OTA全英文名" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="儿童票面留钱" prop="childPrice">
          <el-input v-model="form.childPrice"  placeholder="请输入OTA全英文名" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="儿童税费留钱" prop="childTax">
          <el-input v-model="form.childTax"  placeholder="请输入OTA全英文名" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="销售开始时间" prop="saleStartTime">
          <el-input v-model="form.saleStartTime"  placeholder="请输入OTA全英文名" />
        </el-form-item>
        <el-form-item label="销售结束时间" prop="saleEndTime">
          <el-input v-model="form.saleEndTime"  placeholder="请输入OTA全英文名" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listPolicyGlobal, getPolicyGlobal, delPolicyGlobal, addPolicyGlobal, updatePolicyGlobal, changePolicyGlobalStatus } from "@/api/direct/policy/policyGlobal";

  export default {
    name: "Ota",
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
        // 总条数
        total: 0,
        // OTA表格数据
        policyGlobalList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          productType: undefined,
          priceType: undefined,
          airline: undefined,
          tripType: undefined,
          permitTransit: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          // otaCode: [
          //   { required: true, message: "OTA编码不能为空", trigger: "blur" }
          // ],
          // otaCname: [
          //   { required: true, message: "OTA中文名不能为空", trigger: "blur" }
          // ],
          // otaEname: [
          //   { required: true, message: "OTA英文名不能为空", trigger: "blur" }
          // ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listPolicyGlobal(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.policyGlobalList = response.records;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 角色状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.otaCode + '"编码吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changePolicyGlobalStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          bookGdsChannel: undefined,
          productType: undefined,
          priceType: undefined,
          airline: undefined,
          tripType: undefined,
          permitCodeShare: undefined,
          permitInterline: undefined,
          permitTransit: undefined,
          adultPrice: undefined,
          adultTax: undefined,
          childPrice: undefined,
          childTax: undefined,
          saleStartTime: undefined,
          saleEndTime: undefined,
          status: "0",
          remark: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.current = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加站点";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getPolicyGlobal(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改站点";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const path = this.$route.path;
            //跟据路由的路径获取平台和站点
            const otaStr = path.split("/")[2];
            this.form.otaCode = (otaStr.split("_")[0]).toUpperCase( );
            this.form.otaSiteCode = (otaStr.split("_")[1]).toUpperCase( );
            if (this.form.id != undefined) {
              updatePolicyGlobal(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addPolicyGlobal(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除id为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPolicyGlobal(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
    }
  };
</script>
