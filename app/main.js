import React, {Component} from 'react';
import { StyleSheet,Animated,FlatList,TouchableOpacity,ToastAndroid,TouchableWithoutFeedback, Platform,ImageBackground,Dimensions, BackHandler, StatusBar,Text, View, Image} from 'react-native';
import storage from './work/gStorage';
import MyFetch from './work/myFetch';
import Myheader from './components/Myheader'

var {height,width} =  Dimensions.get('window');

export default class List extends Component {

    constructor(props){
        super(props)
        this.state={
            dataSource: [],
            loaded: false,
            type:1,
            index:1, //页数
            hasNext:true,
            Current:new Animated.Value(0),
            colorArr:['#C05959','#757575','#5984C0','#68E180']
        }
    }
    componentDidMount(){

        this._onload()
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
    onBackAndroid = () => {
        
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            BackAndroid.exitApp()
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用',1000);
        return true;
        
    };
    refreshing(type){
        if(type == undefined){
            type = this.state.type
        }
        let _this = this
        this.myPromise(true).then(function(){
            _this.setState({
                loaded:true,
                index:1,
                hasNext:true
            })
        }).then(function(){
            _this._onload();
        })
    }

    _onload(){
        const {index,type} = this.state
        if(type == 1){
            this.getTodo(index)
        }else if(type == 2){
            this.getMeeting(index)
        }else if(type == 3){
            this.getHistory(index)
        }else if(type == 4){
            this.getDone(index)
        }
    }

    getTodo(index){
            MyFetch.get(
                '/snaker/task/app',
                {page:index,pageSize:99999},
                res => {
                    console.log(res)
                    let arr=[]
                    for(let i=0;i<res.data.result.length;i++){
                        let item = {}
                        item.key = res.data.result[i].taskVariableMap.id+'';
                        console.log(item.key)
                        item.title = res.data.result[i].processName;
                        item.taskName = res.data.result[i].taskName;
                        item.creator = res.data.result[i].creator;
                        item.day = res.data.result[i].taskCreateTime.substring(8,10);
                        item.month = res.data.result[i].taskCreateTime.substring(5,7);
                        item.year = res.data.result[i].taskCreateTime.substring(0,4)
                        item.type=1
                        arr.push(item)

                    }
                    this.setState({
                        dataSource:arr,
                        loaded:false,
                        index:index+1,
                    })
                    console.log(this.state.dataSource)
                },
                err => {
                Alert.alert('登录发生错误：', err.message, [
                    { text: '确定' }
                ])
                }
            )
    }

    getMeeting(index){
            MyFetch.get(
                '/notice/appnoticeList',
                {page:index,pageSize:99999},
                res => {
                    console.log(res)
                    let arr=[]
                    for(let i=0;i<res.data.rows.length;i++){
                        let item = {}
                        item.key = res.data.rows[i].id;
                        item.title = res.data.rows[i].title;
                        item.place = res.data.rows[i].place;
                        item.creator = res.data.rows[i].creator;
                        item.day = res.data.rows[i].date.substring(0,10);
                        item.start = res.data.rows[i].start;
                        item.type =2
                        arr.push(item)

                    }
                    this.setState({
                        dataSource:arr,
                        loaded:false,
                    })
                },
                err => {
                Alert.alert('登录发生错误：', err.message, [
                    { text: '确定' }
                ])
                }
            )
    }

    getHistory(index){
        MyFetch.get(
            '/leave/totalapplist',
            {page:index,pageSize:99999},
            res => {
                console.log(res)
                let arr=[]
                for(let j in res.data){
                    for(let i=0;i<res.data[j].length;i++){
                        let item = {}
                        if(j =='leave'){
                            item.key = res.data[j][i].id;
                            console.log(item.key)
                            item.title = "请假申请";
                            item.midMessage = "请假天数"+res.data[j][i].leave_date+"天";
                            item.creator = "发起人："+res.data[j][i].creator;
                            item.day = res.data[j][i].created.substring(8,10);
                            item.month = res.data[j][i].created.substring(5,7);
                            item.year = res.data[j][i].created.substring(0,4)
                            item.type = 3
                            arr.push(item)
                        }else if(j =='end'){
                            item.key = res.data[j][i].id;
                            console.log(item.key)
                            item.title = "销假申请";
                            item.creator = "发起人："+res.data[j][i].creator;
                            item.day = res.data[j][i].created.substring(8,10);
                            item.month = res.data[j][i].created.substring(5,7);
                            item.year = res.data[j][i].created.substring(0,4)
                            if(res.data[j][i].endleave_date){
                                item.midMessage = "销假天数"+res.data[j][i].endleave_date+'天';
                            }else{
                                item.midMessage = ''
                            }
                            item.type = 3
                            arr.push(item)
                        }else if(j =='expense'){
                            item.key = res.data[j][i].id;
                            console.log(item.key)
                            item.title = "报销申请";
                            item.creator = "发起人："+res.data[j][i].creator;
                            item.day = res.data[j][i].created.substring(8,10);
                            item.month = res.data[j][i].created.substring(5,7);
                            item.year = res.data[j][i].created.substring(0,4)
                            if(res.data[j][i].total_money){
                                item.midMessage = "总计金额"+res.data[j][i].total_money+"元";
                            }else{
                                item.midMessage = ''
                            }
                            item.type = 3
                            arr.push(item)
                        }else if(j =='travel'){
                            item.key = res.data[j][i].id;
                            console.log(item.key)
                            item.title = "出差申请";
                            item.creator = "发起人："+res.data[j][i].creator;
                            item.day = res.data[j][i].created.substring(8,10);
                            item.month = res.data[j][i].created.substring(5,7);
                            item.year = res.data[j][i].created.substring(0,4)
                            if(res.data[j][i].travel_place){
                                item.midMessage = "目的地"+res.data[j][i].travel_place;
                            }else{
                                item.midMessage = ''
                            }
                            item.type = 3
                            arr.push(item)
                        }else if(j =='notice'){
                            item.key = res.data[j][i].id;
                            item.title = res.data[j][i].title;
                            item.creator = "发起人："+res.data[j][i].creator;
                            item.day = res.data[j][i].created.substring(8,10);
                            item.month = res.data[j][i].created.substring(5,7);
                            item.year = res.data[j][i].created.substring(0,4)
                            if(res.data[j][i].travel_place){
                                item.midMessage = "会议地点"+res.data[j][i].place;
                            }else{
                                item.midMessage = ''
                            }
                            item.type = 3
                            arr.push(item)
                        }
    
                    }
                }
                this.setState({
                    dataSource:arr,
                    loaded:false,
                    index:index+1,
                })
            },
            err => {
            Alert.alert('登录发生错误：', err.message, [
                { text: '确定' }
            ])
            }
        )
    }

    getDone(index){
        MyFetch.get(
            '/snaker/task/ccorder',
            {page:index,pageSize:99999},
            res => {
                console.log(res)
                let arr=[]
                for(let i=0;i<res.result.length;i++){
                    let item = {}
                    item.key = res.result[i].taskVariableMap.id+'';
                    console.log(item.key)
                    item.title = res.result[i].processName+"申请";
                    item.midMessage = '当前审批'+res.data.result[i].taskName;
                    item.creator = res.result[i].creator;
                    item.day = res.result[i].taskCreateTime.substring(8,10);
                    item.month = res.result[i].taskCreateTime.substring(5,7);
                    item.year = res.result[i].taskCreateTime.substring(0,4)
                    item.type=3
                    arr.push(item)

                }
                this.setState({
                    dataSource:arr,
                    loaded:false,
                    index:index+1,
                })
                console.log(this.state.dataSource)
            },
            err => {
            Alert.alert('登录发生错误：', err.message, [
                { text: '确定' }
            ])
            }
        )
    }

    goTodo(id,type){
        const { navigate } = this.props.navigation; 
        navigate("Todo",{id:id,type:type})
    }

    goMeet(id){
        const { navigate } = this.props.navigation; 
        navigate("Meet",{id:id,confirm:true})
    }
    
    goHistory(id,type){
        const { navigate } = this.props.navigation; 
        if(type == "出差申请" || type == "请假申请" || type == "销假申请" || type == "报销申请"){
            navigate("History",{id:id,type:type})
        }else{
            navigate("Meet",{id:id,confirm:false})
        }
    }

    renderRow(item,index){
        if(item.type==1){
            return <TouchableOpacity style={styles.item} onPress={()=>this.goTodo(item.key,item.title)}>
                        <View style={styles.item1First}>
                            <Text style={{textAlign:"center",fontSize:16}}>{item.title}申请</Text>
                            <Text style={{textAlign:"center",marginTop:11,fontSize:12,color:"#9EA0B1"}}>发起人:{item.creator}</Text>
                        </View>
                        <View style={[styles.item2First,{}]}>
                            <Text style={{textAlign:"center",color:"#9EA0B1"}}>当前审批:{item.taskName}</Text>
                        </View>
                        <View style={{height:26,width:4,backgroundColor:this.state.colorArr[index%4]}}>

                        </View>
                        <View style={styles.item3First}>
                            <Text style={{textAlign:"center"}}>{item.day}日</Text>
                            <Text style={{textAlign:"center",color:"#9EA0B1"}}>{item.year}·{item.month}</Text>
                        </View>
                </TouchableOpacity>
        }else if(item.type==2){
         return <TouchableOpacity style={styles.item} onPress={()=>this.goMeet(item.key)}>
            <View style={styles.item1First}>
                <Text style={{textAlign:"center",fontSize:16}}>{item.title}</Text>
                <Text style={{textAlign:"center",marginTop:11,fontSize:12,color:"#9EA0B1"}}>会议场所：{item.place}</Text>
            </View>
            <View style={[styles.item2First,{}]}>
                <Text style={{textAlign:"center",color:"#9EA0B1",fontSize:14}}>{item.day}</Text>
            </View>
            <View style={styles.item3First}>
                <Text style={{textAlign:"center",color:"#9EA0B1",fontSize:18,fontWeight:"600"}}>{item.start}</Text>
            </View>
    </TouchableOpacity>
        }else if(item.type==3){
            return <TouchableOpacity style={styles.item} onPress={()=>this.goHistory(item.key,item.title)}>
                        <View style={styles.item1First}>
                            <Text style={{textAlign:"center",fontSize:16}}>{item.title}</Text>
                            <Text style={{textAlign:"center",marginTop:11,fontSize:12,color:"#9EA0B1"}}>{item.creator}</Text>
                        </View>
                        <View style={[styles.item2First,{}]}>
                            <Text style={{textAlign:"center",color:"#9EA0B1"}}>{item.midMessage}</Text>
                        </View>
                        <View style={{height:26,width:4,backgroundColor:this.state.colorArr[index%4]}}>

                        </View>
                        <View style={styles.item3First}>
                            <Text style={{textAlign:"center"}}>{item.day}日</Text>
                            <Text style={{textAlign:"center",color:"#9EA0B1"}}>{item.year}·{item.month}</Text>
                        </View>
                </TouchableOpacity>
        }
    }

    _footer(){
        if(!this.state.hasNext){
            return <Text style={{color:'#fff',textAlign:"center"}}>没有更多了</Text>
        }
        else if(this.state.hasNext){
            return <Text style={{color:'#fff',textAlign:"center"}}></Text>;
        }
    }

    select(type){
        if(this.state.loaded){
            return ;
        }else{
            if(type == '1'){
                this.setState({
                    type:1
                })
                this.refreshing(type)
            }else if(type == '2'){
                this.setState({
                    type:2
                })
                this.refreshing(type)
            }else if(type == '3'){
                this.setState({
                    type:3
                })
                this.refreshing(type)
            }else if(type == '4'){
                this.setState({
                    type:4
                })
                this.refreshing(type)
            }
        }
        
    }

    myPromise (flag) {
        var promise = new Promise(function (resolve, reject) {
            if (flag) {
                resolve("resolve");
            } else {
                reject("reject");
            }
        });
        return promise;
    }

    render() {
        return (
            <View style={styles.rootView}>
                <StatusBar hidden={false}></StatusBar>
                <ImageBackground source={require('./image/loginBackground.png')} style={[styles.backgroundImage,{}]}>
                    
                    <Image source={require('./image/mainBottom.png')}  resizeMode='contain' style={[styles.backgroundBottom,{height:width/375*206}]} /> 
                
                    <Myheader rightBtn="exit" navigation={this.props.navigation} title="行政事务管理系统"></Myheader>
                    <View style={[styles.list,{height:height*0.7,width:width/375*355}]}>
                        <FlatList
                        data={this.state.dataSource}
                        ListFooterComponent={this._footer.bind(this)}
                        onRefresh={this.refreshing.bind(this)}
                        refreshing={this.state.loaded}
                        initialNumToRender={5}
                        renderItem={({item,index}) => this.renderRow(item,index)}
                        style={[styles.list,{height:height*0.7,width:width/375*355}]}
                        />
                    </View>
                    {/* <ImageBackground source={require('./image/bottomButton.png')} style={styles.bottomButton}>
                        <Animated.Image source={require('./image/bottomButtonCurrent.png')}  resizeMode='contain' style={[styles.bottomButtonCurrent,{left:this.state.Current}]} /> 
                        <TouchableWithoutFeedback onPress={() => {this.select(0)}}><View style={styles.bottomButtonItem}><Image source={require('./image/mainButton1.png')} style={styles.mainButtonImg}  resizeMode='contain'/><Text style={styles.mainButtonText}>待办事项</Text></View></TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {this.select(1)}}><View style={styles.bottomButtonItem}><Image source={require('./image/mainButton2.png')} style={styles.mainButtonImg}  resizeMode='contain'/><Text style={styles.mainButtonText}>会议通知</Text></View></TouchableWithoutFeedback>
                    </ImageBackground> */}
                    <View style={styles.bottomButton}>
                    <TouchableWithoutFeedback onPress={() => {this.select(1)}}>
                            <View style={this.state.type==1?[styles.bottomButtonItem,{backgroundColor:'#73A0FF'}]:[styles.bottomButtonItem,{}]}>
                                <Image source={this.state.type==1?require('./image/mainButton1b.png'):require('./image/mainButton1.png')} style={styles.mainButtonImg}  resizeMode='contain'/>
                                <Text style={this.state.type==1?[styles.mainButtonText,{color:'#fff'}]:[styles.mainButtonText,{}]}>待办事项</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {this.select(2)}}>
                            <View style={this.state.type==2?[styles.bottomButtonItem,{backgroundColor:'#73A0FF'}]:[styles.bottomButtonItem,{}]}>
                                <Image source={this.state.type==2?require('./image/mainButton2b.png'):require('./image/mainButton2.png')} style={styles.mainButtonImg}  resizeMode='contain'/>
                                <Text style={this.state.type==2?[styles.mainButtonText,{color:'#fff'}]:[styles.mainButtonText,{}]}>会议通知</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {this.select(3)}}>
                            <View style={this.state.type==3?[styles.bottomButtonItem,{backgroundColor:'#73A0FF'}]:[styles.bottomButtonItem,{}]}>
                                <Image source={this.state.type==3?require('./image/mainButton3b.png'):require('./image/mainButton3.png')} style={styles.mainButtonImg}  resizeMode='contain'/>
                                <Text style={this.state.type==3?[styles.mainButtonText,{color:'#fff'}]:[styles.mainButtonText,{}]}>历史记录</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {this.select(4)}}>
                            <View style={this.state.type==4?[styles.bottomButtonItem,{backgroundColor:'#73A0FF'}]:[styles.bottomButtonItem,{}]}>
                                <Image source={this.state.type==4?require('./image/mainButton4b.png'):require('./image/mainButton4.png')} style={styles.mainButtonImg}  resizeMode='contain'/>
                                <Text style={this.state.type==4?[styles.mainButtonText,{color:'#fff'}]:[styles.mainButtonText,{}]}>我审批的</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

//bolt cogs file phone address-book-o wrench

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection:'column',
        flexWrap:'wrap',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    backgroundImage: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      position:'relative',
      height: null,
      // 祛除内部元素的白色背景
      backgroundColor: 'rgba(0,0,0,0)'
    },
    backgroundBottom:{
        width:'100%',
        bottom:0,
        position:'absolute',
      },
    list:{
        backgroundColor:'transparent'
    },
    item:{
        width:width/375*355,
        height:width/375*86,
        backgroundColor:"#fff",
        borderRadius:5,
        flexDirection:'row',
        flexWrap:'nowrap',
        justifyContent:'space-around',
        alignItems:'center',
        textAlign:'center',
        marginBottom:width/375*5
    },
    item1First:{
        flexDirection:'column',
        flexWrap:'wrap',
        justifyContent:'space-around',
        alignItems:'center',
        textAlign:'center',
    },
    item2First:{
        width:'40%'
    },
    item3First:{

    },
    // bottomButton:{
    //     height:72,width:236,borderRadius:24,marginTop:48,borderWidth:0,flexWrap:'nowrap',flexDirection:'row'
    // },
    // bottomButtonItem:{
    //     height:48,width:118,flexDirection:'row',alignItems:'center',justifyContent:'center',
    // },
    // mainButtonText:{
    //     color:'#fff',fontSize:16
    // },
    // mainButtonImg:{
    //     width:13,height:13
    // },
    // bottomButtonCurrent:{
    //     position:'absolute',
    //     height:48,width:118,
    // },
    bottomButton:{
        height:width/375*50,width:'100%',borderRadius:0,flexWrap:'nowrap',flexDirection:'row',position:"absolute",bottom:0,left:0,backgroundColor:'#fff'
    },
    bottomButtonItem:{
        width:'25%',height:"100%",flexDirection:'row',justifyContent:'center',alignItems:'center'
    },
    mainButtonImg:{
        width:13,height:13,marginRight:5
    },
    mainButtonText:{
        color:'#575A70',fontSize:13
    },
});


