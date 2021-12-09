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
import { FormatMoney } from 'src/utils';
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
    paddingTop: 16;
    flexDirection: row;
`;

const HeaderBid = (props) => {
    const { item } = props;

    const { Color } = useColor();

    return (
        <View>
                <ContentView style={{...shadowStyle, backgroundColor: Color.textInput}}>
                    <BalanceView 
                        style={{backgroundColor: Color.textInput, paddingBottom: 19}}>
                        <Image source={{uri: item.image}} style={{width: '23%', borderRadius: 4, aspectRatio: 1, borderRadius: 10}} />
                        <View
                            style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 16, width: '55%'}}>
                            <Text size={20} type='bold' color={Color.text} align='left'>{item.productName}</Text>
                            <Divider height={5}/>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
                                <Image source={iconLocation} style={{ width: 16, height: 16, tintColor: Color.text}}/>
                                <Text size={15} color={Color.text} style={{ paddingLeft: 3 }}>Tangerang, Banten</Text>
                            </View>
                        </View>
                        <View 
                            style={{
                                aspectRatio: 3,
                                width: '20%', 
                                borderRadius: 120,
                                backgroundColor: '#001C35',
                                paddingHorizontal: 6, 
                                paddingBottom: 6, 
                                justifyContent: 'center'}}>
                            <Text size={15} color='white'>13:05</Text>
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
                            paddingTop: 16,
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            borderRadius: 8,
                        }}>
                            <View
                                style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems: 'flex-start' }}>
                                <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Penawaran saat ini</Text>
                                <Text lineHeight={24} size={22} type='bold' color={Color.text}>{FormatMoney.getFormattedMoney(150000)}</Text>
                            </View>
                            <Divider height={3}/>
                            <View
                                style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems: 'flex-start' }}>
                                <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Penawaran awal</Text>
                                <Text lineHeight={22} size={16} color={Color.text}>{FormatMoney.getFormattedMoney(50000)}</Text>
                            </View>
                            <Divider height={3}/>
                            <View
                                style={{ flexDirection: 'column', justifyContent:'flex-start', alignItems: 'flex-start' }}>
                                <Text size={12} color={Color.text} style={{ opacity:0.7 }}>Penawaranmu</Text>
                                <Text lineHeight={22} size={16} color={Color.text}>Rp 0</Text>
                            </View>
                        </View>
                    </View>
                </ContentView>
                <View 
                    style={{ flexDirection: 'row', paddingVertical: 16, justifyContent:'flex-start', paddingHorizontal: 16}}>
                    <Text lineHeight={17} size={15} color={Color.text} type='bold'>Penawar</Text>
                </View>
        </View>
    )
}

HeaderBid.defaultProps = defaultProps;

export default HeaderBid;