
<style>
  .el-card__header {
    background-color: #D9EDF7;
  }
</style>

<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="政策id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入政策id"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品类型" prop="productType">
        <el-input
          v-model="queryParams.productType"
          placeholder="请输入产品类型"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="行程类型" prop="tripType">
        <el-input
          v-model="queryParams.tripType"
          placeholder="请输入行程类型"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="航司" prop="airline">
        <el-input
          v-model="queryParams.airline"
          placeholder="请输入航司"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['direct/policy_info/add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['direct/policy_info/edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['direct/policy_info/remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="policyInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" prop="id" width="70" />
      <el-table-column label="出发地" prop="deptCity" width="100" />
      <el-table-column label="目的地" prop="arrCity" width="100" />
      <el-table-column label="航司" prop="airline" width="80" />
      <el-table-column label="产品类型" prop="productType" width="150" />
      <el-table-column label="行程类型" prop="tripType" width="150" />
      <el-table-column label="去程旅行日期" prop="outboundDateRange" width="150" />
      <el-table-column label="回程旅行日期" prop="inboundDateRange" width="150" />
      <el-table-column label="是否中转" prop="permitTransit" width="150" />
      <el-table-column label="是否联运" prop="permitInterline" width="150" />
      <el-table-column label="是否共享" prop="permitCodeShare" width="150" />
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="changeStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['direct/policy_info/edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['direct/policy_info/remove']"
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

        <el-card >
          <div slot="header" >
            <span>航程信息</span>
          </div>
          <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订位GDS系统" prop="bookGdsChannel" label-width="150px">
              <el-input v-model="form.bookGdsChannel" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订位office号" prop="bookOfficeNo" label-width="150px">
              <el-input v-model="form.bookOfficeNo" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="航司" prop="airline" label-width="150px">
              <el-input v-model="form.airline" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行程类型" prop="tripType">
              <el-select
                v-model="form.tripType"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in sibeTripTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
        <el-form-item label="出发地" prop="deptCity" label-width="150px">
          <el-input v-model="form.depCity" placeholder="请输入大写字母" width="100px" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="目的地" prop="arrCity" label-width="150px">
          <el-input v-model="form.arrCity" placeholder="请输入大写字母" width="100px" />
        </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="出发地除外" prop="depCityExcept" label-width="150px">
              <el-input v-model="form.depCityExcept" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的地除外" prop="arrCityExcept" label-width="150px">
              <el-input v-model="form.arrCityExcept" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="适用舱位等级" prop="seatGrade" label-width="150px">
              <el-input v-model="form.seatGrade" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手工舱位(K位)" prop="manualSeatCabin" label-width="150px">
              <el-input v-model="form.manualSeatCabin" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="适用舱位" prop="seatCabin" label-width="150px">
              <el-input v-model="form.seatCabin" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用舱位除外" prop="seatCabinExcept" label-width="150px">
              <el-input v-model="form.seatCabinExcept" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="可售航班" prop="availableFlight" label-width="150px">
              <el-input v-model="form.availableFlight" placeholder="请输入数字" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="禁售航班" prop="prohibitedFlight" label-width="150px">
              <el-input v-model="form.prohibitedFlight" placeholder="请输入数字" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="是否中转" prop="permitTransit">
              <el-select
                v-model="form.permitTransit"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in directPolicyPermitOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="指定转机点" prop="transferPoint" label-width="150px">
              <el-input v-model="form.transferPoint" placeholder="请输入机场码" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="是否共享航司" prop="permitCodeShare">
              <el-select
                v-model="form.permitCodeShare"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in directPolicyPermitOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="共享航司" prop="codeShareAirline" label-width="150px">
              <el-input v-model="form.codeShareAirline" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="共享航司除外" prop="codeShareAirlineExcept" label-width="150px">
              <el-input v-model="form.codeShareAirlineExcept" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="是否混合航司" prop="permitInterline">
              <el-select
                v-model="form.permitInterline"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in directPolicyPermitOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="混合航司" prop="interlineAirline" label-width="150px">
              <el-input v-model="form.interlineAirline" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="混合航司除外" prop="interlineAirlineExcept" label-width="150px">
              <el-input v-model="form.interlineAirlineExcept" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>
       </div>
      </el-card>


        <el-card >
          <div slot="header" >
            <span>日期信息</span>
          </div>
          <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="去程旅行日期" prop="depCityExcept" label-width="150px">
              <el-input v-model="form.depCityExcept" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回程旅行日期" prop="arrCityExcept" label-width="150px">
              <el-input v-model="form.arrCityExcept" placeholder="请输入大写字母" width="100px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="销售开始日期" prop="saleDateStart" label-width="150px">
              <el-input v-model="form.saleDateStart" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售结束日期" prop="saleDateEnd" label-width="150px">
              <el-input v-model="form.saleDateEnd" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="去程旅行日期除外" prop="outboundTravelDateExcept" label-width="150px">
              <el-input v-model="form.outboundTravelDateExcept" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回程旅行日期除外" prop="inboundTravelDateExcept" label-width="150px">
              <el-input v-model="form.inboundTravelDateExcept" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="去程班期" prop="outboundDayTime" label-width="150px">
              <el-input v-model="form.outboundDayTime" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回程班期" prop="inboundDayTime" label-width="150px">
              <el-input v-model="form.inboundDayTime" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="最小停留时间(分)" prop="minStay" label-width="150px">
              <el-input v-model="form.retMinTime" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大停留时间(分)" prop="maxStay" label-width="150px">
              <el-input v-model="form.retMaxTime" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="提前销售天数" prop="advanceSaleDay" label-width="150px">
              <el-input v-model="form.advanceSaleDay" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>
          </div>
        </el-card>


        <el-card >
          <div slot="header" >
            <span>运价信息</span>
          </div>
          <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品类型" prop="productType">
              <el-select
                v-model="form.productType"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in sibeProductTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运价类型" prop="priceType">
              <el-select
                v-model="form.priceType"
                placeholder="请选择下拉选择"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in sibePriceTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="成人票面价(K位)" prop="manualAdultPrice" label-width="150px">
              <el-input v-model="form.manualAdultPrice" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成人税费(K位)" prop="manualAdultTax" label-width="150px">
              <el-input v-model="form.manualAdultTax" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="成人票面留钱(普通)" prop="adultPrice" label-width="150px">
              <el-input v-model="form.adultPrice" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成人税费留钱(普通)" prop="adultTax" label-width="150px">
              <el-input v-model="form.adultTax" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="返点%(普通)" prop="commition" label-width="150px">
              <el-input v-model="form.commition" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="儿童票销售定价" prop="childPriceType" label-width="150px">
              <el-input v-model="form.childPriceType" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="儿童折扣%" prop="childDiscount" label-width="150px">
              <el-input v-model="form.childDiscount" placeholder="按百分比计算,只允许75%~99%" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="报销发票类型" prop="invoiceType" label-width="150px">
              <el-input v-model="form.invoiceType" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出票时限" prop="ticketDeadline" label-width="150px">
              <el-input v-model="form.ticketDeadline" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="适用乘客国籍" prop="nationality" label-width="150px">
              <el-input v-model="form.nationality" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="除外乘客国籍" prop="excludeNationality" label-width="150px">
              <el-input v-model="form.excludeNationality" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>
          </div>
        </el-card>

        <el-card >
          <div slot="header" >
            <span>行李额信息</span>
          </div>
          <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="行李额来源" prop="baggageType" label-width="150px">
              <el-input v-model="form.baggageType" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="成人行李额件数" prop="adultBaggagePieces" label-width="150px">
              <el-input v-model="form.adultBaggagePieces" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成人行李额重量" prop="adultBaggageWeight" label-width="150px">
              <el-input v-model="form.adultBaggageWeight" placeholder="请输入数字" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="儿童行李额件数" prop="childBaggagePieces" label-width="150px">
              <el-input v-model="form.childBaggagePieces" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="儿童行李额重量" prop="childBaggageWeight" label-width="150px">
              <el-input v-model="form.childBaggageWeight" placeholder="请输入大写字母" width="300px" />
            </el-form-item>
          </el-col>
        </el-row>
          </div>
        </el-card>

        <el-row>
          <el-col :span="12">
            <el-form-item label="规则特别说明" prop="ticketRuleNotes" label-width="150px">
              <el-input v-model="form.ticketRuleNotes" type="textarea" placeholder="请输入内容"
                        width="300px" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>


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
  import { listPolicyInfo, getPolicyInfo, delPolicyInfo, addPolicyInfo, updatePolicyInfo, changePolicyInfoStatus } from "@/api/direct/policy/policyInfo";

  export default {
    name: "PolicyInfo",
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
        // OtaSite表格数据
        policyInfoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        directPolicyPermitOptions: [],
        sibeTripTypeOptions: [],
        sibePriceTypeOptions: [],
        sibeProductTypeOptions: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          depCity: undefined,
          arrCity: undefined,
          productType: undefined,
          tripType: undefined,
          airline: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          // bothWaysFlag: [
          //   { required: true, message: "双向标识不能为空", trigger: "blur" }
          // ],
          // searchOfficeNo: [
          //   { required: true, message: "search配置号不能为空", trigger: "blur" }
          // ],
          // verifyOfficeNo: [
          //   { required: true, message: "verify配置号不能为空", trigger: "blur" }
          // ],
          // orderOfficeNo: [
          //   { required: true, message: "order配置号不能为空", trigger: "blur" }
          // ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("direct_policy_permit").then(response => {
        this.directPolicyPermitOptions = response.data;
      });
      this.getDicts("sibe_trip_type").then(response => {
        this.sibeTripTypeOptions = response.data;
      });
      this.getDicts("sibe_price_type").then(response => {
        this.sibePriceTypeOptions = response.data;
      });
      this.getDicts("sibe_product_type").then(response => {
        this.sibeProductTypeOptions = response.data;
      });
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listPolicyInfo(this.addDateRange(this.queryParams, this.dateRange)).then(
          responseData => {
            const response = responseData.data;
            this.policyInfoList = response.records;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      // 状态修改
      changeStatus(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.gdsCode + '"编码吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changePolicyInfoStatus(row.id, row.status);
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
          bookOfficeNo: undefined,
          bookGdsChannel: undefined,
          productType: undefined,
          tripType: "3",
          airline: undefined,
          depCity: undefined,
          arrCity: undefined,
          depCityExcept: undefined,
          arrCityExcept: undefined,
          interlineAirline: undefined,
          interlineAirlineExcept: undefined,
          permitTransit: "3",
          transferPoint: undefined,
          permitCodeShare: "3",
          permitInterline: "3",
          invoiceType: undefined,
          outboundDateStart: undefined,
          outboundDateEnd: undefined,
          inboundDateStart: undefined,
          inboundDateEnd: undefined,
          saleDateStart: undefined,
          saleDateEnd: undefined,
          outboundDayTime: undefined,
          inboundDayTime: undefined,
          outboundTravelDateExcept: undefined,
          inboundTravelDateExcept: undefined,
          seatGrade: undefined,
          seatCabin: undefined,
          seatCabinExcept: undefined,
          commition: undefined,
          adultPrice: undefined,
          adultTax: undefined,
          childPriceType: undefined,
          childDiscount: undefined,
          ticketRemark: undefined,
          ticketDeadline: undefined,
          nationality: undefined,
          excludeNationality: undefined,
          priceType: "3",
          productType: "1",
          ticketRuleNotes: undefined,
          remark: undefined,
          baggageType: undefined,
          manualAdultPrice: undefined,
          manualAdultTax: undefined,
          prohibitedFlight: undefined,
          availableFlight: undefined,
          advanceSaleDay: undefined,
          manualSeatCabin: undefined,
          codeShareAirline: undefined,
          codeShareAirlineExcept: undefined,
          retMaxTime: undefined,
          retMinTime: undefined,
          adultBaggagePieces: undefined,
          adultBaggageWeight: undefined,
          childBaggagePieces: undefined,
          childBaggageWeight: undefined,
          status: "0"
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
        this.title = "添加明细政策";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getPolicyInfo(id).then(response => {
          this.form = response.data;
          this.form.permitTransit = this.form.permitTransit.toString();
          this.form.permitCodeShare = this.form.permitCodeShare.toString();
          this.form.tripType = this.form.tripType.toString();
          this.form.permitInterline = this.form.permitInterline.toString();
          this.form.priceType = this.form.priceType.toString();
          this.form.productType = this.form.productType.toString();
          this.open = true;
          this.title = "修改明细政策";
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
              updatePolicyInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addPolicyInfo(this.form).then(response => {
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
          return delPolicyInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
    }
  };
</script>
