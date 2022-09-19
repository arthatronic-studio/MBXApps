import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
    Grid, Row, Col,
    Text,
    Header,
    TouchableOpacity,
    useColor,
    Scaffold,
    AlertModal,
    usePopup,
} from '@src/components';
import { redirectTo } from 'src/utils';
// import { initSocket } from 'src/api-socket/currentSocket';

const initialAlertModalProps = {
    visible: false,
    title: '',
    message: '',
    onDiscard: () => {},
    onSubmit: () => {},
};

const SettingScreen = ({ navigation, route }) => {
    const { Color } = useColor();
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const [popupProps, showPopup] = usePopup();

    const [alertModalProps, setAlertModalProps] = useState(initialAlertModalProps);

    // const currentSocket = initSocket();

    const onPressLogout = () => {
        dispatch({ type: 'AUTH.CLEAR' });
        dispatch({type: 'USER.LOGOUT'});
        redirectTo('LoginScreen');
        // currentSocket.disconnect();
    };

    return (
        <Scaffold
            headerTitle='Pengaturan'
            popupProps={popupProps}
        >
            {/* dark mode */}
            {/* <Grid style={{backgroundColor: Color.theme, borderTopWidth: 0.5, borderColor: Color.border}}>
                <Row>
                    <Col align='flex-start' size={8} justify='center'>
                        <Text size={12} type='medium'>Dark Mode</Text>
                        <Text size={8} align='left'>Ubah tema ke gelap</Text>
                    </Col>
                    <Col align='flex-end' size={4} justify='center'>
                        <TouchableOpacity
                            onPress={() => {
                                theme === 'dark' ?
                                    dispatch({type: 'THEME.SET_THEME', data: 'system'})
                                :
                                    dispatch({type: 'THEME.SET_THEME', data: 'dark'});
                            }}
                        >
                            <Fontisto name={theme === 'dark' ? 'toggle-on' : 'toggle-off'} color={theme === 'dark' ? Color.text : Color.secondary} size={18} />
                        </TouchableOpacity>
                    </Col>
                </Row>
            </Grid> */}
            {/* change primary theme color */}
            {/* <Grid style={{backgroundColor: Color.theme, borderTopWidth: 0.5, borderColor: Color.border}}>
                <Row>
                    <Col align='flex-start' size={8} justify='center'>
                        <Text size={12} type='medium'>Warna Tema</Text>
                        <Text size={8} align='left'>Ubah tampilan warna utama</Text>
                    </Col>
                    <Col align='flex-end' size={4} justify='center'>
                        <TouchableOpacity
                            onPress={() => {

                            }}
                        >
                            <Text size={12}>Default</Text>
                        </TouchableOpacity>
                    </Col>
                </Row>
                <View style={{height: 16}} />
                <Row>
                    <Col align='flex-start' size={8} justify='center'>
                    </Col>
                    <Col align='flex-end' size={4} justify='center'>
                        <TouchableOpacity
                            onPress={() => {

                            }}
                        >
                            <Text size={12}>Biru</Text>
                        </TouchableOpacity>
                    </Col>
                </Row>
            </Grid> */}
            {/* change password */}
            {/* <Grid style={{backgroundColor: Color.theme, borderColor: Color.border}}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('UserChangePassword', { canGoBack: true });
                        dispatch({ type: 'USER.CHANGE_PASSWORD', status: false });
                    }}
                >
                    <Row>
                        <Col align='flex-start' size={8} justify='center'>
                            <Text size={12} type='medium' style={{marginBottom: 4}}>Ubah Password</Text>
                            <Text size={8} align='left'>Ubah password via email</Text>
                        </Col>
                        <Col align='flex-end' size={4} justify='center'>
                            <Fontisto name='arrow-right' size={12} color={Color.text} />
                        </Col>
                    </Row>
                </TouchableOpacity>
            </Grid> */}
            {/* block list */}
            {/* <Grid style={{backgroundColor: Color.theme, borderColor: Color.border}}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('BlockUser', { canGoBack: true });
                    }}
                >
                    <Row>
                        <Col align='flex-start' size={8} justify='center'>
                            <Text size={12} type='medium' style={{marginBottom: 4}}>Daftar Blokir User</Text>
                            <Text size={8} align='left'>Daftar user yang diblokir oleh anda</Text>
                        </Col>
                        <Col align='flex-end' size={4} justify='center'>
                            <Fontisto name='arrow-right' size={12} color={Color.text} />
                        </Col>
                    </Row>
                </TouchableOpacity>
            </Grid> */}
            {/* deactivate */}
            <Grid style={{backgroundColor: Color.theme, borderColor: Color.border}}>
                <TouchableOpacity
                    onPress={() => {
                        setAlertModalProps({
                            ...alertModalProps,
                            visible: true,
                            title: 'Deactive Account',
                            message: 'Apakah Anda yakin akan menonaktifkan akun sementara?',
                            onDiscard: () => {
                                setAlertModalProps(initialAlertModalProps);
                            },
                            onSubmit: () => {
                                setAlertModalProps(initialAlertModalProps);
                                showPopup('Berhasil nonaktivasi akun', 'success');
                                setTimeout(() => {
                                    onPressLogout();
                                }, 2500);
                            }
                        });
                    }}
                >
                    <Row>
                        <Col align='flex-start' size={8} justify='center'>
                            <Text size={12} type='medium' style={{marginBottom: 4}}>Deactivate Account</Text>
                            <Text size={8} align='left'>Deactivating acccount temporary</Text>
                        </Col>
                        <Col align='flex-end' size={4} justify='center'>
                            <Fontisto name='arrow-right' size={12} color={Color.text} />
                        </Col>
                    </Row>
                </TouchableOpacity>
            </Grid>
            {/* delete account */}
            <Grid style={{backgroundColor: Color.theme, borderColor: Color.border}}>
                <TouchableOpacity
                    onPress={() => {
                        setAlertModalProps({
                            ...alertModalProps,
                            visible: true,
                            title: 'Delete Account',
                            message: 'Apakah Anda yakin akan menghapus akun selamanya?',
                            onDiscard: () => {
                                setAlertModalProps(initialAlertModalProps);
                            },
                            onSubmit: () => {
                                setAlertModalProps(initialAlertModalProps);
                                showPopup('Berhasil menghapus akun', 'success');
                                setTimeout(() => {
                                    onPressLogout();
                                }, 2500);
                            }
                        });
                    }}
                >
                    <Row>
                        <Col align='flex-start' size={8} justify='center'>
                            <Text size={12} type='medium' color={Color.error} style={{marginBottom: 4}}>Delete Account</Text>
                            <Text size={8} align='left'>Deleting account permanent</Text>
                        </Col>
                        <Col align='flex-end' size={4} justify='center'>
                            <Fontisto name='arrow-right' size={12} color={Color.text} />
                        </Col>
                    </Row>
                </TouchableOpacity>
            </Grid>

            <AlertModal
                {...alertModalProps}
                type='warning'
                showDiscardButton
            />
        </Scaffold>
    );
}

export default SettingScreen;