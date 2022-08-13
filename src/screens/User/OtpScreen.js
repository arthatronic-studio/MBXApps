import React, { useState, useEffect, createRef } from 'react';
import { View, TextInput, Keyboard, ScrollView, useWindowDimensions, Image } from 'react-native';
import { useDispatch } from 'react-redux';

import Scaffold from '@src/components/Scaffold';
import Text from '@src/components/Text';
import Button from 'src/components/Button/Button';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';
import { usePopup } from 'src/components/Modal/Popup';
import { shadowStyle } from '@src/styles';
import { useInterval } from '@src/hooks/useInterval';
import { Container, Divider, Padding, Row } from 'src/styled';
// import {
//     bgLogin,
// } from '@assets/images';
import AlertModal from 'src/components/Modal/AlertModal';
// import { requestHttp } from 'src/api/httpService';
// import { requestGetCurrentUser } from 'src/api/user';
import { CommonActions } from '@react-navigation/native';
import { Header } from 'src/components';
import { statusBarHeight } from 'src/utils/constants';
import { FormatDuration } from 'src/utils';

const initialCountdown = 60 * 5;

const OtpScreen = ({ navigation, route }) => {
    const [listTextInput, setListTextInput] = useState([]);
    const [activeIndex, setActiveIndex] = useState();
    const [countdown, setCountdown] = useState(initialCountdown);
    const [showModalPopup, setShowModalPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fcmToken, setFcmToken] = useState('');

    const { Color } = useColor();
    const { height } = useWindowDimensions();

    const [popupProps, showPopup] = usePopup();
    const dispatch = useDispatch();

    useInterval(() => {
        handleCountDown();
    }, 1000);

    useEffect(() => {
        // setFcmToken(route.params.body.device_token);
    }, []);

    const redirectTo = (name, params) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name, params }
                ],
            })
        );
    }

    const handleCountDown = () => {
        if (countdown > 0) {
            setCountdown(countdown - 1);
        }
    }

    const resetOtp = () => {
        let newListTextInput = [];
        for (let index = 0; index < 4; index++) {
            newListTextInput.push({ ref: createRef(), value: '' });
        }
        setListTextInput(newListTextInput);
    }

    useEffect(() => {
        // showPopup('Otp berhasil dikirim', 'success');

        resetOtp();

        Keyboard.addListener('keyboardDidHide', () => setActiveIndex());

        return () => {
            Keyboard.removeListener('keyboardDidHide');
        }
    }, []);

    const onChangeText = (value, index, ref) => {
        if (ref) {
            if (value.length > 0) {
                ref.current.focus();
            }
        }

        let newListTextInput = [];
        listTextInput.forEach(e => newListTextInput.push(e));
        newListTextInput[index].value = value;
        setListTextInput(newListTextInput);
    }

    const onKeyPress = (key, index, ref) => {
        if (ref) {
            if (key === 'Backspace') {
                ref.current.focus();
            }
        }
    }

    const getCurrentUser = () => {
        // requestGetCurrentUser()
        //     .then((res) => {
        //         if (res.status) {
        //             dispatch({
        //                 type: 'USER.ADD_USER_DATA',
        //                 data: res.data,
        //             });

        //             setShowModalPopup(true);

        //             setTimeout(() => {
        //                 setShowModalPopup(false);

        //                 if (res.data.longitude == '0' && res.data.latitude == '0') {
        //                     redirectTo('SearchLocationScreen', { attachScreen: 'MAIN' });
        //                 } else {
        //                     redirectTo('MainPage');
        //                 }
        //             }, 2000);
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    }

    const onResendOtp = () => {
        // const body = route.params.body;

        // requestHttp.post('member/otp', body)
        // .then((res) => {
        //     console.log('res otp', res);

        //     if (res.data && res.data.status) {
        //         showPopup('Otp berhasil dikirim', 'success');
        //     } else {
        //         showPopup(res.data.message, 'error');
        //     }
        // })
        // .catch((err) => {
        //     console.log('err otp', err);
        //     showPopup(err.message, 'error');
        // });
    }

    const onSubmit = () => {
        let otp = '';

        listTextInput.map((e) => {
            if (e.value !== '') otp = otp + e.value;
        });

        if (otp.length < 4) {
            showPopup('Silakan masukan nomor otp yang sesuai', 'warning');
            return;
        }

        setIsLoading(true);

        const body = {
            otp,
            device_token: fcmToken,
            // phone: route.params.body.phone,
        };

        console.log('body otp', body);

        // requestHttp.post('member/otp-verification', body)
        // .then((res) => {
        //     console.log('res otp verify', res);

        //     if (res.data && res.data.status) {
        //         dispatch({
        //             type: 'USER.ADD_AUTH_DATA',
        //             data: res.data.data.token,
        //         });

        //         getCurrentUser();
        //     } else {
        //         showPopup(res.data.message, 'error');
        //     }

        //     setIsLoading(false);
        // })
        // .catch((err) => {
        //     console.log('err otp verify', err);
        //     setIsLoading(false);
        //     showPopup(err.message, 'error');
        // });
    }

    return (
        <Scaffold
            popupProps={popupProps}
            isLoading={isLoading}
        >
            <ScrollView
                keyboardShouldPersistTaps='handled'
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => Keyboard.dismiss()}
                    style={{
                        flex: 1,
                        paddingHorizontal: 16,
                    }}
                >
                    <Container marginTop={24} marginBottom={48} align='flex-start'>
                        <Text align='left' size={28} type='semibold'>Verifikasi OTP</Text>
                        <Text align='left'>Kami telah mengirimkan kode untuk melakukan verifikasi login ke nmor kamu.</Text>
                    </Container>

                    <Row justify='center'>
                        {listTextInput.map((item, idx) => {
                            const isFocus = activeIndex === idx;

                            return (
                                <View
                                    key={idx}
                                    style={{
                                        paddingHorizontal: 5,
                                        width: '25%',
                                        aspectRatio: 4/3,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <TextInput
                                            ref={item.ref}
                                            maxLength={1}
                                            selectTextOnFocus
                                            keyboardType='numeric'
                                            onFocus={() => setActiveIndex(idx)}
                                            value={item.value}
                                            onChangeText={(text) => onChangeText(
                                                text,
                                                idx,
                                                listTextInput[idx + 1] ? listTextInput[idx + 1].ref : null
                                            )}
                                            onKeyPress={(e) => onKeyPress(
                                                e.nativeEvent.key,
                                                idx,
                                                listTextInput[idx - 1] ? listTextInput[idx - 1].ref : null
                                            )}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                fontSize: 32,
                                                textAlign: 'center',
                                                fontFamily: 'Inter-Regular',
                                                // borderBottomWidth: 2,
                                                color: Color.textInput,
                                                // color: isFocus || item.value !== '' ? Color.tertiary : Color.text,
                                                backgroundColor: isFocus || item.value !== '' ? Color.tertiary : Color.border,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 8,
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </Row>

                    <Padding top={16} bottom={16}>
                        <Text
                            align='right'
                            onPress={() => {
                                if (countdown > 0) {

                                } else {
                                    setCountdown(initialCountdown);
                                    resetOtp();
                                    onResendOtp();
                                }
                            }}
                        >
                            {'Kirim Ulang ('}{FormatDuration.getMinutesFromSeconds(countdown)}{')'}
                        </Text>
                    </Padding>

                    <Button
                        style={{ marginBottom: 20, ...shadowStyle }}
                        onPress={() => onSubmit()}
                    >
                        Verifikasi
                    </Button>
                </TouchableOpacity>
            </ScrollView>

            <AlertModal
                visible={showModalPopup}
                title='Hore! Login Berhasil'
                subTitle='Yuk! jangan lupa cucian hari ini'
                showButton={false}
            />
        </Scaffold>
    );
}

export default OtpScreen;