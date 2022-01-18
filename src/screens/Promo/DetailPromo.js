import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView } from 'react-native';
import Styled from 'styled-components';
import ImagesPath from 'src/components/ImagesPath';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';

import { Divider } from '@src/styled';
import { shadowStyle } from '@src/styles';

const Example = Styled(View)`
`;

export default ({ navigation, route }) => {
    const { item } = route.params;

    const [state, setState] = useState();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();

    const { Color } = useColor();

    const ref = useRef();

    useEffect(() => {

    }, []);

    console.log(route);

    return (
        <Scaffold
            headerTitle={'Sabyan'}
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView>
                <View style={{padding: 16}}>
                    <Text size={24} type='bold' align='left' lineHeight={32}>
                        {item.productName}
                    </Text>
                </View>
                <View style={{paddingHorizontal: 16}}>
                    <View style={{paddingVertical: 4, width: 100, borderWidth: 0.5, borderRadius: 8, borderColor: Color.primary}}>
                        <Text size={10} color={Color.primary}>
                            {item.productCategory}
                        </Text>
                    </View>
                </View>

                <Divider />

                <Image
                    source={ImagesPath.popUpSabyan}
                    resizeMode='cover'
                    style={{width: '100%', height: 230, backgroundColor: Color.border}}
                />

                <View style={{padding: 16}}>
                    <Text lineHeight={24} align='left'>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {item.productDescription}
                    </Text>
                </View>

                <Divider />
            </ScrollView>

            {/* <View style={{padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.textInput, ...shadowStyle, shadowOpacity: 0.2}}>
                <SimpleLineIcons name='share' size={20} color={Color.text} />
                <Ionicons name='heart-outline' size={24} color={Color.text} />
            </View> */}
        </Scaffold>
    )
}