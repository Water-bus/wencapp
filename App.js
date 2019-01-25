import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import {Platform, UIManager,NetInfo,} from 'react-native';
import LoginPage from './app/login';
import List from './app/main';
import Todo from './app/todoItem';
import SplashScreen from 'react-native-splash-screen';
import Meeting from './app/meeting';
import People from './app/people';
import Historys from './app/history';


// ignore remote debugger warning
console.ignoredYellowBox = ['Remote debugger'];

// 启用layout动画

setTimeout(() => {
  SplashScreen.hide()
}, 2000)

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}
// release版本中屏蔽控制台输出, 提高性能
if (!__DEV__) {
    global.console = {
        info: () => {
        },
        log: () => {
        },
        warn: () => {
        },
        error: () => {
        },
    };
}
const AppRootStackNavigator = createStackNavigator({
  Login: {screen: LoginPage}, // 登录页
  Main: {screen: List}, // 主列表页
  Todo:{screen:Todo}, // 待办事项
  Meet:{screen:Meeting}, // 会议记录
  People:{screen:People}, // 人员列表
  History:{screen:Historys}, // 历史记录不包含会议部分
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  });


  const App = createAppContainer(AppRootStackNavigator)

  export default App
