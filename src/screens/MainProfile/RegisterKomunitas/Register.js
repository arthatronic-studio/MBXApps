import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from 'react-native-image-picker';
import {
    Header,
    Text,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor
  } from '@src/components';
import { TouchSelect } from '@src/components/Form';
import ModalSelectCommunity from 'src/screens/MainProfile/RegisterKomunitas/ModalSelectCommunity'
import validate from '@src/lib/validate';

import Client from '@src/lib/apollo';
import { queryMaudiProductManage } from '@src/lib/query';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: OpenSans-Regular;
  backgroundColor: transparent;
  borderBottomWidth: 1px;
  borderColor: #666666;
  fontSize: 14px;
`;

const CustomTouch = Styled(TouchableOpacity)`
    width: 33.33%;
    height: 100%;
    backgroundColor: transparent;
`;


const Register = () => {
    const { Color } = useColor();

    const modalSelectCommunityRef = useRef();

    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();

    const [userData, setUserData] = useState({
        code: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        reason: '',
        community: 'Komunitas Baca', // PUBLISH | DRAFT | PRIVATE | REMOVE
    });

    const [error, setError] = useState({
        firstName: null,
        lastName: null,
        contactNumber: null,
        reason: null,
    });

    const isValueError = (name) => {
        const newError = validate(name, userData[name]);
        setError({ ...error, [name]: newError });
    }

    const onChangeUserData = (key, val) => {
        setUserData({ ...userData, [key]: val });
    };

    const [selectedCommunity, setSelectedCommunity] = useState({
        id: 1, value: 'Komunitas Baca'
    });


    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <Header
                title="Daftar Komunitas"
            />
            <ScrollView>
                <View style={{flexDirection: 'row'}}>
                    <View style={{paddingHorizontal: 16, paddingTop: 30, flex: 1}}>
                        <LabelInput>
                            <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>First Name</Text>
                        </LabelInput>
                        <EmailRoundedView>
                            <CustomTextInput 
                                placeholder=''
                                keyboardType='default'
                                placeholderTextColor={Color.gray}
                                underlineColorAndroid='transparent'
                                autoCorrect={false}
                                onChangeText={(text) => onChangeUserData('firstName', text)}
                                selectionColor={Color.text}
                                value={userData.firstName}
                                onBlur={() => isValueError('firstName')}
                                style={{color: Color.text}}
                            />
                        </EmailRoundedView>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 30, flex: 1}}>
                        <LabelInput>
                            <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Last Name</Text>
                        </LabelInput>
                        <EmailRoundedView>
                            <CustomTextInput 
                                placeholder=''
                                keyboardType='default'
                                placeholderTextColor={Color.gray}
                                underlineColorAndroid='transparent'
                                autoCorrect={false}
                                onChangeText={(text) => onChangeUserData('lastName', text)}
                                selectionColor={Color.text}
                                value={userData.lastName}
                                onBlur={() => isValueError('lastName')}
                                style={{color: Color.text}}
                            />
                        </EmailRoundedView>
                    </View>
                </View>

                <View style={{paddingHorizontal: 16, paddingTop: 25}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Contact Number</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput 
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor={Color.gray}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('contactNumber', text)}
                            selectionColor={Color.text}
                            value={userData.contactNumber}
                            onBlur={() => isValueError('contactNumber')}
                            style={{color: Color.text}}
                        />
                    </EmailRoundedView>
                </View>

                

                <View style={{paddingHorizontal: 16, paddingTop: 25}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Alasan Daftar</Text>
                    </LabelInput>
                    <EmailRoundedView>
                        <CustomTextInput 
                            placeholder=''
                            keyboardType='default'
                            placeholderTextColor={Color.gray}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(text) => onChangeUserData('reason', text)}
                            selectionColor={Color.text}
                            value={userData.reason}
                            onBlur={() => isValueError('reason')}
                        />
                    </EmailRoundedView>
                </View>

                <View style={{paddingHorizontal: 16, paddingTop: 25}}>
                    <LabelInput>
                        <Text size={14} letterSpacing={0.08} style={{opacity: 0.6}}>Choose Community</Text>
                    </LabelInput>
                    <CustomTouch onPress={() => modalSelectCommunityRef.current.open()}>
                        <View style={{width: 175, height: 34, marginTop: 6, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: Color.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={{height: 34, paddingRight: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Text size={12} style={{marginTop: 2, marginLeft: 4}}>{userData.community}</Text>
                            </View>
                            <Ionicons name='chevron-down-outline' color={Color.text} />
                        </View>
                    </CustomTouch>
                </View>

            </ScrollView>
            

            <Submit
                buttonLabel='Daftar'
                buttonColor={Color.green}
                type='bottomSingleButton'
                buttonBorderTopWidth={0.5}
            />

            <Loading {...loadingProps} />

            <Popup {...popupProps} />

            <ModalSelectCommunity
                ref={modalSelectCommunityRef}
                selected={selectedCommunity}
                onPress={(e) => {
                    onChangeUserData('community', e.value);
                    setSelectedCommunity(e);
                    modalSelectCommunityRef.current.close();
                }}
            />

        </MainView>
    )
}

export default Register