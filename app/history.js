import React, {Component} from 'react';
import { StyleSheet,NativeModules,ScrollView,Alert, TouchableOpacity, Platform,ImageBackground,Dimensions, TextInput, StatusBar,Text, View, Image} from 'react-native';
import storage from './work/gStorage';
import MyFetch from './work/myFetch';
import Myheader from './components/Myheader'

var {height,width} =  Dimensions.get('window');

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

export default class Historys extends Component {

    constructor(props){
        super(props)
        this.state={
            title:'xxx申请',
            id:'',
            personid:'',
            personname:'请选择',
            type:'',
            done:false,
            confirmText:'',
            confirmTextHeight:14,
            data:{
                startday:'',
                endday:''
            }
        }
    }
    componentWillMount(){
        const {id,type,done} = this.props.navigation.state.params
        let _this = this
        _this.setState({
            type:type,
            id:id,
            done:done
        })
        if(type == '请假申请'){
            _this.type1(id)
            _this.setState({
                title:'请假申请'
            })
        }else if(type == '销假申请'){
            _this.type2(id)
            _this.setState({
                title:'销假申请'
            })
        }else if(type == '出差申请'){
            _this.type3(id)
            _this.setState({
                title:'出差申请'
            })
        }else if(type == '报销申请'){
            _this.type4(id)
            _this.setState({
                title:'报销申请'
            })
        }
        
    }
    componentWillUnmount() {

    }


