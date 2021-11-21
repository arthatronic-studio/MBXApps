import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Platform, Linking } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity } from '@src/components/Button';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryMaudiAddLike } from '@src/lib/query';

const Example = Styled(View)`
`;

export default ({ navigation, route }) => {
    const { item } = route.params;

    const [state, changeState] = useState({
        im_like: item.im_like,
    });

    const setState = (obj) => changeState({ ...state, ...obj });

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();

    const { Color } = useColor();

    // useEffect(() => {
    //     const timeout = trigger ? setTimeout(() => {
    //         maudiAddLike();
    //     }, 500) : null;

    //     return () => {
    //         clearTimeout(timeout);
    //     }
    // }, [trigger]);

    const maudiAddLike = () => {
        showLoading();

        Client.query({
          query: queryMaudiAddLike,
          variables: {
            productId: item.id
          }
        })
        .then((res) => {
          console.log(res, 'res add like');
          if (res.data.maudiAddLike.id) {
            if (res.data.maudiAddLike.status === 1) {
                showLoading('success', 'Berhasil ditandai');
                setState({ im_like: true });
            } else {
                hideLoading();
                setState({ im_like: false });
            }
          }
        })
        .catch((err) => {
            console.log(err, 'err add like');
            hideLoading();
        })
    }

    console.log(route);

    return (
        <Scaffold
            headerTitle=''
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView
                contentContainerStyle={{paddingBottom: 16}}
            >
                <Image
                    source={{uri: item.image}}
                    style={{width: '100%', aspectRatio: 1.5, backgroundColor: Color.border}}
                />

                <View style={{padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.theme}}>
                    <TouchableOpacity
                        onPress={() => {
                            // setState({ im_like: !state.im_like });
                            maudiAddLike();
                        }}
                        style={{height: 48, width: 48, borderRadius: 24, position: 'absolute', top: -24, right: 24, backgroundColor: state.im_like ? Color.success : Color.primary, justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Ionicons
                            name={state.im_like ? 'checkmark' : 'bookmark-outline'}
                            size={24}
                            color={Color.textInput}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{paddingHorizontal: 24}}>
                    <View style={{paddingBottom: 12}}>
                        <Text size={24} type='bold' align='left'>
                            {item.productName}
                        </Text>
                    </View>

                    <View style={{paddingBottom: 8}}>
                        <Text align='left'>
                            {item.productDescription}
                        </Text>
                    </View>
                    
                    <View style={{paddingBottom: 12}}>
                        <Text size={12} align='left' style={{opacity: 0.6}}>
                            Buka Jam 09:00 - 22:00
                        </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View style={{alignItems: 'center'}}>
                        <View style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}>
                            <Text size={22} type='bold'>{item.like}</Text>
                        </View>
                        <Text size={12} style={{marginTop: 16}}>Ramah Disabilitas</Text>
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <View style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}>
                            <MaterialCommunityIcons name='ticket-percent' size={30} color={Color.green} />
                        </View>
                        <Text size={12} style={{marginTop: 16}}>Voucher</Text>
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                const daddr = `-6.311272,106.793541`;
                                if (Platform.OS === 'ios') {
                                    Linking.openURL('http://maps.apple.com/maps?daddr=' + daddr);
                                } else {
                                    Linking.openURL('http://maps.google.com/maps?daddr=' + daddr);
                                }
                            }}
                            style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Ionicons name='location' size={30} color={Color.primary} />
                        </TouchableOpacity>
                        <Text size={12} style={{marginTop: 16}}>Lihat Lokasi</Text>
                    </View>
                </View>
            </ScrollView>
        </Scaffold>
    )
}