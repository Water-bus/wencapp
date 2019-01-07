/**
 登录页面
 */

import React, {Component} from 'react';
import { StyleSheet,ImageBackground, Keyboard,Dimensions,KeyboardAvoidingView, Alert, BackAndroid, Platform, StatusBar, Text,  TouchableOpacity, ToastAndroid, BackHandler, View, Image} from 'react-native';
import storage from './work/gStorage';
import Input from './components/input'
import MyFetch from './work/myFetch';
import SplashScreen from 'react-native-splash-screen';

var {height,width} =  Dimensions.get('window');

export default class LoginPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            account:'',
            password:'',
            keyboardHeight:0,
        };
    }
    componentDidMount () {
        setTimeout(() => {
          SplashScreen.hide()
        }, 2000)
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor('transparent')// 仅android
        }
        
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        const {navigate} = this.props.navigation;
        storage.load({
            key:'user',
            autoSync: true,
            syncInBackground: true,
        }).then(ret => {
            console.log(ret)
            let account = ret.account;
            let password = ret.password;
            // if(account!='')
            this.loginFetch(account,password)
            
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.log(err);
            switch (err.name) {
                case 'NotFoundError':
                    // 更新
                    this.setState({
                        account:'',
                        psw:''
                    });
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        })
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    
    _keyboardDidShow(event){
        console.log(event)
        this.setState({
            keyboardHeight:event.endCoordinates.height
        })
    }

    _keyboardDidHide(){
        this.setState({
            keyboardHeight:0
        })
    }

    componentWillMount() {
        
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    onBackAndroid = () => {
        
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            BackAndroid.exitApp()
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用',1000);
        return true;
        
    };

    login() {
        const {account, password} = this.state;
        this.loginFetch(account,password)
        //this.loginFetch(account,password)
    }

    loginFetch(account,password){
        const {navigate} = this.props.navigation;
        MyFetch.post(
            '/login',
            `account=${account}&password=${password}`,
            res => {
                    console.log(res)
                    storage.save({
                        key:'user',    // 注意:请不要在key中使用_下划线符号!
                        data: {
                            account:account,
                            password:password
                        },
                    });
                navigate('Main')
            },
            err => {
              Alert.alert('登录发生错误：', err.message, [
                { text: '确定' }
              ])
            }
          )
    }

    render() {
        return (
        <View style={[styles.container,{}]}> 
             <StatusBar hidden={true}></StatusBar>
            <ImageBackground source={require('./image/loginBackground.png')} style={[styles.backgroundImage,{bottom:this.state.keyboardHeight}]}>
                <Image source={require('./image/loginLogo.png')}  resizeMode='contain' style={[{height:width*0.632,width:width*0.632,marginTop:width/375*86}]} />
                <Image source={require('./image/loginBottom.png')}  resizeMode='contain' style={[styles.backgroundBottom,{height:width/150*26}]} /> 
                <View  style={[styles.loginInput,{height:width*150/375,width:width*280/375,marginTop:width/375*41}]}>
                    <Input iconLeft='account' content={this.state.account} type='account' onChangeText={account => this.setState({account})}/>
                    <Input iconLeft='password' content={this.state.password} type='password' onChangeText={password => this.setState({password})}/>
                </View>
                <TouchableOpacity onPress={() => this.login()} style={[styles.loginBtn,{height:width*53/375,width:width*166/375,marginTop:width/375*17}]}>
                    <Text style={{color:'#fff'}}>登录</Text>
                </TouchableOpacity>
                
            </ImageBackground>
            
        </View>  
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:0,
    height:"100%",
    height:"100%",
    flexDirection:'column',
    flexWrap:'wrap',
    position:"relative",
    backgroundColor: '#FFF',
    alignItems: 'stretch',
    justifyContent: 'center'
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
    position:'absolute'
  },
  loginInput:{
    flexDirection:"row",
    flexWrap:'wrap',
    justifyContent: 'center',
    backgroundColor:'#fff',
    borderRadius:5
  },
  loginBtn: {
    fontSize:16,
    borderRadius:5,
    backgroundColor:'#73A0FF',
    alignItems:'center',
    justifyContent:'center',
  }
});
