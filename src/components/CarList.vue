<template>
    <div class='mainContainer'>
        <div class='com-box'>
            <div class='com-list'>
                <div class='curr-com'>{{currCom}}<span :class="['icon', {'icon-chevron-up':isDropDown}, {'icon-chevron-down':!isDropDown}]" @click='toggleComList()'></span></div>
                <ul class='dropdown-list' v-if='isDropDown'>
                    <li v-for='(item,index) in comList' :key='index' @click='changeCom(index)'>{{item.bname}}<span class='icon icon-remove' @click='removeCom(index)' @click.stop></span></li>
                </ul>
            </div>
            <div class='search-box'>
                <input type="text" v-model="searchText" placeholder='输入车牌号查询车辆'>
            </div>
            <div class='month-box'>
                <div class='month-show' @click='toggleMonth'>查看历史消耗</div>
                <ul class='month-list' v-if='monthShow'>
                    <li value="" v-for="(item,index) in monthList" :key='index' @mouseover="setShowData(index)" @mouseleave="hideInfo(index)">
                        {{item.addyear}}年{{item.addmonth}}月
                    </li>
                </ul>
                <div class='month-info' v-if='showInfo'>
                    <p>SIM卡添加：<span>{{addNum}}</span></p>
                    <p>SIM卡消耗：<span>{{useNum}}</span></p>
                </div>
            </div>
            <div class='sim-box'>
                <div class='add-sim'>
                    <input type="number" placeholder="添加本月SIM卡" v-model='simAdd'/>
                    <span class='show-state' @click='addSimCard()'>添加</span>
                </div>
                <div>本月SIM卡添加:<span>{{simAdded}}</span></div>
                <div class='sim-update'>本月SIM卡消耗:<input type="number" placeholder="添加本月SIM卡" v-model='simUsed' @input="changeUse()"/></div>
                <div>SIM卡总余量:<span>{{simTotalRest}}</span></div>
            </div>
            <div class='load-file'>
                <div class='load-file-btn' @click='toggleForm()'>上传Excal</div>
                <form class='edit-com-ex' v-if='formDown'>
                    <div class="form-group">
                        <label for="exampleInputEmail1">公司/户主名称（不输入默认当前户主）</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="新增，请输入公司/户主名" v-model="comName">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputFile">上传Excel文件</label>
                        <input type="file" id="exampleInputFile" ref='files' @change="loadFile()">
                    </div>  
                    <div class='btn btn-block btn-danger' @click='upLoadFiles()'>上传</div>   
                </form>
            </div>
            <div class='com-plus'>
                <span :class="['icon', {'icon-remove':listDown}, {'icon-plus':!listDown}]" @click='toggleList()'></span>
                <form class='edit-com' v-if='listDown'>
                    <div class="form-group">
                        <label for="exampleInputEmail1">公司/户主名称（不输入默认当前户主）</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="新增，请输入公司/户主名" v-model="comName">
                    </div>
                    <ul>
                        <li>车牌号<input type="text" value="" v-model="vehLoad[0][0]"></li>
                        <li>安装时间<input type="date" value="" v-model="vehLoad[0][1]"></li>
                        <li>安装人员<input type="text" value="" v-model="vehLoad[0][2]"></li>
                        <li>联系人<input type="text" value="" v-model="vehLoad[0][3]"></li>
                        <li>联系电话<input type="text" value="" v-model="vehLoad[0][4]"></li>
                        <li>期价<input type="text" value="" v-model="vehLoad[0][5]"></li>
                        <li>应缴费<input type="number" value="" v-model="vehLoad[0][6]"></li>
                        <li>缴费状态
                            <select v-model="vehLoad[0][7]">
                                <option value="1">已缴</option>
                                <option value="0">未缴</option>
                            </select>
                        </li>
                        <li>是否逾期
                            <select v-model="vehLoad[0][8]">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </li>
                    </ul>  
                    <div class='btn btn-block btn-danger' @click='upLoadFiles()'>保存</div>   
                </form>
            </div>
        </div>
        <div class='car-box'>
            <div class='group-pointer'>
                <ul>
                    <li style='width:10%'>车牌号</li>
                    <li style='width:10%'>安装时间</li>
                    <li style='width:10%'>安装人员</li>
                    <li style='width:10%'>联系人</li>
                    <li style='width:10%'>联系电话</li>
                    <li style='width:10%'>期价</li>
                    <li style='width:10%'>应缴费</li>
                    <li style='width:10%'>缴费状态</li>
                    <li style='width:10%'>是否逾期</li>
                    <li style='width:10%;min-width:80px;'>操作</li>
                </ul>
                <div class='list-item'>
                    <ul>
                        <li v-for='(item,index) in velMsg' :key='index'>
                            <span style='width:10%' class='change-spay'><input type="text" @input='changeVnum(index,item.vnum)' v-model="item.vnum"></span>
                            <span style='width:10%'>{{item.insdate}}</span>
                            <span style='width:10%'>{{item.insper}}</span>
                            <span style='width:10%'>{{item.conper}}</span>
                            <span style='width:10%'>{{item.comphone}}</span>
                            <span style='width:10%'>{{item.price}}</span>
                            <span style='width:10%' class='change-spay'>￥ <input type="text" @input='changePay(index,item.spay)' v-model="item.spay"></span>
                            <span style='width:10%' :class="['toggle-item',{'payes':item.paystate==1},{'payno':item.paystate==0}]" @click='togglePayState(index)'>{{item.paystate}}</span>
                            <span style='width:10%' :class="['toggle-item',{'lateyes':item.islate==1},{'lateno':item.islate==0}]" @click='toggleLateState(index)'>{{item.islate}}</span>
                            <span style='width:10%;min-width:80px;'>
                                <span class='icon-remove-sign remove-point' @click='removeVeh(index)'></span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class='page-tool btn-group'>
            <div><select type="text" v-model="pagesize">
                <option>10</option>
                <option>20</option>
                <option>30</option>
                </select> 条</div>
            <div class='show-num'>第 {{currPage}} 页</div>
            <div class='show-num'>共 {{totalPage}} 页</div>
            <div class='btn btn-primary' @click='prevPage()'>上一页</div>
            <div class='btn btn-info' @click='firstPage()'>首页</div>
            <div class='btn btn-warning' @click='lastPage()'>末页</div>
            <div class='btn btn-primary' @click='nextPage()'>下一页</div>
        </div>
    </div>
