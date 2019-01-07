import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TextInput, KeyboardAvoidingView, Image, TouchableOpacity, View} from 'react-native';

export default class Input extends Component {

    constructor(props) {
        super(props);
        const seePsw = this.props.type === 'password';
        this.state = {
            seePsw,
            smsDisable: false,
            eyeName: '',
            showInput: false
            
        };
    }

    inputRender() {
        let firstName,secondName;
        switch(this.props.type){
            case 'account':
                firstName = '工号';
                secondName = 'Username';
                break;
            case 'password':
                firstName = '密码';
                secondName = 'Password';
                break;
            default:
                firstName = this.props.placeholder;
                secondName = '';
                break;

        }

        if(!this.props.content && !this.state.showInput) {
            return (
                <TouchableOpacity onPress={() => this.setState({showInput:true})} style={[styles.placeholderStyle, {width: (this.props.type) ? '70%' : '90%'}]}>
                    <Text style={styles.firstName}>{firstName}</Text>
                </TouchableOpacity>
            );
        }else {
            return (
                <TextInput style={[styles.inputStyle, {width: (this.props.type) ? '70%' : '90%'}]}
                           {...this.props}
                           placeholder={firstName}
                           autoFocus={true}
                           onEndEditing={() => this.setState({showInput:false})}
                           underlineColorAndroid='transparent'
                           placeholderTextColor='#777'
                           secureTextEntry={this.state.seePsw}
                           autoCapitalize='none'
                           autoCorrect={false}
                >
                </TextInput>
            );
        }
    }

    iconLeftReader() {
        let type = this.props.type;
        if (this.props.label) {
            return <Text style={styles.label}>{this.props.label}</Text>;
        }
        else {
            if(this.props.iconLeft == 'account'){
                return <View style={styles.iconContainer}>
                    <Image source={require('../image/user.png')} resizeMode='contain' style={styles.logo} />
                </View>; 
            }else {
                return <View style={styles.iconContainer}>
                    <Image source={require('../image/password.png')} resizeMode='contain' style={styles.logo} />
                </View>; 
            }
            
        }
    }

    
    render() {
        return (
            <View style={[styles.container,]}>
                {this.iconLeftReader()}
                {this.inputRender()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height:'50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'flex-start',
        paddingVertical: 10,
        borderBottomColor: '#BEC0CB',
        borderBottomWidth: 1,
    },
    inputStyle: {
        color:'#9EA0B1',
        height: 20,
        paddingVertical: 0,
        paddingHorizontal: 20,
        fontSize: 16
    },
    firstName: {
        width:'100%',
        color: '#9EA0B1',
        fontSize:16,
        height:20,
        textAlign:"center"
    },
    secondName: {
        width:'100%',
        color: '#9EA0B1',
        textAlign:"center"
    },
    placeholderStyle: {
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection: 'column',
        flexWrap:'wrap',
        color:'#9EA0B1',
        fontSize:16,
        height: '100%',
        fontSize: 9
    },
    logo: {
        width:28,
        height:28,
        marginLeft:20,
    },
    label: {
        width: '20%',
        textAlign: 'right',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#585858'
    },
    iconContainer: {
        width: 56,
        alignItems: 'center',
        justifyContent:'center'
    },
    btnEyes: {
        position: 'absolute',
        right: 0
    },
    btnSend: {
        justifyContent: 'center',
        borderRadius: 1,
        borderWidth: 1,
        borderColor: '#eb6100',
        position: 'absolute',
        right: 0,
        height: 20,
        width: 80
    },
    btnSendDisable: {
        justifyContent: 'center',
        borderRadius: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        position: 'absolute',
        right: 0,
        height: 20,
        width: 80
    },
    btnText: {
        paddingHorizontal: 5,
        textAlign: 'center',
        fontSize: 10,
        color: '#eb6100'
    },
    btnTextDisable: {
        paddingHorizontal: 5,
        textAlign: 'center',
        fontSize: 10,
        color: '#ccc'
    }
});
