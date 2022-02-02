import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor,
} from '@src/components';
import { FormatMoney } from '@src/utils';
import { shadowStyle } from '@src/styles';
import Client from '@src/lib/apollo';
import { queryVestaBalance, queryVestaOpenBalance } from '@src/lib/query/payment';
import { Container, Row } from 'src/styled';

const WidgetBalance = (props) => {
    // state
    const [vestaAmount, setVestaAmount] = useState(0);
    const [wallet, setWallet] = useState('CLOSE');

    const user = useSelector(state => state['user.auth'].login.user);
    const { Color } = useColor();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const {width} = useWindowDimensions();

    useEffect(() => {
        if (isFocused) {
            componentWillFocus();
        }
    }, [isFocused]);

    const componentWillFocus = () => {
        if (user && !user.guest) {
            getVestaBalance();
        }
    };

    const getVestaBalance = () => {
        Client.query({ query: queryVestaBalance })
            .then((res) => {
                setVestaAmount(res.data.vestaBalance.amount || 0);
                setWallet(res.data.vestaBalance.wallet);
            })
            .catch((err) => {
                console.log(err, 'err get vesta balance');
            });
    };

    const openVesta = () => {
        Client.query({ query: queryVestaOpenBalance })
            .then((res) => {
                if (res.data.vestaOpenBalance.success) {
                    setWallet('OPEN');
                }

                navigation.navigate('TopUpScreen');
            })
            .catch((err) => {
                console.log('err', err);
            });
    };

    const isWalletClose = wallet === 'CLOSE';

    return (
        <Container
            padding={16}
            marginHorizontal={16}
            radius={8}
            color={Color.textInput}
            style={{...shadowStyle}}
        >
            <Row justify='space-between'>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text size={10}>Saldoku</Text>
                    <Text size={18} type="semibold" style={{ marginTop: 2 }}>
                        {FormatMoney.getFormattedMoney(vestaAmount)}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }}>

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 16,
                        }}>
                        <TouchableOpacity
                            style={{
                                aspectRatio: 1,
                                height: width * 0.07,
                                borderRadius: 4,
                                backgroundColor: Color.primary,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 4,
                            }}
                            onPress={() => {
                                if (isWalletClose) {
                                    openVesta();
                                    return;
                                }
                                
                                navigation.navigate('TopUpScreen');
                            }}>
                            <Ionicons name="add" color={Color.textInput} size={24} />
                        </TouchableOpacity>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <Text size={9} type="medium" color={Color.text}>
                                Top Up
                            </Text>
                        </View>
                    </View>
                </View>
            </Row>
        </Container>
    );
};

export default WidgetBalance;