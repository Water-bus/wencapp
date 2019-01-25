import React, {Component} from 'react';
import { StyleSheet,NativeModules,ScrollView,Alert,FlatList, TouchableOpacity, Platform,ImageBackground,Dimensions, TextInput, StatusBar,Text, View, Image} from 'react-native';
import storage from './work/gStorage';
import Myheader from './components/Myheader';
import MyFetch from './work/myFetch';

var {height,width} =  Dimensions.get('window');

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

export default class Meeting extends Component {

    constructor(props){
        super(props)
        this.state={
            title:'会议记录',
            dataSource:{
                date:''
            },
            confirm:true,
            confirmText:'',
            confirmTextHeight:14,
            personArr:[],
            id:''
        }
    }
    componentWillMount(){
        const {id,confirm} = this.props.navigation.state.params
        let _this = this
        _this.setState({
            id:id,
            confirm:confirm
        })
        if(confirm){
            this.getdata(id)
        }else{
            this.getdata2(id)
        }
        
    }
    componentWillUnmount() {
    }

    getdata(id){
        MyFetch.get(
            '/notice/appedit',
            {id:id},
            res => {
                console.log(res)
                let arr=[]
                for(let i=0;i<res.data.memberlist.data.length;i++){
                    let item = {}
                    item.key = res.data.memberlist.data[i].name;
                    item.account = res.data.memberlist.data[i].account;
                    item.phone = res.data.memberlist.data[i].phone;
                    item.email = res.data.memberlist.data[i].email;
                    arr.push(item)
                }
                this.setState({
                    dataSource:res.data.model.data,
                    personArr:arr
                })
            },
            err => {
            Alert.alert('错误', err.message, [
                { text: '确定' }
            ])
            }
        )
    }

    getdata2(id){
        MyFetch.get(
            '/notice/appview/'+id,
            {},
            res => {
                console.log(res)
                let arr=[]
                for(let i=0;i<res.data.memberlist.data.length;i++){
                    let item = {}
                    item.key = res.data.memberlist.data[i].name;
                    item.account = res.data.memberlist.data[i].account;
                    item.phone = res.data.memberlist.data[i].phone;
                    item.email = res.data.memberlist.data[i].email;
                    arr.push(item)
                }
                this.setState({
                    dataSource:res.data.model.data,
                    personArr:arr
                })
            },
            err => {
            Alert.alert('错误', err.message, [
                { text: '确定' }
            ])
            }
        )
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
        const data = this.state.dataSource
        return <View style={styles.form}>
                    <View>
                        <Text style={{textAlign:"left",fontSize:16}}>{data.title}</Text>
                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>{data.place}</Text>
                    </View>
                    <View style={{width:'30%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                        <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>{data.created}</Text>
                        <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>提前提醒天数 {data.remember}天</Text>
                    </View>
            </View>
    }

    main(){
        const data = this.state.dataSource
            return <View style={styles.main}>
            <View style={styles.mainTime}>
                <View>
                    <Text style={{textAlign:"center",fontSize:15,marginBottom:20}}>{data.date.substring(0,10)}</Text>
                    <Text style={{textAlign:"center",fontSize:10}}>{data.start}<Text style={[data.morning=="1"?{color:'#4D88DF'}:{color:'#E15749'}]}>{data.start_morning=="1"?"AM":"PM"}</Text></Text>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:15,marginBottom:30}}>~</Text>
                </View>
                <View>
                    <Text style={{textAlign:"center",fontSize:15,marginBottom:20}}>{data.date.substring(0,10)}</Text>
                    <Text style={{textAlign:"center",fontSize:10}}>{data.end}<Text style={[data.morning=="1"?{color:'#4D88DF'}:{color:'#E15749'}]}>{data.start_morning=="1"?"AM":"PM"}</Text></Text>
                </View>
            </View>
            <View style={{width:width/375*200,paddingBottom:width/375*17,borderBottomColor:'#C7C7C7',borderBottomWidth:1,borderStyle:'dashed'}}>
                <Text style={{textAlign:"center",fontSize:15,marginBottom:10,color:'#575A70'}}>使用单位来电部门</Text>
                <Text style={{textAlign:"center",fontSize:12,color:'#9EA0B1'}}>{data.company}</Text>
            </View>
            <View style={{width:width/375*216}}>
                <Text style={{textAlign:"center",fontSize:15,marginTop:9,marginBottom:10,color:'#575A70'}}>会议联系人</Text>
                <Text style={{textAlign:"center",fontSize:12,color:'#9EA0B1',marginBottom:34}}>{data.contact}</Text>
            </View>
    </View>
    }