    type1(id){
        MyFetch.get(
            '/leave/appview/'+id,
            {},
            res => {
                console.log(res)
                this.setState({
                    data:res.data.model.data
                })
            },
            err => {
            Alert.alert('登录发生错误：', err.message, [
                { text: '确定' }
            ])
            }
        )
    }
    type2(id){
            MyFetch.get(
                '/end/appview/'+id,
                {id:id},
                res => {
                    console.log(res)
                    this.setState({
                        data:res.data.model.data
                    })
                },
                err => {
                Alert.alert('登录发生错误：', err.message, [
                    { text: '确定' }
                ])
                }
            )
    }
    type3(id){
            MyFetch.get(
                '/travel/appview/'+id,
                {},
                res => {
                    console.log(res)
                    this.setState({
                        data:res.data.model.data
                    })
                },
                err => {
                Alert.alert('登录发生错误：', err.message, [
                    { text: '确定' }
                ])
                }
            )
    }
    type4(id){
            MyFetch.get(
                '/end/appview/'+id,
                {},
                res => {
                    console.log(res)
                    this.setState({
                        data:res.data.model.data
                    })
                },
                err => {
                Alert.alert('登录发生错误：', err.message, [
                    { text: '确定' }
                ])
                }
            )
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
            <ScrollView style={styles.root} ref = {scrollView => this.scrollView = scrollView}>
                <View style={styles.rootView}>
                    <StatusBar hidden={false}></StatusBar>
                    <ImageBackground source={require('./image/loginBackground.png')} style={[styles.backgroundImage,{}]}>
                        <Myheader leftBtn="back" navigation={this.props.navigation} title={this.state.title}></Myheader>
                        {this.from()}
                        {this.main()}
                        {this.money()}
                        {this.confirm()}
                    </ImageBackground>
                </View>
            </ScrollView>
        );
    }

    from(){
        const {data} = this.state
        return <View style={styles.form}>
                    <View>
                        <Text style={{textAlign:"left",fontSize:16}}>{this.state.type}</Text>
                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>发起人:{data.creator}</Text>
                    </View>
                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>{data.user_dept_name}</Text>
                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>{data.user_dept_name2}</Text>
                    </View>
            </View>
    }

    main(){
        const {data} = this.state
        if(this.state.type=='请假申请'){
            return <View style={styles.main}>
                    <View style={styles.mainTime}>
                        <View>
                            <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>{data.startday.substring(0,4)}</Text>
                            <Text style={{textAlign:"center",fontSize:17,marginTop:10,marginBottom:18}}>{data.startday.substring(5,10)}</Text>
                            <Text style={{textAlign:"center",fontSize:10}}>{data.startday.substring(11,16)} <Text style={[data.start_morning=="1"?{color:'#4D88DF'}:{color:'#E15749'}]}>{data.start_morning=="1"?"AM":"PM"}</Text></Text>
                        </View>
                        <View>
                            <Text style={{textAlign:"center",fontSize:17}}>~</Text>
                        </View>
                        <View>
                            <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>{data.endday.substring(0,4)}</Text>
                            <Text style={{textAlign:"center",fontSize:17,marginTop:10,marginBottom:18}}>{data.endday.substring(5,10)}</Text>
                            <Text style={{textAlign:"center",fontSize:10}}>{data.endday.substring(11,16)}<Text style={[data.end_morning=="1"?{color:'#4D88DF'}:{color:'#E15749'}]}>{data.end_morning=="1"?"AM":"PM"}</Text></Text>
                        </View>
                    </View>
                    <View style={{width:width/375*200,paddingBottom:width/375*17,borderBottomColor:'#C7C7C7',borderBottomWidth:1,borderStyle:'dotted'}}>
                        <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>请假天数&nbsp;{data.leave_date}天</Text>
                        <Text style={{textAlign:"center",fontSize:10,color:'#9EA0B1'}}>请假事项&nbsp;{data.matter}</Text>
                    </View>
                    <View style={{width:width/375*216}}>
                        <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.reason}</Text>
                    </View>
            </View>
        } else if(this.state.type=='出差申请'){
            return <View style={styles.main}>
                    <View style={styles.mainTime}>
                        <View>
                            <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>{data.startday.substring(0,4)}</Text>
                            <Text style={{textAlign:"center",fontSize:17,marginTop:10,marginBottom:18}}>{data.startday.substring(5,10)}</Text>
                            <Text style={{textAlign:"center",fontSize:10}}>{data.startday.substring(11,16)}<Text style={[data.start_morning=="1"?{color:'#4D88DF'}:{color:'#E15749'}]}>{data.start_morning=="1"?"AM":"PM"}</Text></Text>
                        </View>
                        <View>
                            <Text style={{textAlign:"center",fontSize:17}}>~</Text>
                        </View>
                        <View>
                            <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>{data.endday.substring(0,4)}</Text>
                            <Text style={{textAlign:"center",fontSize:17,marginTop:10,marginBottom:18}}>{data.endday.substring(5,10)}</Text>
                            <Text style={{textAlign:"center",fontSize:10}}>{data.endday.substring(11,16)}<Text style={[data.end_morning=="1"?{color:'#4D88DF'}:{color:'#E15749'}]}>{data.end_morning=="1"?"AM":"PM"}</Text></Text>
                        </View>
                    </View>
                    <View style={{width:width/375*200,paddingBottom:width/375*17,borderBottomColor:'#C7C7C7',borderBottomWidth:1,borderStyle:'dotted'}}>
                        <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>出差天数&nbsp;{data.travel_date}天</Text>
                        <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>出差地点&nbsp;{data.travel_place}</Text>
                        <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>出差人数&nbsp;{data.travel_person}人</Text>
                        <Text style={{textAlign:"center",fontSize:14,color:'#000'}}>{data.traveler_name}</Text>
                        
                    </View>
                    <View style={{width:width/375*216}}>
                        <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.reason}</Text>
                    </View>
            </View>
        } else if(this.state.type=='销假申请'){
            return <View style={styles.main}>
            <View style={styles.mainTime}>
                <View>
                    <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>{data.startday.substring(0,4)}</Text>
                    <Text style={{textAlign:"center",fontSize:17,marginTop:10,marginBottom:18}}>{data.startday.substring(5,10)}</Text>
                    <Text style={{textAlign:"center",fontSize:10}}>{data.startday.substring(11,16)} <Text style={[data.start_morning=="1"?{color:'#4D88DF'}:{color:'#E15749'}]}>{data.start_morning=="1"?"AM":"PM"}</Text></Text>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:17}}>~</Text>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>{data.endday.substring(0,4)}</Text>
                    <Text style={{textAlign:"center",fontSize:17,marginTop:10,marginBottom:18}}>{data.endday.substring(5,10)}</Text>
                    <Text style={{textAlign:"center",fontSize:10}}>{data.endday.substring(11,16)}<Text style={[data.end_morning=="1"?{color:'#4D88DF'}:{color:'#E15749'}]}>{data.end_morning=="1"?"AM":"PM"}</Text></Text>
                </View>
            </View>
            <View style={{width:width/375*200,paddingBottom:width/375*17,borderBottomColor:'#C7C7C7',borderBottomWidth:1,borderStyle:'dotted'}}>
                <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>请假天数&nbsp;{data.leave_date}天</Text>
                <Text style={{textAlign:"center",fontSize:10,color:'#9EA0B1'}}>请假事项&nbsp;{data.matter}</Text>
            </View>
            <View style={{width:width/375*216}}>
                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.reason}</Text>
            </View>
            <View>
                <Text style={{color:'#E46B60',textAlign:'center',fontSize:12,marginBottom:18}}>创建时间:{data.created}</Text>
            </View>
            <ImageBackground  source={require('./image/timeBackground.png')} style={{width:'100%',height:30,flexDirection:'row',flexWrap:'nowrap',justifyContent:'space-between',alignItems:'center',marginBottom:21}}>
                <Text style={{marginLeft:33,color:"#fff"}}>销假</Text>
                <Text style={{color:"#fff"}}>{data.endleave?data.endleave.substring(0,10):''}</Text>
                <Text style={{marginRight:33,color:"#fff"}}>{data.endleave_morning=="1"?"AM":"PM"}</Text>
            </ImageBackground>
            <View style={{marginBottom:26}}>
                <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>销假天数&nbsp;{data.endleave_date}天</Text>
            </View>
    </View>
    } else if(this.state.type=='报销申请'){
            return <View style={styles.main}>
            <View style={styles.mainTime}>
                <View>
                    <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>{data.startday.substring(0,4)}</Text>
                    <Text style={{textAlign:"center",fontSize:17,marginTop:10,marginBottom:18}}>{data.startday.substring(5,10)}</Text>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:17}}>~</Text>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>{data.endday.substring(0,4)}</Text>
                    <Text style={{textAlign:"center",fontSize:17,marginTop:10,marginBottom:18}}>{data.endday.substring(5,10)}</Text>
                </View>
            </View>
            <View style={{width:width/375*200,paddingBottom:width/375*17,borderBottomColor:'#C7C7C7',borderBottomWidth:1,borderStyle:'dotted'}}>
                        <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>出差天数&nbsp;{data.travel_date}天</Text>
                        <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>出差地点&nbsp;{data.travel_place}</Text>
                        <Text style={{textAlign:"center",fontSize:10,marginBottom:10,color:'#9EA0B1'}}>出差人数&nbsp;{data.travel_person}人</Text>
                        <Text style={{textAlign:"center",fontSize:14,color:'#000'}}>{data.traveler_name}</Text>
            </View>
            <View style={{width:width/375*216}}>
                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.travel_reason}</Text>
            </View>
            <ImageBackground  source={require('./image/timeBackground.png')} style={{width:'100%',height:30,flexDirection:'row',flexWrap:'nowrap',justifyContent:'space-around',alignItems:'center',marginBottom:21}}>
                <Text style={{color:"#fff"}}>出行方式</Text>
                <Text style={{color:"#fff"}}>{data.travel_type}</Text>
            </ImageBackground>
            <View style={styles.mainTime}>
                <View>
                    <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>起点</Text>
                    <Text style={{textAlign:"center",fontSize:17,marginTop:0,marginBottom:18}}>{data.startplace}</Text>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:17}}>~</Text>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:8,marginTop:10}}>终点</Text>
                    <Text style={{textAlign:"center",fontSize:17,marginTop:0,marginBottom:18}}>{data.endplace}</Text>
                </View>
            </View>
            <View style={{marginBottom:26,flexDirection:'row',alignItems:'center',marginBottom:10,justifyContent:'space-around'}}>
                <View style={{height:1,width:10,backgroundColor:'#9EA0B1'}}></View>
                <Text style={{textAlign:"center",fontSize:13,color:'#9EA0B1',marginLeft:20,marginRight:20}}>{data.distance}KM</Text>
                <View style={{height:1,width:10,backgroundColor:'#9EA0B1'}}></View>
            </View>
    </View>
        }
    }

    money(){
        const {data} = this.state
        if(this.state.type=="报销申请"){
            return  <View>
                        {data.personal_standard?
                        <View style={[styles.main]}>
                            <View style={[styles.money,{}]}>
                                    <View>
                                        <Text style={{textAlign:"left",fontSize:16}}>自行解决区间交通费</Text>
                                    </View>
                                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>标准：{data.personal_standard}</Text>
                                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>单据张数：{data.personal_page}</Text>
                                    </View>
                            </View>
                            <View>
                                <Text style={{fontSize:19,marginBottom:27,color:'#575A70',fontWeight:"600"}}>￥ {data.personal_money}</Text>
                            </View>
                            <View style={[styles.mainTime,{justifyContent:'center',marginTop:0}]}>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.personal_startday?data.personal_startday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.personal_startplace}</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.personal_endday?data.personal_endday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.personal_endplace}</Text>
                                </View>
                            </View>
                            <View style={{width:width/375*216,borderTopColor:'#C7C7C7',borderTopWidth:1,borderStyle:'dotted'}}>
                                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.personal_note}</Text>
                            </View>
                        </View>:<View></View>}
                        {data.traffic_standard?
                        <View style={[styles.main]}>
                            <View style={[styles.money,{}]}>
                                    <View>
                                        <Text style={{textAlign:"left",fontSize:16}}>区间交通费</Text>
                                    </View>
                                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>标准：{data.traffic_standard}</Text>
                                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>单据张数：{data.traffic_page}</Text>
                                    </View>
                            </View>
                            <View>
                                <Text style={{fontSize:19,marginBottom:27,color:'#575A70',fontWeight:"600"}}>￥ {data.traffic_money}</Text>
                            </View>
                            <View style={[styles.mainTime,{justifyContent:'center',marginTop:0}]}>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.traffic_startday?data.traffic_startday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.traffic_startplace}</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.traffic_endday?data.traffic_endday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.traffic_endplace}</Text>
                                </View>
                            </View>
                            <View style={{width:width/375*216,borderTopColor:'#C7C7C7',borderTopWidth:1,borderStyle:'dotted'}}>
                                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.traffic_note}</Text>
                            </View>
                        </View>:<View></View>}
                        {data.public_standard?
                        <View style={[styles.main]}>
                            <View style={[styles.money,{}]}>
                                    <View>
                                        <Text style={{textAlign:"left",fontSize:16}}>公杂费</Text>
                                    </View>
                                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>标准：{data.public_standard}</Text>
                                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>单据张数：{data.public_page}</Text>
                                    </View>
                            </View>
                            <View>
                                <Text style={{fontSize:19,marginBottom:27,color:'#575A70',fontWeight:"600"}}>￥ {data.public_money}</Text>
                            </View>
                            <View style={[styles.mainTime,{justifyContent:'center',marginTop:0}]}>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.public_startday?data.public_startday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.public_startplace}</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.public_endday?data.public_endday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.public_endplace}</Text>
                                </View>
                            </View>
                            <View style={{width:width/375*216,borderTopColor:'#C7C7C7',borderTopWidth:1,borderStyle:'dotted'}}>
                                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.public_note}</Text>
                            </View>
                        </View>:<View></View>}
                        {data.hotel_standard?
                        <View style={[styles.main]}>
                            <View style={[styles.money,{}]}>
                                    <View>
                                        <Text style={{textAlign:"left",fontSize:16}}>住宿费</Text>
                                    </View>
                                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>标准：{data.hotel_standard}</Text>
                                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>单据张数：{data.hotel_page}</Text>
                                    </View>
                            </View>
                            <View>
                                <Text style={{fontSize:19,marginBottom:27,color:'#575A70',fontWeight:"600"}}>￥ {data.hotel_money}</Text>
                            </View>
                            <View style={[styles.mainTime,{justifyContent:'center',marginTop:0}]}>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.hotel_startday?data.hotel_startday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.hotel_startplace}</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.hotel_endday?data.hotel_endday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.hotel_endplace}</Text>
                                </View>
                            </View>
                            <View style={{width:width/375*216,borderTopColor:'#C7C7C7',borderTopWidth:1,borderStyle:'dotted'}}>
                                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.hotel_note}</Text>
                            </View>
                        </View>:<View></View>}
                        {data.bus_standard?
                        <View style={[styles.main]}>
                            <View style={[styles.money,{}]}>
                                    <View>
                                        <Text style={{textAlign:"left",fontSize:16}}>其他车费</Text>
                                    </View>
                                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>标准：{data.bus_standard}</Text>
                                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>单据张数：{data.bus_page}</Text>
                                    </View>
                            </View>
                            <View>
                                <Text style={{fontSize:19,marginBottom:27,color:'#575A70',fontWeight:"600"}}>￥ {data.bus_money}</Text>
                            </View>
                            <View style={[styles.mainTime,{justifyContent:'center',marginTop:0}]}>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.bus_startday?data.bus_startday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.bus_startplace}</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.bus_endday?data.bus_endday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.bus_endplace}</Text>
                                </View>
                            </View>
                            <View style={{width:width/375*216,borderTopColor:'#C7C7C7',borderTopWidth:1,borderStyle:'dotted'}}>
                                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.bus_note}</Text>
                            </View>
                        </View>:<View></View>}
                        {data.other_standard?
                        <View style={[styles.main]}>
                            <View style={[styles.money,{}]}>
                                    <View>
                                        <Text style={{textAlign:"left",fontSize:16}}>其他</Text>
                                    </View>
                                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>标准：{data.other_standard}</Text>
                                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>单据张数：{data.other_page}</Text>
                                    </View>
                            </View>
                            <View>
                                <Text style={{fontSize:19,marginBottom:27,color:'#575A70',fontWeight:"600"}}>￥ {data.other_money}</Text>
                            </View>
                            <View style={[styles.mainTime,{justifyContent:'center',marginTop:0}]}>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.other_startday?data.other_startday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.other_startplace}</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.other_endday?data.other_endday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.other_endplace}</Text>
                                </View>
                            </View>
                            <View style={{width:width/375*216,borderTopColor:'#C7C7C7',borderTopWidth:1,borderStyle:'dotted'}}>
                                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.other_note}</Text>
                            </View>
                        </View>:<View></View>}
                        {data.food_standard?
                        <View style={[styles.main]}>
                            <View style={[styles.money,{}]}>
                                    <View>
                                        <Text style={{textAlign:"left",fontSize:16}}>伙食费</Text>
                                    </View>
                                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>标准：{data.food_standard}</Text>
                                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>单据张数：{data.food_page}</Text>
                                    </View>
                            </View>
                            <View>
                                <Text style={{fontSize:19,marginBottom:27,color:'#575A70',fontWeight:"600"}}>￥ {data.food_money}</Text>
                            </View>
                            <View style={[styles.mainTime,{justifyContent:'center',marginTop:0}]}>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.food_startday?data.food_startday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.food_startplace}</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9}}>~</Text>
                                </View>
                                <View>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0}}>{data.food_endday?data.other_endday.substr(0,10):''}</Text>
                                    <Text style={{textAlign:"center",color:'#9EA0B1',fontSize:9,marginTop:0,marginBottom:0}}>{data.food_endplace}</Text>
                                </View>
                            </View>
                            <View style={{width:width/375*216,borderTopColor:'#C7C7C7',borderTopWidth:1,borderStyle:'dotted'}}>
                                <Text style={{color:'#9EA0B1',fontSize:13,marginVertical:width/375*18}}>{data.food_note}</Text>
                            </View>
                        </View>:<View></View>}
                        <View style={[styles.main,{}]}>
                            <View style={[styles.money,{marginBottom:0}]}>
                                    <View>
                                        <Text style={{textAlign:"left",fontSize:16}}>总计</Text>
                                    </View>
                                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:0,borderStyle:'dashed',paddingLeft:10}}>
                                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}></Text>
                                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}></Text>
                                    </View>
                            </View>
                            <View>
                                <Text style={{fontSize:19,marginBottom:12,color:'#575A70',fontWeight:"600",}}>￥ {data.total_money}</Text>
                            </View>
                            <View style={{width:width/375*216,marginBottom:37,paddingTop:13,borderTopColor:'#C7C7C7',borderTopWidth:1,borderStyle:'dotted'}}>
                                <Text style={{textAlign:"center",fontSize:13,color:'#9EA0B1',marginLeft:20,marginRight:20}}>单据张数 {data.subtotal_page}张</Text>
                            </View>
                        </View>
                    </View>
        }
    }

    confirm(){
        const {data} = this.state
        return <View style={styles.confirm}>
        </View>
    }

    getPersonID(){
        const {navigate} = this.props.navigation
        navigate('People', 
            {
            callback: ((personid,personname) => { //回调函数
                this.setState({
                    personid: personid,
                    personname:personname
                })
            })
        })
    }

    cauculateHeight(e) {
        const confirmTextHeight = e.nativeEvent.contentSize.height > 14 ? e.nativeEvent.contentSize.height : this.state.confirmTextHeight;
        this.setState({confirmTextHeight});
    }

    confirmBtn(text){
        const { goBack } = this.props.navigation; 
        const {type,id,confirmText,personid} = this.state;
        let typea;
        if(type == "请假"){
            typea = 'leave'
        }else if(type == "销假"){
            typea = 'end'
        }else if(type == "出差"){
            typea = 'travel'
        }else if(type == "报销"){
            typea = 'expense'
        }
        let url = '/'+typea+'/check/'+id+'?check='+text;
        console.log(url)
        MyFetch.post(
            url,
            `nextuser=${personid}&result=${confirmText}`,
            res => {
                    console.log(res)
                    Alert.alert('提示', res.message, [
                        { text: '确定' }
                      ])
                    goBack()
            },
            err => {
              Alert.alert('登录发生错误：', err.message, [
                { text: '确定' }
              ])
            }
          )
    }
}
//bolt cogs file phone address-book-o wrench

