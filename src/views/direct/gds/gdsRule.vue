<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="规则类型" prop="ruleType">
        <el-select
          v-model="queryParams.ruleType"
          placeholder="规则类型"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in ruleOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['direct/gds_rule/add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['direct/gds_rule/edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['direct/gds_rule/remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="gdsRuleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" prop="id" width="120" />
      <el-table-column label="规则类型" prop="bookGdsChannel" width="100" />
      <el-table-column label="出发地" prop="origin" width="100" />
      <el-table-column label="目的地" prop="destination" width="100" />
      <el-table-column label="双向标识" prop="bothWaysFlag" width="100" />
      <el-table-column label="开始旅行日期" prop="effectiveFrom" width="100" />
      <el-table-column label="结束旅行日期" prop="effectiveTo" width="100" />
      <el-table-column label="自定义内容一" prop="parameter1" width="100" />
      <el-table-column label="自定义内容二" prop="parameter2" width="100" />
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
            v-hasPermi="['direct/gds_rule/edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['direct/gds_rule/remove']"
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
    <!-- 添加或修改配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-form-item label="规则类型" prop="ruleType" label-width="150px">
            <el-select
              v-model="queryParams.ruleType"
              placeholder="规则类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in ruleOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-row>


        <!--GDS-航线黑名单规则类型-->
        <div v-show ="this.queryParams.ruleType =='GDS-7' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="出票GDS系统" prop="gdsCode" label-width="150px">
                <el-input v-model="form.gdsCode" placeholder="出票GDS系统" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="PCC配置号" prop="pccCode" label-width="150px">
                <el-input v-model="form.pccCode" placeholder="请输入数字(分钟)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="始发地" prop="origin" label-width="150px">
                <el-input v-model="form.origin" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="目的地" prop="destination" label-width="150px">
                <el-input v-model="form.destination" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>


        <!--限制方案数量-->
        <div v-show ="this.queryParams.ruleType =='GDS-11' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="出票GDS系统" prop="gdsCode" label-width="150px">
                <el-input v-model="form.gdsCode" placeholder="出票GDS系统" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="PCC配置号" prop="pccCode" label-width="150px">
                <el-input v-model="form.pccCode" placeholder="请输入数字(分钟)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="始发地" prop="origin" label-width="150px">
                <el-input v-model="form.origin" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="目的地" prop="destination" label-width="150px">
                <el-input v-model="form.destination" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="行程类型" prop="parameter2" label-width="150px">
                <el-input v-model="form.parameter2" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="方案数量" prop="parameter1" label-width="150px">
                <el-input v-model="form.parameter1" placeholder="请输入数字" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--航线航司黑名单-->
        <div v-show ="this.queryParams.ruleType =='GDS-4' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="出票GDS系统" prop="gdsCode" label-width="150px">
                <el-input v-model="form.gdsCode" placeholder="出票GDS系统" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="PCC配置号" prop="pccCode" label-width="150px">
                <el-input v-model="form.pccCode" placeholder="请输入数字(分钟)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="始发地" prop="origin" label-width="150px">
                <el-input v-model="form.origin" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="目的地" prop="destination" label-width="150px">
                <el-input v-model="form.destination" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="航司" prop="parameter1" label-width="150px">
                <el-input v-model="form.parameter1" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--航司航线白名单-->
        <div v-show ="this.queryParams.ruleType =='GDS-30' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="出票GDS系统" prop="gdsCode" label-width="150px">
                <el-input v-model="form.gdsCode" placeholder="出票GDS系统" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="PCC配置号" prop="pccCode" label-width="150px">
                <el-input v-model="form.pccCode" placeholder="请输入数字(分钟)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="始发地" prop="origin" label-width="150px">
                <el-input v-model="form.origin" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="目的地" prop="destination" label-width="150px">
                <el-input v-model="form.destination" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="双向标识" prop="bothWaysFlag" label-width="150px">
                <el-radio-group v-model="form.bothWaysFlag">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="飞行类型" prop="parameter1" label-width="150px">
                <el-radio-group v-model="form.parameter1">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="航司" prop="parameter2" label-width="150px">
                <el-input v-model="form.parameter2" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="规则生效时间" prop="field102">
                <el-date-picker v-model="form.effectiveFrom" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :style="{width: '100%'}" placeholder="请选择日期选择" clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规则失效时间" prop="field102">
                <el-date-picker v-model="form.effectiveTo" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :style="{width: '100%'}" placeholder="请选择日期选择" clearable></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--航司指定GDS来源设置-->
        <div v-show ="this.queryParams.ruleType =='GDS-28' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="出票GDS系统" prop="gdsCode" label-width="150px">
                <el-input v-model="form.gdsCode" placeholder="出票GDS系统" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="始发地" prop="origin" label-width="150px">
                <el-input v-model="form.origin" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="目的地" prop="destination" label-width="150px">
                <el-input v-model="form.destination" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="航司" prop="parameter1" label-width="150px">
                <el-input v-model="form.parameter1" placeholder="请输入大写字母" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--航司舱位黑名单-->
        <div v-show ="this.queryParams.ruleType =='GDS-18' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="出票GDS系统" prop="gdsCode" label-width="150px">
                <el-input v-model="form.gdsCode" placeholder="出票GDS系统" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="航司舱位黑名单时间" prop="parameter1" label-width="150px">
                <el-input v-model="form.parameter1" placeholder="请输入数字(秒)" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

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
  import { listGdsRule, getGdsRule, delGdsRule, addGdsRule, updateGdsRule, changeGdsRuleStatus } from "@/api/direct/gds/gdsRule";

  export default {
    name: "GdsRule",
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
        // GDS表格数据
        gdsRuleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        ruleOptions: [],
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          gdsCode: undefined,
          gdsCname: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          gdsCode: [
            { required: true, message: "GDS编码不能为空", trigger: "blur" }
          ],
          ruleType: [
            { required: true, message: "GDS规则不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("direct_rule_gds").then(response => {
        this.ruleOptions = response.data;
      });
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listGdsRule(this.addDateRange(this.queryParams, this.dateRange)).then(
          response => {
            this.gdsList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 角色状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.gdsCode + '"编码吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeGdsRuleStatus(row.id, row.status);
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
          gdsCode: undefined,
          pccCode: undefined,
          ruleType: undefined,
          parameter1: undefined,
          parameter2: undefined,
          parameter3: undefined,
          origin: undefined,
          destination: undefined,
          bothWaysFlag: undefined,
          effectiveFrom: undefined,
          effectiveTo: undefined,
          effectiveMinute: undefined,
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
        this.title = "添加GDS规则";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getGdsRule(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改GDS规则";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateGdsRule(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addGdsRule(this.form).then(response => {
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
          return delGds(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
    }
  };
</script>

