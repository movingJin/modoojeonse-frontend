import React, {Component, useState, useEffect} from 'react';
import customAlert from '../utils/customAlert' 
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    StyleSheet
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { signOut } from '../utils/tokenUtils';
import authStore from '../utils/authStore';
import WithdrawPage from '../auth/WithdrawPage';

export default class SettingPage extends Component{
    constructor(props){
        super(props);
        this.state={
            isAuthenticated: false,
            isWithdrawModalVisible: false
        };
    }
    
    componentDidMount(){
        const accessToken = authStore.getState().accessToken;
        if (accessToken === null) {
            this.setState({isAuthenticated: false});
        } else {
            this.setState({isAuthenticated: true});
        }
    }
    componentDidUpdate(prevProps){
        //componentDidUpdate 내에 setState함수를 쓰는 경우 주의, 문한반복이 발생할 수 있음.
        if(this.state.isAuthenticated !== prevProps.isAuthenticated){

        }
    }
    componentWillUnmount(){

    }

    _setIsAuthenticated  = (isAuthenticated) => {
        this.setState({isAuthenticated: isAuthenticated});
    }

    _goToAbout(){
        this.props.navigation.navigate('About');
    }

    _goToLogIn(){
        this.props.navigation.navigate('Login');
    }

    _goSignUp(){
        this.props.navigation.navigate('Signup');
    }

    _goWithdraw(){
        customAlert(
            "회원탈퇴",
            "회원탈퇴시 저장된 사용자정보는 삭제됩니다. 정말 탈퇴하시겠습니까?",
            [
                {text: '회원탈퇴', onPress: () => this.toggleModal()},
                {text: '취소', onPress: () => null},
            ],
            { cancelable: true }
          );
    }

    _goModifyInfo(){
        this.props.navigation.navigate('ModifyInfo');
    }

    _checkLogout(){
        customAlert(
            "로그아웃",
            "로그아웃 하시겠습니까?",
            [
                {text: '네', onPress: () => signOut(this._setIsAuthenticated)},
                {text: '취소', onPress: () => null},
            ],
            { cancelable: true }
        );
    }

    toggleModal = () => {
        this.setState({
            isWithdrawModalVisible: !this.state.isWithdrawModalVisible
        });
    };

    popupWithdrawModal=()=>{
        return(
          <Modal
          visible={this.state.isWithdrawModalVisible}
          transparent={true}
          animationType='slide'
          onRequestClose={() => this.toggleModal()}
          >
            <TouchableOpacity style={styles.modelStyle} onPress={() => this.setState({isWithdrawModalVisible: false})}>
                <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={styles.modelWrapperStyle}>
                        <WithdrawPage navigation={this.props.navigation}/>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        )
    }

    render(){
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.wrapButton}
                    onPress={this._goToAbout.bind(this)}>
                    <Text>🏅 모두의 전세에 대해서</Text>
                </TouchableOpacity>
                {this.state.isAuthenticated ? (<>
                    <TouchableOpacity 
                        style={styles.wrapButton}
                        onPress={this._goModifyInfo.bind(this)}>
                        <Text>✏️ 회원정보 수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.wrapButton}
                        onPress={this._checkLogout.bind(this)}>
                        <Text>🔓 로그아웃</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.wrapButton}
                        onPress={this._goWithdraw.bind(this)}>
                        <Text>⚠️ 회원탈퇴</Text>
                    </TouchableOpacity>
                </>) : (<>
                    <TouchableOpacity 
                        style={styles.wrapButton}
                        onPress={this._goToLogIn.bind(this)}>
                        <Text>🔑 로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.wrapButton}
                        onPress={this._goSignUp.bind(this)}>
                        <Text>📝 회원가입</Text>
                    </TouchableOpacity>
                </>)
                }
                {this.state.isWithdrawModalVisible && this.popupWithdrawModal()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    wrapButton: {
        width: wp('100%'),
        height: hp('8%'),
        paddingLeft: wp('2%'),
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    modelStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modelWrapperStyle: {
        backgroundColor: '#ffffff',
        padding: 20,
        width: '80%',
        height: '40%'
    }
})