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

const initialCountdown = 60;

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
            showHeader={false}
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
                        paddingTop: 48,
                    }}
                >
                    <Container paddingHorizontal={16} marginTop={24} marginBottom={48} align='flex-start'>
                        <Text align='left' size={28} type='semibold'>Verification</Text>
                        <Divider />
                        <Text align='left'>Please check your inbox. we've been sent the OTP code to your number.</Text>
                    </Container>

                    <Row justify='center'>
                        {listTextInput.map((item, idx) => {
                            const isFocus = activeIndex === idx;

                            return (
                                <View
                                    key={idx}
                                    style={{ paddingHorizontal: 12 }}
                                >
                                    <View
                                        style={{
                                            padding: 12,
                                            backgroundColor: Color.primaryDark,
                                            borderRadius: 8,
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
                                                width: 24,
                                                height: 40,
                                                fontSize: 18,
                                                textAlign: 'center',
                                                borderBottomWidth: 2,
                                                color: isFocus || item.value !== '' ? Color.primary : Color.text,
                                                borderColor: isFocus || item.value !== '' ? Color.primary : Color.text,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        })}
                    </Row>

                    <Padding top={24} bottom={16 * 5}>
                        <Text
                            onPress={() => {
                                if (countdown > 0) {

                                } else {
                                    setCountdown(initialCountdown);
                                    resetOtp();
                                    onResendOtp();
                                }
                            }}
                        >
                            {'Resend Code ('}{FormatDuration.getMinutesFromSeconds(countdown)}{')'}
                        </Text>
                    </Padding>

                    <Button
                        style={{ marginBottom: 20, ...shadowStyle }}
                        onPress={() => onSubmit()}
                    >
                        Confirm
                    </Button>
                </TouchableOpacity>
            </ScrollView>

            <Header
                style={{
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    top: statusBarHeight,
                }}
            />

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