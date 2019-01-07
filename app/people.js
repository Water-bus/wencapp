import React, {Component} from 'react';
import { StyleSheet,Animated,FlatList,TouchableOpacity, Platform,ImageBackground,Dimensions, BackHandler, StatusBar,Text, View, Image} from 'react-native';
import storage from './work/gStorage';
import MyFetch from './work/myFetch';
import Myheader from './components/Myheader'

var {height,width} =  Dimensions.get('window');

export default class People extends Component {

    constructor(props){
        super(props)
        this.state={
            dataSource: [],
            loaded: false,
            type:true,
            Current:new Animated.Value(0),
            colorArr:['#C05959','#757575','#5984C0','#68E180']
        }
    }
    componentWillMount(){
        this.getPerson()
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
    refreshing(){
        // this.setState({
        //     loaded:true
        // })
        // this._onload()
    }

    _onload(){
        let timer =  setTimeout(()=>{
            clearTimeout(timer)
            
            this.setState({
                loaded:false
            })
        },1500)
    }

    getPerson(){
        MyFetch.get(
            '/dept/appuserlist',
            {},
            res => {
                console.log(res)
                let arr=[]
                for(let i=0;i<res.data.rows.length;i++){
                    let item = {}
                    item.key = res.data.rows[i].ID;
                    item.NAME = res.data.rows[i].NAME;
                    item.ACCOUNT = res.data.rows[i].ACCOUNT;
                    item.fullname = res.data.rows[i].fullname;
                    item.PHONE = res.data.rows[i].PHONE;
                    arr.push(item)
                }
                this.setState({
                    dataSource:arr
                })
            },
            err => {
            Alert.alert('出现错误', err.message, [
                { text: '确定' }
            ])
            }
        )
    }

    select(id,name){
        if (this.props.navigation.state.params.callback) {
            this.props.navigation.state.params.callback(id,name)
            this.props.navigation.goBack();
        }
    }

    renderRow(item,index){
        console.log(item)
            return <TouchableOpacity style={styles.form} onPress={()=>this.select(item.key,item.NAME)}>
                    <View>
                        <Text style={{textAlign:"left",fontSize:16}}>{this.state.type}{item.NAME}</Text>
                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>工号：{item.ACCOUNT}</Text>
                    </View>
                    <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>科室：{item.fullname}</Text>
                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>电话：{item.PHONE}</Text>
                    </View>
                </TouchableOpacity>
    }

    _footer(){
        return <Text style={{color:'#fff',textAlign:"center"}}>没有更多了</Text>
    }

    
    render() {
        return (
            <View style={styles.rootView}>
                <ImageBackground source={require('./image/loginBackground.png')} style={[styles.backgroundImage,{}]}>
                    <Image source={require('./image/mainBottom.png')}  resizeMode='contain' style={[styles.backgroundBottom,{height:width/375*206}]} /> 
                
                    <Myheader leftBtn="back" navigation={this.props.navigation} title="下一级审批人员"></Myheader>
                    <View style={[styles.list,{flex:1,width:width/375*355}]}>
                        <FlatList
                        data={this.state.dataSource}
                        ListFooterComponent={this._footer}
                        onRefresh={this.refreshing.bind(this)}
                        refreshing={this.state.loaded}
                        initialNumToRender={5}
                        renderItem={({item,index}) => this.renderRow(item,index)}
                        style={[styles.list,{flex:1,width:width/375*355}]}
                        />
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