const styles = StyleSheet.create({
    root:{
    },
    rootView: {
        flex: 1,
        minHeight:1000,
        flexDirection:'column',
        flexWrap:'wrap',
        minHeight:height-STATUSBAR_HEIGHT,
        alignItems:'center',
        justifyContent:'flex-start',
    },
    backgroundImage: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      position:'relative',
      // 祛除内部元素的白色背景
      backgroundColor: 'rgba(0,0,0,0)'
    },
    form:{
        width:width/375*355,
        height:width/375*86,
        backgroundColor:"#fff",
        borderRadius:5,
        flexDirection:'row',
        flexWrap:'nowrap',
        justifyContent:'space-around',
        alignItems:'center',
        marginBottom:width/375*8
    },
    main:{
        width:width/375*355,
        backgroundColor:"#fff",
        borderRadius:5,
        flexDirection:'column',
        flexWrap:'nowrap',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom:width/375*8
    },
    money:{
        width:width/375*355,
        height:width/375*41,
        flexDirection:'row',
        flexWrap:'nowrap',
        justifyContent:'space-around',
        alignItems:'center',
        marginBottom:width/375*26,
        marginTop:width/375*11,
    },
    mainTime:{
        marginTop:width/375*15,
        width:'100%',
        marginBottom:width/375*16,
        flexDirection:'row',
        flexWrap:'nowrap',
        justifyContent:'space-around',
        alignItems:'center',
    },
    confirm:{
        width:width/375*355,
        backgroundColor:"transparent",
        borderRadius:5,
        height:width/375*255,
        flexDirection:'column',
        flexWrap:'nowrap',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom:width/375*16,
    },
    inputContainer:{
        backgroundColor:"#F7F7F7",
        width:width/375*261,
        height:width/375*101,
        marginTop:18,
        marginBottom:13

    },
    textInput:{
        width:width/375*261,paddingVertical: 12, paddingLeft: 21, paddingRight:21, fontSize: 13,
        maxHeight:width/375*101,
        color:'#707175'
    },
    selectNext:{
        width:26,marginRight:11,
        height:26,justifyContent:'center',alignItems:'center'
    },
});


