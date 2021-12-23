import React from 'react';
import { View, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { Divider } from '@src/styled';
import { FormatMoney, FormatDuration } from 'src/utils';
import Styled from 'styled-components';

import {
    iconLocation
} from '@assets/images/home';

const { width } = Dimensions.get('window');

const defaultProps = {
    item: {},
    style: {},
};

const ContentView = Styled(View)`
    paddingHorizontal: 16;
    flexDirection: column;
    justifyContent: flex-start;
`;

const BalanceView = Styled(View)`
    paddingVertical: 16;
    flexDirection: row;
    alignItems: flex-start;
`;

const HeaderBid = (props) => {
    const { item } = props;

    const { Color } = useColor();

    return (
        <View>
                <ContentView style={{...shadowStyle, backgroundColor: Color.theme}}>
                    <BalanceView>
                        <Image source={{uri: item.image}} style={{width: '23%', borderRadius: 4, aspectRatio: 1, borderRadius: 10}} />
                        <View
                            style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 16, width: '55%'}}>
                            <Text size={14} type='bold' color={Color.text} align='left'>{item.productName}</Text>
                            <Divider height={8}/>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
                                <Image source={iconLocation} style={{ width: 8, height: 10, tintColor: Color.text}}/>
                                <Text size={11} color={Color.text} style={{ marginLeft: 3 }}>Tangerang, Banten</Text>
                            </View>
                        </View>
                        <View 
                            style={{
                                borderRadius: 120,
                                backgroundColor: '#001C35',
                                paddingHorizontal: 18, 
                                paddingVertical: 6, 
                                justifyContent: 'center'}}>
                            <Text size={11} color='white'>{FormatDuration.getMinutesFromSeconds(11100)}</Text>
                        </View>
                    </BalanceView>
                    <View
                        style={{ 
                            backgroundColor: Color.bid,
                            width: '100%',
                            marginBottom: 16,
                            borderRadius: 8,
                        }}>
                        <View style={{ 
                            backgroundColor: Color.reverseOverflow,
                            paddingHorizontal: 10,
                            paddingVertical: 15,
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            borderRadius: 8,
                        }}>
                            <View
                                style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems: 'flex-start' }}>
                                <Text size={8} color={Color.text} style={{ opacity:0.7 }}>Penawaran saat ini</Text>
                                <Divider height={2}/>
                                <Text size={18} type='bold' color={Color.text}>{FormatMoney.getFormattedMoney(150000)}</Text>
                            </View>
                            <Divider height={20}/>
                            <View
                                style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems: 'flex-start' }}>
                                <Text size={8} color={Color.text} style={{ opacity:0.7 }}>Penawaran awal</Text>
                                <Divider height={2}/>
                                <Text size={14} color={Color.text}>{FormatMoney.getFormattedMoney(50000)}</Text>
                            </View>
                            <Divider height={20}/>
                            <View
                                style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems: 'flex-start' }}>
                                <Text size={8} color={Color.text} style={{ opacity:0.7 }}>Penawaranmu</Text>
                                <Divider height={2}/>
                                <Text size={14} color={Color.text}>Rp 0</Text>
                            </View>
                        </View>
                    </View>
                </ContentView>
                <View 
                    style={{ flexDirection: 'row', paddingVertical: 16, justifyContent:'flex-start', paddingHorizontal: 16}}>
                    <Text size={11} color={Color.text} type='bold'>Penawar</Text>
                </View>
        </View>
    )
}

HeaderBid.defaultProps = defaultProps;

export default HeaderBid;