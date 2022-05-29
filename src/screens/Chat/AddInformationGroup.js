import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Feather from 'react-native-vector-icons/Feather'
import { usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Entypo from 'react-native-vector-icons/Entypo'
import ImagesPath from 'src/components/ImagesPath';
import { Header, Scaffold, Alert } from 'src/components';
import {currentSocket} from '@src/screens/MainHome/MainHome';
import {
    Row,
    Col,
  } from '@src/components';
import { ScrollView } from 'react-native-gesture-handler';

const AddInformationGroup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { Color } = useColor();
  return (
    <Scaffold
            isLoading={isLoading}
            header={
                <Header
                    title='Buat Grup'
                />
            }
    >
        <ScrollView>
            <Row style={{marginHorizontal: 15, marginVertical: 15}}>
                <Image source={ImagesPath.secondChat}/>
                <Col style={{marginHorizontal: 10, paddingVertical: 5}}>
                    <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left'}}>Tambahkan Informasi</Text>
                    <Text style={{fontSize: 10, textAlign: 'left', color: Color.secondary}}>Tambahkan foto profile dan nama grup</Text>
                </Col>
            </Row>
            <View>
                <Image source={ImagesPath.userChat} style={{alignSelf: 'center', marginVertical: 15}}/>
                <View style={{backgroundColor: Color.primary, width: 20, height: 20, borderRadius: 20, position: 'absolute', justifyContent: 'center',alignSelf: 'center', marginTop: 75, right: 160, borderColor: Color.theme, borderWidth: 1}}>
                    <Feather size={10} name={'camera'} color={Color.theme} style={{alignSelf: 'center'}}/>
                </View>
            </View>
            <View>
                <Text style={{marginTop: 5,left: 25,fontSize: 6, color: Color.secondary, position: 'absolute'}}>Nama Forum</Text>
                <TextInput placeholder='Masukkan Nama Grup' style={{borderWidth: 1, borderColor: Color.border, width: '95%', alignSelf: 'center', borderRadius: 5, height: 42, fontSize: 12, paddingHorizontal: 15, paddingTop: 17}}>

                </TextInput>
                <Text style={{fontSize: 8, color: Color.secondary, textAlign: 'right', marginRight: 10, marginTop: 5}}>0/24</Text>
            </View>
            <View style={{marginVertical: 15}}>
                <Text style={{marginTop: 5,left: 25,fontSize: 6, color: Color.secondary, position: 'absolute'}}>Nama Forum</Text>
                <TextInput placeholder='Tuliskan sesuatu tentang forum' style={{borderWidth: 1, borderColor: Color.border, width: '95%', alignSelf: 'center', borderRadius: 5, height: 80, fontSize: 12, paddingHorizontal: 15, paddingTop: 17}}>

                </TextInput>
            </View>
        </ScrollView>

        <TouchableOpacity style={{marginVertical: 10,backgroundColor: Color.secondary, height: 40, width: '92%', alignSelf: 'center', borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 12, color: Color.textInput}}>Buat Grup</Text>
        </TouchableOpacity>

    </Scaffold>
  )
}

export default AddInformationGroup