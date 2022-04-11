import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, FlatList, SafeAreaView, TextInput, Image, Pressable, Keyboard, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from "react-native-modal";
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
import Client from 'src/lib/apollo';
import { queryBlockUser, queryGetUserBlock, queryUnblockUser } from 'src/lib/query/queryBlockUser';

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

const BottomSection = Styled(View)`
flexDirection: row;
paddingRight: 34;
alignItems: center;
borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  marginHorizontal: 16;
  paddingVertical: 8px;
  paddingHorizontal: 12px;
  borderRadius: 8px;
  borderWidth: 0.5px;
  flexDirection: row;
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

const TextInputNumber = Styled(TextInput)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  height: 40px;
`;

const CircleSend = Styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  borderRadius: 20px;
  justifyContent: center;
  alignItems: center;
  
`;

const BlockUser = ({navigation, route}) => {
    const [dataUserBlock, setDataUserBlock] = useState(null)
    const [userUnblock, setUserUnblock] = useState(null)
    const [search, setSearch] = useState("")
    const {Color} = useColor()
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [isModalVisible, setModalVisible] = useState(false);
    const {height} = useWindowDimensions();

    const user = useSelector(state => state['user.auth'].login.user);

    useEffect(() => {
        getUserBlock()
    }, [])

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const getUserBlock = () => {
        showLoading()

        let variables = {
            userId: user.userId,
            name: search,
        }

        Client.query({query: queryGetUserBlock, variables})
            .then(res => {
                console.log(search)
                console.log(res)
                setDataUserBlock(res.data.userBlockList);
                hideLoading()
            }).catch(reject => {
                console.log(reject)
                hideLoading()
            })
    }

    const unblockUser = (item) => {

        showLoading()
  
        let variables = {
          unblockUserId: item.userId
        }
  
        Client.mutate({mutation: queryUnblockUser, variables})
          .then(res => {
            if(res.data.userUnblock.success){
                getUserBlock()
                showLoading('success', 'Berhasil Unblock User')
            } else {
                showLoading('error', 'Terjadi Kesalahan Saat Unblock User')
            }
            console.log(res)
          })
    }

    return (
        <Scaffold
            header ={
                <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 16}}>
                    <AntDesign
                        name={'arrowleft'}
                        color={Color.text}
                        size={24}
                        onPress={() => navigation.pop()}
                    />
                    <Text align='left' size={18} type='bold' style={{marginLeft: 20}}>Daftar Blokir</Text>
                </View> 
            }
        >
            <MainView style={{marginTop: 30}}>
                <BottomSection style={{borderColor: Color.border, marginBottom: 40}}>
                    <BoxInput
                        style={{
                            width: '100%',
                            borderColor: Color.border,
                            backgroundColor: Color.grayLight,
                        }}
                    >
                        <TextInputNumber
                            name="text"
                            placeholder="Cari . . ."
                            placeholderTextColor='#000000'
                            blurOnSubmit={false}
                            returnKeyType='search'
                            error={null}
                            value={search}
                            onChangeText={text => {setSearch(text)}}
                            style={{
                                backgroundColor: Color.grayLight,
                                color: Color.text,
                            }}
                            onSubmitEditing={() => {
                                getUserBlock()
                                Keyboard.dismiss()
                            }}
                            onBlur={() => { }}
                        />
                        <CircleSend
                            onPress={() => {
                                getUserBlock()
                                Keyboard.dismiss()
                            }}
                        >
                            <Ionicons name="search" size={20} color={Color.placeholder} />
                        </CircleSend>
                    </BoxInput>
                </BottomSection>

                {dataUserBlock==false && (
                    <View
                        style={{
                            width: width,
                            height: height,
                            alignItems: 'center',
                            paddingTop: '40%'
                        }}
                    >
                        <Image
                            source={ImagesPath.userCircle}
                        />
                        <View 
                            style={{
                                width: '55%'
                            }}
                        >
                            <Text style={{color: '#6A7479'}}>Kamu belum melakukan blokir kesiapapun</Text>
                        </View>
                    </View>
                )}
                
                <FlatList 
                    key={'GENERAL'}
                    keyExtractor={(item, index) => item.toString() + index}
                    data={dataUserBlock}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{}}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginHorizontal: 16}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    {item.photoProfile && (
                                        <Image source={{uri: item.photoProfile}} style={{resizeMode: 'contain', width: 48, height: 48, borderRadius: 24, marginRight: 12}} />
                                    )}
                                    {item.photoProfile==null && (
                                        <View style={{width: 48, height: 48, borderRadius: 24, backgroundColor: Color.grayLight, marginRight: 12}} /> 
                                        // <Image source={{uri: item.photoProfile}} style={{resizeMode: 'contain', width: 48, height: 48, marginVertical: 8}} />
                                    )}
                                    <Text size={14}>{item.firstName} {item.lastName}</Text>
                                </View>
                                
                                <Pressable 
                                    onPress={() => {
                                            setUserUnblock(item)
                                            toggleModal()
                                        }
                                    }
                                >
                                <View style={{backgroundColor: Color.primary, paddingHorizontal: 16, paddingVertical: 6, alignSelf: 'center', borderRadius: 120}}>
                                    <Text align='left' size={8} color='#ffffff'>Buka Blokir</Text>
                                </View>
                                </Pressable>
                            </View> 
                        )
                    }}
                />

                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={() => setModalVisible(false)}
                    animationIn="slideInDown"
                    animationOut="slideOutDown"
                    style={{borderRadius: 16}}
                >
                    <View style={{backgroundColor: Color.theme}}>
                        <View
                            style={{
                                width: '100%',
                                paddingHorizontal: 26,
                                paddingVertical: 16,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    toggleModal();
                                }}
                                style={{
                                    alignSelf: 'flex-end',
                                    backgroundColor: Color.error,
                                    borderRadius: 50,
                                    marginBottom: 12,
                                }}>
                                <Image
                                    source={ImagesPath.icClose}
                                    style={{width: 16, height: 16}}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >                
                                <Text size={16} style={{marginBottom: 8}}>Apakah anda ingin membuka blokir?</Text>
                                <Text size={12} style={{marginBottom: 16, color: Color.gray}}>User dapat kembali berinteraksi kembali dengan anda</Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Color.primary,
                                        width: '100%',
                                        borderRadius: 250,
                                        paddingVertical: 14, 
                                        marginBottom: 25           
                                    }}
                                    onPress={async () => {
                                        await toggleModal()
                                        unblockUser(userUnblock)}
                                    }
                                >
                                    <Text style={{color: '#ffffff'}}>Ya, Buka Blokir</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => toggleModal()}
                                    style={{marginBottom: 30}}
                                >
                                    <Text>Batal</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </MainView>

            <Loading {...loadingProps} />
        </Scaffold>
    )
}

export default BlockUser