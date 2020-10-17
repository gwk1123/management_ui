<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">

      <el-form-item label="行程类型" prop="tripType">
        <el-select
          v-model="queryParams.tripType"
          placeholder="请选择行程类型"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in sibeTripTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="出发地" prop="fromCity">
        <el-input
          v-model="queryParams.fromCity"
          placeholder="请输入出发地"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>

      <el-form-item label="目的地" prop="toCity">
        <el-input
          v-model="queryParams.toCity"
          placeholder="请输入目的地"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="出发日期" prop="fromDate">
          <el-date-picker v-model="queryParams.fromDate" format="yyyyMMdd" value-format="yyyyMMdd"
             :style="{width: '70%'}" placeholder="请选择日期选择" clearable></el-date-picker>
      </el-form-item>

      <el-form-item v-show ="this.queryParams.tripType =='2' ">
        <el-form-item label="回程日期" prop="retDate" >
          <el-date-picker v-model="queryParams.retDate" format="yyyyMMdd" value-format="yyyyMMdd"
                          :style="{width: '70%'}" placeholder="请选择日期选择" clearable></el-date-picker>
        </el-form-item>
      </el-form-item>

      <el-form-item label="站点" prop="otaSites">
        <el-input
          v-model="queryParams.otaSites"
          placeholder="请输入站点"
          clearable
          size="small"
          style="width: 150px"
        />
      </el-form-item>



      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="gdsSearchList" border style="width:100%"
              :header-cell-style="{'text-align':'center'}" :cell-style="set_cell_style">
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column label="航段信息" prop="segmentInfo" width="450" >
        <template slot-scope="scope">
          <p v-html='scope.row.segmentInfo'></p>
        </template>
      </el-table-column>
      <el-table-column
        v-for="col in cols"
        :prop="col.prop" :label="col.label" >
        <template slot-scope="scope">
          <p v-html='scope.row[col.prop]'></p>
        </template>
      </el-table-column>

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
        sibeTripTypeOptions: [],
        cols: [],
        // 弹出层标题
        open: false,
        // 查询参数
        queryParams: {
          tripType: "1",
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
      this.getDicts("sibe_trip_type").then(response => {
        this.sibeTripTypeOptions = response.data;
      });
      if( this.queryParams.tripType ==undefined || this.queryParams.fromCity ==undefined
      || this.queryParams.toCity ==undefined || this.queryParams.fromDate ==undefined ||
        this.queryParams.otaSites ==undefined ){
        this.gdsSearchList = [];
        return ;
      }else {
        this.getList();
      }
    },
    methods: {
      set_cell_style({row, column, rowIndex, columnIndex}) {
        // console.log(row, "row")
        if (column.label === 'CT001') {
          return column.label = '携程一部';
        }
        if (column.label === 'CT002') {
          return column.label = '携程二部';
        }
      },
      /** 查询角色列表 */
      getList() {
        this.gdsSearchList = [];
        this.loading = true;
        listGdsSearch(this.queryParams).then(
          responseData => {
            const response = responseData.data;
            const list = response.localSiteSearchVoMap;
            for(const key in list){
              const item = {};
              //航段信息
              item.segmentInfo ='';

              let html = '';
               html = '<table style="font-size:5px;">' +
                '<thead>' +
                '<tr>' +
                '<th>航程类型</th>' +
                '<th>航司</th>' +
                '<th>航班号</th>' +
                '<th>出发机场</th>' +
                '<th>抵达机场</th>' +
                '<th>舱位</th>' +
                '<th>起飞时间</th>' +
                '<th>到达时间</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';

              const segment= list[key].segmentInfo;
              debugger;
              const segmentInfoList = segment.fromSegments;
              const  retSegments =segment.retSegments;
              if(retSegments.length > 0){
                segmentInfoList.push(retSegments);
              }
              let tBody ='';
              let tds = '';
              tds='<td>[flightIndicator]</td>'+
                '<td>[carrier]</td>'+
                '<td>[flightNumber]</td>'+
                '<td>[depAirport]</td>'+
                '<td>[arrAirport]</td>'+
                '<td>[cabin]</td>'+
                '<td>[depTime]</td>'+
                '<td>[arrTime]</td>';
              for(const i in segmentInfoList){
                let tr= '<tr>';
                tr = tr.concat(tds
                  .replace('[flightIndicator]',segmentInfoList[i].flightIndicator == 1?"去程":"回程")
                  .replace('[carrier]',(segmentInfoList[i].carrier) +
                  (segmentInfoList[i].operatingCarrier != undefined? "("+segmentInfoList[i].operatingCarrier+")":""))
                  .replace('[flightNumber]',(segmentInfoList[i].flightNumber) +
                  (segmentInfoList[i].operatingFlightNo != undefined? "("+segmentInfoList[i].operatingFlightNo+")":""))
                  .replace('[depAirport]',segmentInfoList[i].depAirport)
                  .replace('[arrAirport]',segmentInfoList[i].arrAirport)
                  .replace('[cabin]',segmentInfoList[i].cabin)
                  .replace('[depTime]',segmentInfoList[i].depTime)
                  .replace('[arrTime]',segmentInfoList[i].arrTime));
                tBody = tBody.concat(tr+'</tr>');
              }
              const segmentHtml = html + tBody + '</tbody></table>';
              item.segmentInfo = segmentHtml;

              //GDS信息
              const gdsDataList = list[key].gdsInfoVos;
              for(const i in gdsDataList){
                const gdsItem = gdsDataList[i];
                const gdsHtmlStr = "<div>"+
                  "<p>"+"票面价: "+gdsItem.adultPriceGds+
                  "<br/>"+"税费: "+gdsItem.adultTaxGds+
                  "<br/>"+"运价类型: "+gdsItem.adultPriceGds+
                  "<br/>"+"行李额: "+gdsItem.adultTaxGds+"</p>"+
                  "</div>";
                const gdsPcc = gdsItem.gds+"-"+gdsItem.pcc;
                item[gdsPcc] = gdsHtmlStr;
              }

              //站点信息
              const otaSiteDataList = list[key].siteInfoVos;
              for(const j in otaSiteDataList){
                const otaItem = otaSiteDataList[j];
                const otaHtmlStr = "<div>"+
                  "<p>"+"票面价: "+otaItem.adultPriceOta+
                  "<br/>"+"税费: "+otaItem.adultTaxOta+
                  "<br/>"+"明细政策: "+otaItem.policyInfoId+
                  "<br/>"+"全局政策: "+otaItem.policyGlobalId +
                  "<br/>"+"来源: "+otaItem.gds + '-'+otaItem.pcc +
                  "<br/>"+"行李额: "+otaItem.baggageInfo+"</p>"+
                  "</div>";
                const site = otaItem.site;
                item[site] = otaHtmlStr;
              }
              this.gdsSearchList.push(item);
            }

            //加载表头信息
            this.cols = [];
            const gdsInfoList = response.localGdsSearchVo;
            const gdsList = gdsInfoList.gdsSource;
            const otaSiteList = gdsInfoList.otaSite;
            const gdsOtaList = gdsList.concat(otaSiteList);
            for(const  key in gdsOtaList){
              this.cols.push({prop: gdsOtaList[key], label: gdsOtaList[key]});
            }
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
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
      }
    }
  };
</script>
