import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Image, useWindowDimensions, SafeAreaView, Platform, Linking} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header, TouchableOpacity, useColor, Text, useLoading, usePopup, Col} from '@src/components';
import {shadowStyle} from '@src/styles';
import Scaffold from '@src/components/Scaffold';
import { Divider } from '@src/styled';
import { FormatMoney } from 'src/utils';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ButtonView = Styled(View)`
    width: 100%;
    paddingHorizontal: 16;
    paddingVertical: 16;
    flexDirection: column;
    alignItems: center;
    justifyContent: space-between;
`;

const EnterButton = Styled(TouchableOpacity)`
    width: 100%;
    height: 45px;
    borderRadius: 120px;
    justifyContent: center;
    alignItems: center;
    paddingHorizontal: 16;
`;

const Example = Styled(View)`
`;

import {
    iconScale,
    iconClock,
    iconFish,
    iconTimer
  } from '@assets/images/home';

export default ({ navigation, route }, props) => {
    const { item } = route.params;

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();

    const { Color } = useColor();
    // const prevState = usePreviousState(state);

    const ref = useRef();

    return (
        <Scaffold
            headerTitle='Detail'
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView
                contentContainerStyle={{paddingBottom: 16, paddingHorizontal: 16}}
            >
                <View
                style={{ paddingTop: 10, alignItems: 'flex-start'}}>
                    <Text size={22} type='bold' color={Color.text} align='left'>{item.productName}</Text>
                </View>
                <View
                style={{ paddingTop: 20, flexDirection: 'row', justifyContent:'flex-start' }}>
                    <View
                    style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems: 'flex-start' }}>
                        <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Harga Saat ini</Text>
                        <Text size={22} type='bold' color={Color.text}>{FormatMoney.getFormattedMoney(150000)}</Text>
                    </View>
                    <Divider width={25} />
                    <View
                    style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems: 'flex-start' }}>
                        <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Harga Permulaan</Text>
                        <Text size={18} color={Color.text}>{FormatMoney.getFormattedMoney(50000)}</Text>
                    </View>
                </View>
                <View style={{ 
                    marginTop:24,
                    backgroundColor: Color.bid,
                    borderRadius: 8,
                        }}>
                    <View style={{ 
                        backgroundColor: Color.reverseOverflow,
                        flexDirection: 'row', 
                        justifyContent: 'flex-start', 
                        paddingVertical: 15, 
                        paddingHorizontal: 10,
                        borderRadius: 8,
                        alignItems:'flex-start',
                    }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems:'flex-start'}}>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={iconFish} style={{ width: 13, height: 13, tintColor: Color.icon}}/>
                                <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Jenis Barang</Text>
                            </View>
                            <Text size={15} color={Color.text}>Ikan Tuna</Text>
                        </View>
                        <Divider width={22} />
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems:'flex-start'}}>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={iconScale} style={{ width: 13, height: 13, tintColor: Color.icon}}/>
                                <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Satuan</Text>
                            </View>
                            <Text size={15} color={Color.text}>Per Ekor</Text>
                        </View>
                        <Divider width={22} />
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems:'flex-start'}}>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={iconClock} style={{ width: 13, height: 13, tintColor: Color.icon}}/>
                                <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Jam Mulai</Text>
                            </View>
                            <Text size={15} color={Color.text}>13:05 WIB</Text>
                        </View>
                        <Divider width={22} />
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems:'flex-start'}}>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={iconTimer} style={{ width: 13, height: 13, tintColor: Color.icon}}/>
                                <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Durasi</Text>
                            </View>
                            <Text size={15} color={Color.text}>15 Menit</Text>
                        </View>
                    </View>
                </View>
                <Image
                    source={{uri: item.image}}
                    style={{width: '100%', aspectRatio: 1.5, borderRadius: 8, marginVertical: 24}}
                />
                <View style={{ 
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                 }}>
                    <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Deskripsi</Text>
                    <Text size={15} color={Color.text} align='left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Aenean vulputate, sapien ut blandit tristique, leo tellus congue eros, at lacinia lorem tellus a nisi. 
                    Nullam nec iaculis quam. Fusce vel sodales nisi, sagittis pulvinar odio. Mauris finibus dui in tellus 
                    pulvinar, et fringilla mauris venenatis. Proin nec tincidunt lacus. Proin vitae neque eu nisi pretium 
                    tempus. Praesent consectetur consequat molestie. Donec lacus sem, semper vel lacus vel, euismod fringilla 
                    eros. Morbi convallis, risus ut faucibus sollicitudin, velit nibh ornare est, fermentum eleifend augue 
                    odio ac justo.</Text>
                </View>
            </ScrollView>
            <ButtonView>
                <EnterButton 
                    onPress={() =>
                        navigation.navigate('Bid', {item})
                    }
                    style={{ backgroundColor: Color.primary }}>
                    <Text size={16} letterSpacing={0.02} color={Color.textInput}>Ikuti Lelang</Text>
                </EnterButton>
            </ButtonView>
        </Scaffold>
    )
}