</template>
<script>
import XLSX from 'xlsx';
export default {
    data(){
        return {
            isDropDown:false,
            formDown:false,
            pageNum:1,
            isInit:true,
            pointEdit:false,
            searchText:'',
            comName:'',
            comList:[],
            velMsg:[],
            vehLoad:[[]],
            groupLoadData:[],
            monthList:[],
            groupId:1,
            currCom:'',
            currComIndex:0,
            currComId:0,
            startpage:0,
            pagesize:10,
            totalPage:0,
            currPage:1,
            totalDataCount:0,
            simUsed:0,
            simAdd:'',
            simAdded:0,
            simTotalRest:0,
            monthShow:false,
            showInfo:false,
            listDown:false,
            loadingIndex:0
        }
    },
    mounted(){
        this.$emit('getNum',this.pageNum);
        this.$http.post('http://lgkj.chuangkegf.com/velnote/com.php',
        {kind:'selectAll'},{emulateJSON:true}).then((res)=>{
            this.comList = res.body;
            this.changeCom(0);
        },(err)=>{
            console.log(err);
        });
        this.currSimAdd();
        this.currSimUse();
        this.totalSimRest();
    },
    watch:{
        pagesize(){
            this.pagesize = parseInt(this.pagesize);
            this.totalPage = Math.ceil(this.totalDataCount/this.pagesize);
            this.currPage = 1;
            this.startpage = 0;
            this.changePage();
        },
        searchText(){
            if(this.searchText == ''){
                this.changePage();
            }else{
                this.searchVeh(this.searchText);
            }
        }
    },
    methods:{
        //修改消耗
        changeUse(){
            var date = new Date();
            this.$http.post('http://lgkj.chuangkegf.com/velnote/simadmin.php',
            {kind:'changeuse',year:date.getFullYear(),month:date.getMonth()+1,used:this.simUsed},{emulateJSON:true}).then((res)=>{
                var data = res.body;
                if(data.code == 200){
                    this.currSimUse();
                    this.totalSimRest();
                }else if(data.code == 400){
                    this.simUsed = 0;
                }
            },(err)=>{
                console.log(err);
            }) 
        },
        setGroup(){
            var currData = []; //子数组用来存分割完的数据
            //循环需要处理的数组
            for(var i = 0; i < this.vehLoad.length; i++) {
                //将chartArr[i]添加到子数组
                currData.push(this.vehLoad[i]);
                if((i != 0 && (i + 1) % 100 == 0) || i == this.vehLoad.length - 1) {
                    //把currData加到allData里
                    this.groupLoadData.push(currData);
                    //在这里清空currData
                    currData = [];
                }
            };
        },
        removeCom(index){
            if(confirm('删除户主：'+this.comList[index].bname+'?')){
                this.$http.post('http://lgkj.chuangkegf.com/velnote/com.php',
                {kind:'delete',bid:this.comList[index].bid},{emulateJSON:true}).then((res)=>{
                    var data = res.body;
                    if(data>0){
                        this.$http.post('http://lgkj.chuangkegf.com/velnote/com.php',
                        {kind:'selectAll'},{emulateJSON:true}).then((res)=>{
                            this.comList = res.body;
                            if(this.comList.length > 0){
                                this.changeCom(0);
                            }else{
                                this.currCom = '';
                                this.velMsg = [];
                                this.isDropDown = false;
                            }
                        },(err)=>{
                            console.log(err);
                        });
                    }
                },(err)=>{
                    console.log(err);
                })  
            }
        },
        toggleList(){
            this.formDown = false;
            if(this.listDown == false){
                this.listDown = true;
            }else{
                this.listDown = false;
                this.vehLoad = [[]];
            }
        },
        setShowData(index){
            this.showInfo = true;
            this.addNum = this.monthList[index].addnum;
            this.useNum = this.monthList[index].usenum;
        },
        hideInfo(index){
            this.showInfo = false;
            this.addNum = 0;
            this.useNum = 0;
        },
        toggleMonth(){
            if(this.monthShow == false){
                this.monthShow = true;
            }else{
                this.monthShow = false;
            }
        },
        totalSimRest(){
           this.$http.post('http://lgkj.chuangkegf.com/velnote/simadmin.php',
            {kind:'totalsimrest'},{emulateJSON:true}).then((res)=>{
                var data = res.body;
                var total = 0;
                var use = 0;
                if(data.code == 200){
                    this.monthList = data.msg;
                    data.msg.map(function(item,index){
                        total += parseInt(item.addnum);
                        use += parseInt(item.usenum);
                    });
                    this.simTotalRest = total - use;
                }
            },(err)=>{
                console.log(err);
            })  
        },
        currSimAdd(){
            var date = new Date();
            this.$http.post('http://lgkj.chuangkegf.com/velnote/simadmin.php',
            {kind:'currsimadd',year:date.getFullYear(),month:date.getMonth()+1},{emulateJSON:true}).then((res)=>{
                var data = res.body;
                if(data.code == 200){
                    this.simAdded = data.count[0].addnum;
                }else if(data.code == 400){
                    this.simAdded = 0;
                }
            },(err)=>{
                console.log(err);
            }) 
        },
        currSimUse(){
            var date = new Date();
            this.$http.post('http://lgkj.chuangkegf.com/velnote/simadmin.php',
            {kind:'currsimuse',year:date.getFullYear(),month:date.getMonth()+1},{emulateJSON:true}).then((res)=>{
                var data = res.body;
                if(data.code == 200){
                    this.simUsed = data.count[0].usenum;
                }else if(data.code == 400){
                    this.simUsed = 0;
                }
            },(err)=>{
                console.log(err);
            }) 
        },
        useSimCard(num){
            var date = new Date();
            this.$http.post('http://lgkj.chuangkegf.com/velnote/simadmin.php',
            {kind:'usecard',year:date.getFullYear(),month:date.getMonth()+1,used:num},{emulateJSON:true}).then((res)=>{
                var data = res.body;
                if(data.code == 200){
                    this.currSimUse();
                    this.totalSimRest();
                }
            },(err)=>{
                console.log(err);
            }) 
        },
        toggleComList(){
            if(this.isDropDown == false){
                this.isDropDown = true;
            }else{
                this.isDropDown = false;
            }
        },
        toggleForm(){
            this.listDown = false;
            if(this.formDown == false){
                this.formDown = true;
            }else{
                this.formDown = false;
                this.vehLoad = [[]];
            }
        },
        uPByGroup(){
            console.log(this.groupLoadData[this.loadingIndex]);
            this.$http.post('http://lgkj.chuangkegf.com/velnote/upload.php',
            {
                comName:this.currCom,
                belongId:this.currComIndex,
                postdata:this.groupLoadData[this.loadingIndex],
                kind:'insertVehs'
            },{emulateJSON:true}).then((res)=>{
                console.log(res);
                if(res.body.code == 200 && this.loadingIndex == this.groupLoadData.length -1){
                    alert('导入完成');
                    if(parseInt(res.body.msg)>0){
                        this.useSimCard(res.body.msg);
                    }
                    this.$http.post('http://lgkj.chuangkegf.com/velnote/com.php',
                    {kind:'selectAll'},{emulateJSON:true}).then((res)=>{
                        this.comList = res.body;
                        this.changeCom(this.comList.length - 1);
                    },(err)=>{
                        console.log(err);
                    })
                    this.formDown = false;
                    this.comName = '';
                    this.vehLoad = [[]];
                    this.groupLoadData = [];
                    this.loadingIndex = 0;
                }else if(res.body.code == 200){
                    this.loadingIndex ++;
                    this.uPByGroup();
                }
            },(err)=>{
                console.log(err);
            }) 
        },
        upLoadFiles(){
            var that = this;
            that.setGroup();
            if(that.comName != '' && that.vehLoad[0].length == 9){
                // 新建户主
                that.$http.post('http://lgkj.chuangkegf.com/velnote/upload.php',
                {
                    comName:that.comName,
                    kind:'insertCom'
                },{emulateJSON:true}).then((res)=>{
                    if(res.body.code == 200){
                        // 搜索户主id
                        that.$http.post('http://lgkj.chuangkegf.com/velnote/upload.php',
                        {
                            comName:that.comName,
                            kind:'selectId'
                        },{emulateJSON:true}).then((res)=>{
                            if(res.body.code == 200){
                                that.currComIndex = res.body.msg[0];
                                that.currCom = that.comName;
                                that.uPByGroup();
                            }
                        },(err)=>{
                            console.log(err);
                        })
                    }
                },(err)=>{
                    console.log(err);
                })
            }else if(that.comName == '' && that.vehLoad[0].length == 9 && that.currCom != ''){
                that.uPByGroup();
            }
        },
        loadFile(){
            var that = this;
            var file = that.$refs.files.files[0];
            var name = file.name;
            var list = [];
            var vehData = [];
            var reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = function () {
                var wb = XLSX.read(reader.result, { type: "binary" });
                var sheet = wb.Sheets.Sheet1;
                for(var key in sheet){
                    if(key != '!ref' && key != '!margins'){
                    list.push(sheet[key]);
                    }
                }
                var count =0;
                var itemData = [];
                for(var i=0;i<list.length;i++){
                    itemData.push(list[i].w);
                    count++;
                    if(count >8){
                    count = 0;
                    vehData.push(itemData);
                    itemData = [];
                    }
                }
                vehData = vehData.slice(1);
                for(var i=0;i<vehData.length;i++){
                    var date = vehData[i][1];
                    if(vehData[i][7] == '已缴' || vehData[i][6] == '是' || vehData[i][6] == '已交'){
                        vehData[i][7] = 1;
                    }else if(vehData[i][7] == '未缴' || vehData[i][6] == '否' || vehData[i][6] == '未交'){
                        vehData[i][7] = 0;
                    };
                    if(vehData[i][8] == '是' || vehData[i][7] == '逾期'){
                        vehData[i][8] = 1;
                    }else if(vehData[i][8] == '否' || vehData[i][7] == '未逾期'){
                        vehData[i][8] = 0;
                    };
                    var dateArray = date.split('/');
                    vehData[i][1] = '20'+dateArray[2]+'-'+dateArray[0]+'-'+dateArray[1];
                }
                that.vehLoad = vehData;
            };
        },
        searchVeh(text){
            this.$http.post('http://lgkj.chuangkegf.com/velnote/veh.php',
            {kind:'searchVehByCom',belongid:this.currComIndex,vnum:text},{emulateJSON:true}).then((res)=>{
                var data = res.body;
                this.velMsg = data;
            },(err)=>{
                console.log(err);
            })
        },
        changeCom(index){
            this.currComId = index;
            this.startpage = 0;
            if(this.comList.length>0){
                this.$http.post('http://lgkj.chuangkegf.com/velnote/veh.php',
                {kind:'selectPages',belongid:this.comList[index].bid},{emulateJSON:true}).then((res)=>{
                    var data = res.body[0][0];
                    this.totalDataCount = data;
                    this.totalPage = Math.ceil(data/this.pagesize);
                },(err)=>{
                    console.log(err);
                })
                this.$http.post('http://lgkj.chuangkegf.com/velnote/veh.php',
                {kind:'selectByCom',belongid:this.comList[index].bid,startpage:this.startpage,pagesize:this.pagesize},{emulateJSON:true}).then((res)=>{
                    var data = res.body;
                    this.velMsg = data;
                    this.currCom = this.comList[index].bname;
                    this.isDropDown = false;
                    this.currComIndex = this.comList[index].bid;
                },(err)=>{
                    console.log(err);
                })
            }
        },
        changePage(){
           if(this.startpage>=0){
                this.$http.post('http://lgkj.chuangkegf.com/velnote/veh.php',
                {kind:'selectByCom',belongid:this.currComIndex,startpage:this.startpage,pagesize:this.pagesize},{emulateJSON:true}).then((res)=>{
                    var data = res.body;
                    this.velMsg = data;
                },(err)=>{
                    console.log(err);
                }) 
           }
        },
        togglePayState(index){
            this.velMsg[index].paystate == 0?this.velMsg[index].paystate=1:this.velMsg[index].paystate=0;
            this.updateVeh(index);
        },
        toggleLateState(index){
            this.velMsg[index].islate == 0?this.velMsg[index].islate=1:this.velMsg[index].islate=0;
            this.updateVeh(index);
        },
        changePay(index,spay){
            this.velMsg[index].spay = spay;
            this.updateVeh(index);
        },
        changeVnum(index,vnum){
            this.velMsg[index].vnum = vnum;
            this.updateVeh(index);
        },
        updateVeh(index){
            this.$http.post('http://lgkj.chuangkegf.com/velnote/veh.php',
            {
                kind:'update',
                belongid:this.currComIndex,
                spay:this.velMsg[index].spay,
                paystate:this.velMsg[index].paystate,
                islate:this.velMsg[index].islate,
                vid:this.velMsg[index].vid,
                vnum:this.velMsg[index].vnum
            },{emulateJSON:true}).then((res)=>{
            },(err)=>{
                this.changePage();
            })
        },
        nextPage(){
            if(this.currPage<this.totalPage){
                this.startpage += this.pagesize;
                this.changePage();
                this.currPage++;
            }
        },
        prevPage(){
            if(this.currPage>1){
                this.startpage -= this.pagesize;
                this.changePage();
                this.currPage--;
            }
        },
        firstPage(){
            this.startpage = 0;
            this.changePage();
            this.currPage = 1;
        },
        lastPage(){
            this.startpage = this.pagesize*(this.totalPage-1);
            this.changePage();
            this.currPage = this.totalPage;
        },
        removeVeh(index){
            if(confirm('删除车辆 '+this.velMsg[index].vnum+'?')){
                this.$http.post('http://lgkj.chuangkegf.com/velnote/veh.php',
                {kind:'deleteVeh',belongid:this.currComIndex,vid:this.velMsg[index].vid},{emulateJSON:true}).then((res)=>{
                    var data = res.body;
                    this.changePage();
                },(err)=>{
                    console.log(err);
                }) 
            }
        },
        addSimCard(){
            var date = new Date();
            this.$http.post('http://lgkj.chuangkegf.com/velnote/simadmin.php',
            {kind:'addCard',addnum:this.simAdd,year:date.getFullYear(),month:date.getMonth()+1},{emulateJSON:true}).then((res)=>{
                var data = res.body;
                if(data.code == 200){
                    this.currSimAdd();
                    this.totalSimRest();
                    this.simAdd = '';
                }
            },(err)=>{
                console.log(err);
            }) 
        }
    }
}
</script>



