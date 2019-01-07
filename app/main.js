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
            type:true,
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
                hasNext:true,
                dataSource:[]
            })
        }).then(function(){
            _this._onload();
        })
    }

    _onload(){
        const {index,type} = this.state
        if(type){
            this.getTodo(index)
        }else{
            this.getMeeting(index)
        }
    }

    getTodo(index){
        if(!this.state.hasNext){
            return ;
        }
        else{
            MyFetch.get(
                '/snaker/task/app',
                {page:index,pageSize:5},
                res => {
                    console.log(res)
                    let arr=[]
                    for(let i=0;i<res.data.result.length;i++){
                        let item = {}
                        item.key = res.data.result[i].taskVariableMap.id+'';
                        item.title = res.data.result[i].processName;
                        item.taskName = res.data.result[i].taskName;
                        item.creator = res.data.result[i].creator;
                        item.day = res.data.result[i].taskCreateTime.substring(8,10);
                        item.month = res.data.result[i].taskCreateTime.substring(5,7);
                        item.year = res.data.result[i].taskCreateTime.substring(0,4)
                        arr.push(item)

                    }
                    this.setState({
                        dataSource:this.state.dataSource.concat(arr),
                        loaded:false,
                        index:index+1,
                        hasNext:res.data.hasNext
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
        
    }

    getMeeting(index){
        if(!this.state.hasNext){
            return ;
        }
        else{
            MyFetch.get(
                '/notice/appnoticeList',
                {page:index,pageSize:5},
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
                        arr.push(item)

                    }
                    this.setState({
                        dataSource:this.state.dataSource.concat(arr),
                        loaded:false,
                        hasNext:(index*5>res.data.total?false:true)
                    })
                },
                err => {
                Alert.alert('登录发生错误：', err.message, [
                    { text: '确定' }
                ])
                }
            )
            }
        
    }

    goTodo(id,type){
        const { navigate } = this.props.navigation; 
        navigate("Todo",{id:id,type:type})
    }

    goMeet(id){
        const { navigate } = this.props.navigation; 
        navigate("Meet",{id:id})
    }

    renderRow(item,index){
        if(this.state.type){
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
        }else {
         return <TouchableOpacity style={styles.item} onPress={()=>this.goMeet(item.key)}>
            <View style={styles.item1First}>
                <Text style={{textAlign:"center",fontSize:16}}>{item.title}</Text>
                <Text style={{textAlign:"center",marginTop:11,fontSize:12,color:"#9EA0B1"}}>{item.place}</Text>
            </View>
            <View style={[styles.item2First,{}]}>
                <Text style={{textAlign:"center",color:"#9EA0B1",fontSize:8}}>{item.day}</Text>
            </View>
            <View style={styles.item3First}>
                <Text style={{textAlign:"center",color:"#9EA0B1",fontSize:14}}>{item.start}</Text>
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
                    type:false
                })

                this.refreshing(false)
                Animated.timing(                  // 随时间变化而执行动画
                    this.state.Current,            // 动画中的变量值
                    {
                    toValue: 118,                   // 透明度最终变为1，即完全不透明
                    duration: 500,              // 让动画持续一段时间
                    }
                ).start();
            }else if(type == '0'){
                this.setState({
                    type:true
                })

                this.refreshing(true)
                Animated.timing(                  // 随时间变化而执行动画
                    this.state.Current,            // 动画中的变量值
                    {
                    toValue: 0,                   // 透明度最终变为1，即完全不透明
                    duration: 500,              // 让动画持续一段时间
                    }
                ).start();
            }
        }
        
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
                        onEndReached={this._onload.bind(this)
                        }
                        onEndReachedThreshold={0}
                        style={[styles.list,{height:height*0.7,width:width/375*355}]}
                        />
                    </View>
                    <ImageBackground source={require('./image/bottomButton.png')} style={styles.bottomButton}>
                        <Animated.Image source={require('./image/bottomButtonCurrent.png')}  resizeMode='contain' style={[styles.bottomButtonCurrent,{left:this.state.Current}]} /> 
                        <TouchableWithoutFeedback onPress={() => {this.select(0)}}><View style={styles.bottomButtonItem}><Image source={require('./image/mainButton1.png')} style={styles.mainButtonImg}  resizeMode='contain'/><Text style={styles.mainButtonText}>待办事项</Text></View></TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {this.select(1)}}><View style={styles.bottomButtonItem}><Image source={require('./image/mainButton2.png')} style={styles.mainButtonImg}  resizeMode='contain'/><Text style={styles.mainButtonText}>会议通知</Text></View></TouchableWithoutFeedback>
                    </ImageBackground>
                </ImageBackground>
            </View>
        );
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
    },
    item3First:{

    },
    bottomButton:{
        height:72,width:236,borderRadius:24,marginTop:48,borderWidth:0,flexWrap:'nowrap',flexDirection:'row'
    },
    bottomButtonItem:{
        height:48,width:118,flexDirection:'row',alignItems:'center',justifyContent:'center',
    },
    mainButtonText:{
        color:'#fff',fontSize:16
    },
    mainButtonImg:{
        width:13,height:13
    },
    bottomButtonCurrent:{
        position:'absolute',
        height:48,width:118,
    }
});


