import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import ImagesPath from 'src/components/ImagesPath';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {
    useLoading,
    usePopup,
    useColor,
    Header,
    TouchableOpacity
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';

import { Container, Divider } from '@src/styled';
import { shadowStyle } from '@src/styles';
import { adsPopup } from 'assets/images/popup';

const PromoScreen = ({ navigation, route }) => {
    const { params } = route;

    const [state, setState] = useState();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();

    const { Color } = useColor();
    const { width, height } = useWindowDimensions();

    const ref = useRef();

    useEffect(() => {

    }, []);

    console.log(route);

    return (
        <Scaffold
            header={
                <Header
                    title='Promo'
                    centerTitle={false}
                />
            }
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate('PromoDetailScreen')}>
                    <Container width={width} height={width * 0.7} paddingTop={16}>
                        <Image
                            source={adsPopup}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Container>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('PromoDetailScreen')}>
                    <Container width={width} height={width * 0.7} paddingTop={12} paddingHorizontal={16}>
                        <Image
                            source={adsPopup}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 8,
                            }}
                        />
                    </Container>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PromoDetailScreen')}>
                    <Container width={width} height={width * 0.7} paddingTop={12} paddingHorizontal={16}>
                        <Image
                            source={adsPopup}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 8,
                            }}
                        />
                    </Container>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PromoDetailScreen')}>
                    <Container width={width} height={width * 0.7} paddingTop={12} paddingHorizontal={16}>
                        <Image
                            source={adsPopup}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 8,
                            }}
                        />
                    </Container>
                </TouchableOpacity>
            </ScrollView>
        </Scaffold>
    )
}

export default PromoScreen;