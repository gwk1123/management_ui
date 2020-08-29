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
          v-hasPermi="['direct/ota_rule/add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['direct/ota_rule/edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['direct/ota_rule/remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="otaRuleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" prop="id" width="120" />
      <el-table-column label="规则类型" prop="bookGdsChannel" width="100" />
      <el-table-column label="出发地" prop="origin" width="100" />
      <el-table-column label="目的地" prop="destination" width="100" />
      <el-table-column label="双向标识" prop="bothWaysFlag" width="100" />
      <el-table-column label="开始旅行日期" prop="travelPeriodFrom" width="100" />
      <el-table-column label="结束旅行日期" prop="travelPeriodTo" width="100" />
      <el-table-column label="自定义内容一" prop="parameter1" width="100" />
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
            v-hasPermi="['direct/ota_rule/edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['direct/ota_rule/remove']"
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


        <!--中转时间过滤，仅仅针对多程-->
        <div v-show ="this.queryParams.ruleType =='OTA-10' ">
        <el-row>
          <el-col :span="12">
            <el-form-item label="中转时间" prop="parameter1" label-width="150px">
              <el-input v-model="form.parameter1" placeholder="请输入数字(分钟)" />
            </el-form-item>
          </el-col>
        </el-row>
        </div>

        <!--机场链接过滤，仅仅针对中转点，中转机场相同则不过滤-->
        <div v-show ="this.queryParams.ruleType =='OTA-12' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="中转机场过滤" prop="parameter1" label-width="150px">
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
        </div>

        <!--共享过滤-->
       <!--如果填写了除外共享航司航班号,则判断航段中的销售航司是否处于除外列表中-->
       <!--输入格式类似于AA100-500,600/BB200-400/AA700-->
        <div v-show ="this.queryParams.ruleType =='OTA-13' ">
          <el-row>
              <el-form-item label="是否限制共享航司" prop="parameter1" label-width="150px">
                <el-radio-group v-model="form.parameter1">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                  >{{dict.dictLabel}}</el-radio>
                </el-radio-group>
              </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="除外共享航司航班号" prop="parameter2" label-width="150px">
                <el-input v-model="form.parameter2" type="textarea" placeholder="请输入格式类似于AA100-500,600/BB200-400/AA700"
                          width="200px" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

            <!--限制混合航司-->
        <div v-show ="this.queryParams.ruleType =='OTA-14' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="限制混合航司" prop="parameter1" label-width="150px">
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
        </div>

        <!--是否允许共享航司为空-->
        <div v-show ="this.queryParams.ruleType =='OTA-16' ">
          <el-row>
            <el-col :span="14">
              <el-form-item label="是否共享航司为空" prop="parameter1" label-width="150px">
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
        </div>

       <!--限制中转次数-->
        <div v-show ="this.queryParams.ruleType =='OTA-9' ">
          <el-row>
            <el-col :span="14">
                <el-form-item label="限制中转次数" prop="parameter1" label-width="150px">
                  <el-input v-model="form.parameter1" placeholder="请输入数字" />
                </el-form-item>
            </el-col>
          </el-row>
        </div>

          <!--航司航线黑名单-->
        <div v-show ="this.queryParams.ruleType =='OTA-33' ">
          <el-row>
            <el-col :span="12">
              <el-form-item label="行程类型" prop="parameter1" label-width="150px">
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
              <el-col :span="16">
                <el-form-item label="出发地" prop="origin" label-width="150px">
                  <el-input v-model="form.origin" type="textarea" placeholder="请输入字母，多个之间用户/分隔"
                            width="200px" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="目的地" prop="destination" label-width="150px">
                <el-input v-model="form.destination" type="textarea" placeholder="请输入字母，多个之间用户/分隔"
                          width="200px" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="航司舱位" prop="destination" label-width="150px">
                <el-input v-model="form.parameter2" type="textarea" placeholder="请输入格式如: CX(M/N/Y),MU(K)"
                          width="200px" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="开始旅行日期" prop="field102">
            <el-date-picker v-model="form.travelPeriodFrom" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            :style="{width: '100%'}" placeholder="请选择日期选择" clearable></el-date-picker>
          </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束旅行日期" prop="field102">
                <el-date-picker v-model="form.travelPeriodTo" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :style="{width: '100%'}" placeholder="请选择日期选择" clearable></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="生效日期" prop="startTime">
                <el-date-picker v-model="form.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :style="{width: '100%'}" placeholder="请选择日期选择" clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="失效日期" prop="endTime">
                <el-date-picker v-model="form.endTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :style="{width: '100%'}" placeholder="请选择日期选择" clearable></el-date-picker>
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

<script >
  import { listOtaRule, getOtaRule, delOtaRule, addOtaRule, updateOtaRule, changeOtaRuleStatus } from "@/api/direct/policy/otaRule";
  export default {
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
        otaRuleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //规则数据字典
        ruleOptions: [],
        // 状态数据字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          ruleType: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        rules: {
          ruleType: [
            { required: true, message: "规则类型不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("direct_rule_type").then(response => {
        this.ruleOptions = response.data;
      });
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      getList() {
        this.loading = true;
        listOtaRule(this.addDateRange(this.queryParams)).then(
          responseData => {
            const response = responseData.data;
            this.otaRuleList = response.records;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.otaCode + '"编码吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeOtaRuleStatus(row.id, row.status);
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
          ruleType: undefined,
          origin: undefined,
          destination: undefined,
          bothWaysFlag: undefined,
          parameter1: undefined,
          parameter2: undefined,
          startTime: undefined,
          endTime: undefined,
          travelPeriodFrom: undefined,
          travelPeriodTo: undefined,
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
        this.title = "添加规则";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getOtaRule(id).then(response => {
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
              updateOtaRule(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addOtaRule(this.form).then(response => {
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
          return delOtaRule(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
 }
    // ruleTypeChange() {
    //     this.productType=this.queryParams.ruleType;
    //     console.log(this.queryParams.ruleType)
    //   }
    };

</script>

