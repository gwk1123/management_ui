<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="城市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入城市"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="城市码" prop="ccode">
        <el-input
          v-model="queryParams.ccode"
          placeholder="请输入城市码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="机场" prop="airport">
        <el-input
          v-model="queryParams.airport"
          placeholder="请输入机场"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="机场码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入机场码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['direct/all_airports/add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['direct/all_airports/edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['direct/all_airports/remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="allAirportsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" prop="id" width="100" />
      <el-table-column label="洲" prop="continent" width="100" />
      <el-table-column label="洲码" prop="zcode" width="100" />
      <el-table-column label="区域" prop="region" width="100" />
      <el-table-column label="区域码" prop="qcode" width="100" />
      <el-table-column label="国家" prop="country" width="100" />
      <el-table-column label="国家码" prop="gcode" width="100" />
      <el-table-column label="城市" prop="city" width="100" />
      <el-table-column label="城市码" prop="ccode" width="100" />
      <el-table-column label="机场" prop="airport" width="100" />
      <el-table-column label="机场码" prop="code" width="100" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['direct/all_airports/edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['direct/all_airports/remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="洲" prop="continent">
          <el-input v-model="form.continent" placeholder="请输入洲" />
        </el-form-item>
        <el-form-item label="洲码" prop="zcode">
          <el-input v-model="form.zcode" placeholder="请输入洲码" />
        </el-form-item>

        <el-form-item label="区域" prop="region">
          <el-input v-model="form.region" placeholder="请输入区域" />
        </el-form-item>
        <el-form-item label="区域码" prop="qcode">
          <el-input v-model="form.qcode" placeholder="请输入区域码" />
        </el-form-item>

        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country"  placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="国家码" prop="gcode">
          <el-input v-model="form.gcode"  placeholder="请输入国家码" />
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city"  placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="城市码" prop="ccode">
          <el-input v-model="form.ccode"  placeholder="请输入城市码" />
        </el-form-item>

        <el-form-item label="机场" prop="airport">
          <el-input v-model="form.airport"  placeholder="请输入机场" />
        </el-form-item>
        <el-form-item label="机场码" prop="code">
          <el-input v-model="form.code"  placeholder="请输入机场码" />
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
  import { listAllAirports, getAllAirports, delAllAirports, addAllAirports, updateAllAirports, changeAllAirportsStatus } from "@/api/direct/basic/allAirports";

  export default {
    name: "AllAirports",
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
        // 机场表格数据
        allAirportsList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          city: undefined,
          ccode: undefined,
          airport: undefined,
          code: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          region: [
            { required: true, message: "区域不能为空", trigger: "blur" }
          ],
          qcode: [
            { required: true, message: "区域码不能为空", trigger: "blur" }
          ],
          country: [
            { required: true, message: "国家不能为空", trigger: "blur" }
          ],
          gcode: [
            { required: true, message: "国家码不能为空", trigger: "blur" }
          ],
          city: [
            { required: true, message: "城市不能为空", trigger: "blur" }
          ],
          ccode: [
            { required: true, message: "城市码不能为空", trigger: "blur" }
          ],
          airport: [
            { required: true, message: "机场不能为空", trigger: "blur" }
          ],
          code: [
            { required: true, message: "机场码不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listAllAirports(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.allAirportsList = response.records;
            this.total = response.total;
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
          continent: undefined,
          zcode: undefined,
          region: undefined,
          qcode: undefined,
          country: undefined,
          gcode: undefined,
          city: undefined,
          ccode: undefined,
          airport: undefined,
          code: undefined
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
        this.title = "添加角色";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getAllAirports(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改角色";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateAllAirports(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addAllAirports(this.form).then(response => {
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
          return delAllAirports(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
    }
  };
</script>
