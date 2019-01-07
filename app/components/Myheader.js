import React, { Component } from 'react'
import { View, Text,StatusBar,NativeModules, TouchableWithoutFeedback,Platform, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import storage from '../work/gStorage';
import MyFetch from '../work/myFetch';

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
export default class MyHeader extends Component {

    constructor(props) {
      super(props);
      this.state = {
        isModal:false
       };
    }
  componentDidMount () {
    // 广告页隐藏状态栏
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#6392F7')// 仅android
    }
  }

  returnFun () {
    const { goBack } = this.props.navigation; 
    goBack()
  }

  closeFun () {
    this.setState({
      isModal:true
    })
  }

  renderRightBtn () {
    if (this.props.rightBtn=="exit") {
      return  (<TouchableOpacity style={styles.btnView} onPress={() => this.goLogin()}>
            <Image source={require('../image/Exit.png')} resizeMode='contain' style={styles.leftBtn} />
        </TouchableOpacity>)
    } else {
      return <View style={styles.btnView}></View>
    }
  }

  renderLeftBtn () {
    if (this.props.leftBtn === 'back') {
      return (<TouchableOpacity style={styles.btnView} onPress={() => this.returnFun()}>
      <Image source={require('../image/Back.png')} resizeMode='contain' style={styles.leftBtn} />
      </TouchableOpacity>)
    } else {
      return <View style={styles.btnView}></View>
    }
  }

  goLogin(){
    const { navigate } = this.props.navigation; 
    storage.remove({
              key:'user'
            });
    navigate('Login')
        // MyFetch.get(
        //     '/applogout',
        //     '',
        //     res => {
        //       storage.remove({
        //         key:'user'
        //       });
        //       navigate('Login')
        //     },
        //     err => {
        //       Alert.alert('登录发生错误：', err.message, [
        //         { text: '确定' }
        //       ])
        //     }
        //   )
  }

  render () {
    return (
      <View style={styles.rootView}>
        <View style={styles.viewBox}>
            {this.renderLeftBtn()}
            <View style={styles.titleView}>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
            {this.renderRightBtn()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rootView: {
    ...ifIphoneX({
        height: 84
    }, {
        height: 44
    }),
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    marginTop:STATUSBAR_HEIGHT,
    borderBottomColor: '#6291F7',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  viewBox: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnView: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
  },
  titleView: {
    flex: 7,
    height:50,
    alignItems: 'center',
    justifyContent: 'flex-end',
    textAlign: 'center'
  },
  title: {
    fontSize: 16,
    lineHeight:50,
    fontWeight:"600",
    color: '#fff',
    height: 50,
  },
  leftBtn: {
      height: 20
  },
  modal:{
    flex:1,
    backgroundColor:'black',
    width:'100%',
    height:'100%'
  },
  modalViewStyle:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
  }
})
