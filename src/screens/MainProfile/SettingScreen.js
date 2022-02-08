import React, { useRef, useEffect } from 'react';
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
} from '@src/components';

const SettingScreen = ({ navigation, route }) => {
    const { Color } = useColor();

    const { theme } = useSelector(state => state.theme);
    
    const dispatch = useDispatch();

    return (
        <Scaffold
            headerTitle='Pengaturan'
            onPressLeftButton={() => navigation.navigate('MainProfile', { refresh: true })}
        >
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

            <Grid style={{backgroundColor: Color.theme, borderColor: Color.border}}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('UserChangePassword', { canGoBack: true });
                        dispatch({ action: 'USER.CHANGE_PASSWORD', status: false });
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
            </Grid>
        </Scaffold>
    );
}

export default SettingScreen;