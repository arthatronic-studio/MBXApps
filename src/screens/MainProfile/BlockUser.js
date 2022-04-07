import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, FlatList, SafeAreaView, TextInput, Image, Pressable, Keyboard } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardBlockUser from './CardBlockUser';

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
import { queryBlockUser, queryGetUserBlock } from 'src/lib/query/queryBlockUser';

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
    const [search, setSearch] = useState("")
    const {Color} = useColor()

    const user = useSelector(state => state['user.auth'].login.user);

    useEffect(() => {
        getUserBlock()
    }, [])

    const getUserBlock = () => {
        let variables = {
            userId: user.userId,
            name: search,
        }

        Client.query({query: queryGetUserBlock, variables})
            .then(res => {
                console.log(res)
                setDataUserBlock(res.data.userBlockList);
            }).catch(reject => {
                console.log(reject)
            })
    }

    const blockUser = () => {
        let variables = {
            blockUserId: 249
        }

        Client.mutate({mutation: queryBlockUser, variables})
            .then(res => {
                console.log(res)
            }).catch(reject => {
                console.log("ini erooooooor")
                console.log(reject)
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

                <FlatList 
                    key={'GENERAL'}
                    keyExtractor={(item, index) => item.toString() + index}
                    data={dataUserBlock}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{}}
                    renderItem={({ item, index }) => {
                        return (
                          <CardBlockUser
                            item={item}
                          />
                        )
                    }}
                />

            </MainView>
        </Scaffold>
    )
}

export default BlockUser