    money(){
        const data = this.state.dataSource
            return  <View>
                        <View style={[styles.main]}>
                            <View><Text style={{fontSize:15,marginTop:22,marginBottom:14,}}>会议内容</Text></View>
                            <View style={{width:width/375*200,borderBottomColor:'#C7C7C7',borderBottomWidth:1,borderStyle:'dotted',marginBottom:18}}>
                                <Text style={{fontSize:10,marginBottom:14,color:'#9EA0B1'}}>{data.context}</Text>
                            </View>
                            <View style={{width:width/375*200}}>
                                <Text style={{fontSize:10,marginBottom:36,color:'#9EA0B1'}}>{data.note}</Text>
                            </View>
                        </View>
                        <View style={[styles.list,{height:'auto',width:width/375*355}]}>
                            <FlatList
                                data={this.state.personArr}
                                ListFooterComponent={this._footer}
                                refreshing={false}
                                initialNumToRender={5}
                                renderItem={({item,index}) => this.renderRow(item,index)}
                                style={[styles.list,{height:'auto',width:width/375*355}]}
                                />
                        </View>
                    </View>
    }

    renderRow(item,index){
            return <View style={styles.form}>
            <View>
                <Text style={{textAlign:"left",fontSize:16}}>{item.key}</Text>
                <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>工号：{item.account}</Text>
            </View>
            <View style={{width:'50%',borderLeftColor:'#DDDDDD',borderLeftWidth:1,borderStyle:'dashed',paddingLeft:10}}>
                <Text style={{textAlign:"left",fontSize:12,color:"#9EA0B1"}}>电子邮件：{item.email}</Text>
                <Text style={{textAlign:"left",marginTop:11,fontSize:12,color:"#9EA0B1"}}>电话：{item.phone}</Text>
            </View>
    </View>
    }

    confirm(){
        if(this.state.confirm){
            return <View style={[styles.confirm,{height:'auto'}]}>
                    <TouchableOpacity activeOpacity = {1} style = {styles.inputContainer} onPress = {() => this.TextInput.focus()} >
                        <TextInput autoCapitalize="none" 
                        placeholder="请输入反馈意见"
                        ref = {textInput => this.TextInput = textInput}
                        underlineColorAndroid='transparent'
                        placeholderTextColor='#777'
                        multiline={true} 
                        numberOfLines={10}
                        iosclearButtonMode="while-editing"
                        onContentSizeChange = {e => this.cauculateHeight(e)}
                        onChangeText={confirmText => this.setState({confirmText})}
                        style={[styles.textInput,{height:this.state.confirmTextHeight}]} />
                    </TouchableOpacity>
                    <View style={{width:width/375*102,marginBottom:15,flexDirection:'row',flexWrap:'nowrap',justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.confirmBtn()} style={{width:26,height:26,backgroundColor:'#ffffff',borderRadius:13,justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('./image/ok.png')}  resizeMode='contain' style={[{height:26,height:26}]} /> 
                        </TouchableOpacity>
                    </View>
    
            </View>
        }else{
            return <View style={[styles.confirm,{height:'auto'}]}></View>
        }
    }

    confirmBtn(){
        const { goBack } = this.props.navigation; 
        const {id,confirmText} = this.state
        
        MyFetch.post(
            '/notice/appfeedback',
            `meeting_notice.id=${id}&meeting_notice.feedback=${confirmText}`,
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

    cauculateHeight(e) {
        const confirmTextHeight = e.nativeEvent.contentSize.height > 14 ? e.nativeEvent.contentSize.height : this.state.confirmTextHeight;
        this.setState({confirmTextHeight});
    }
}
//bolt cogs file phone address-book-o wrench

const styles = StyleSheet.create({
    root:{
    },
    rootView: {
        flex: 1,
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
      height: null,
      // 祛除内部元素的白色背景
      backgroundColor: 'rgba(0,0,0,0)'
    },
    form:{
        width:width/375*355,
        height:width/375*86,
        backgroundColor:"#fff",
        borderRadius:5,
        paddingVertical:24,
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
        backgroundColor:"#fff",
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
        height:26,backgroundColor:'#9EA0B1',borderRadius:13,justifyContent:'center',alignItems:'center'
    },
});


