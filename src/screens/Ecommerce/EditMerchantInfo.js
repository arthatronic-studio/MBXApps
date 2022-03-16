import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, SafeAreaView, TextInput, Image, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';

import ImagesPath from '../../components/ImagesPath'

const { width } = Dimensions.get('window');

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  HeaderBig,
  Submit,
  Header,
  Scaffold,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ContentView = Styled(View)`
    width: 100%;
    marginTop: 16px;
    paddingHorizontal: 16px;
`;

const MainMenuView = Styled(View)`
    width: 100%;
    borderRadius: 8px;
    marginTop: 12px;
    padding: 20px 0px;
    flexDirection: row;
    flexWrap: wrap;
`;

const PerUserIcons = Styled(TouchableOpacity)`
    width: 33.33%;
    aspectRatio: 1.3;
    flexDirection: column;
    paddingHorizontal: 8px;
`;

const UserIcon = Styled(View)`
    height: 100%;
    justifyContent: center;
    alignItems: center;
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
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  fontSize: 14px;
`;

const EditMerchantInfo = () => {
    const {Color} = useColor()

    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Scaffold
                header={<Header customIcon title="Edit Profil Toko" type="bold" style={{paddingTop: 17, marginBottom: 10}} centerTitle={false} />}
                onPressLeftButton={() => navigation.pop()}
                />

                <View style={{padding: 16}}>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                            style={{width: 48, height: 48, borderRadius: 24, marginVertical: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.grayLight, marginRight: 10}}
                        >
                            <Feather name='camera' size={24} style={{marginBottom: 4}} color='#ffffff' />
                        </TouchableOpacity>
                        <View>
                            <Text align='left' type='bold' size={11}>Unggah Foto Profile Toko</Text>
                            <Text align='left' type='bold' size={8} color={Color.gray} style={{marginVertical: 4}}>Ukuran foto maks. 1MB dengan format JPEG, PNG, atau JPG</Text>
                            <Text align='left' type='bold' size={8} color={Color.primary}>Unggah Foto</Text>
                        </View>
                    </View>

                    <Text align='left' type='bold' size={11} style={{marginTop: 24, marginBottom: 16}}>Informasi Toko</Text>

                    <View style={{marginBottom: 16}}>
                        <View style={{borderWidth: 1, borderRadius: 4, borderColor: Color.border, paddingVertical: 8, paddingHorizontal: 12}}>
                            <LabelInput>
                                <Text size={8} letterSpacing={0.08} style={{color: Color.gray}}>Nama Toko</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='Toko Sumber Daya Abadi...'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    selectionColor={Color.text}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{marginBottom: 16}}>
                        <View style={{borderWidth: 1, borderRadius: 4, borderColor: Color.border, paddingVertical: 8, paddingHorizontal: 12}}>
                            <LabelInput>
                                <Text size={8} letterSpacing={0.08} style={{color: Color.gray}}>No. Telpon Toko</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='+62 813-1234-5678'
                                    keyboardType='numeric'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    selectionColor={Color.text}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{marginBottom: 16}}>
                        <View style={{borderWidth: 1, borderRadius: 4, borderColor: Color.border, paddingVertical: 8, paddingHorizontal: 12, height: 120}}>
                            <LabelInput>
                                <Text size={8} letterSpacing={0.08} style={{color: Color.gray}}>Alamat</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='Masukkan Alamat Toko'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    multiline={true}
                                    selectionColor={Color.text}
                                    style={{color: Color.text, height: 80}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{marginBottom: 16}}>
                        <View style={{borderWidth: 1, borderRadius: 4, borderColor: Color.border, paddingVertical: 8, paddingHorizontal: 12}}>
                            <LabelInput>
                                <Text size={8} letterSpacing={0.08} style={{color: Color.gray}}>Instagram Toko (opsional)</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='@ tokojayaabadi'
                                    keyboardType='numeric'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    selectionColor={Color.text}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{marginTop: 8, marginBottom: 10}}>
                        <Text type='bold' size={11} align='left'>Titik Lokasi</Text>
                    </View>

                    <View style={{marginBottom: 30}}>
                        <Image source={ImagesPath.wholeMap} style={{width: '100%'}} />
                    </View>

                    <View style={{ backgroundColor: Color.theme, marginBottom: 16 }}>
                        <TouchableOpacity style={{ backgroundColor: Color.primary, borderRadius: 30,  paddingVertical: 12 }}>
                            <Text type='semibold' color={Color.textInput}>Lanjut</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </MainView>
    )
}

export default EditMerchantInfo