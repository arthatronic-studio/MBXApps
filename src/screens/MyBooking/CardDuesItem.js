import React from 'react';
import { View } from 'react-native';
import Styled from 'styled-components';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import FormatMoney from '@src/utils/FormatMoney';
import { TouchableOpacity } from '@src/components/Button';

const MainView = Styled(TouchableOpacity)`
    padding: 16px;
    alignItems: center;
    width: 100%;
`;

const Container = Styled(View)`
    width: 100%;
    justifyContent: space-between;
    flexDirection: row;
    flexWrap: wrap;
`;

const ContainerLeft = Styled(View)`
    alignItems: flex-start;
    justifyContent: center;
    width: 58%;
`;

const ContainerRight = Styled(View)`
    alignItems: flex-end;
    justifyContent: center;
    width: 40%;
`;

const CardDuesItem = (props) => {
    const {
        booking,
        onPress,
        marginBottom,
    } = props;

    const { Color } = useColor();

    const hasName = booking.name !== null;

    let payment_status = '';
    let payment_status_color = Color.text;
    let transaction_id = '';
    let due_date_label = '';

    if (booking && booking.vestaBiller) {
        payment_status = booking.vestaBiller.payment_status;
        payment_status_color = booking.vestaBiller.payment_status_color;
        transaction_id = booking.vestaBiller.transaction_id;
        due_date_label = booking.vestaBiller.due_date_label;
    }
    
    return (
        <MainView
            onPress={() => onPress()}
            style={{
                marginBottom: typeof marginBottom !== 'undefined' ? marginBottom : 16,
            }}
        >
            <Container>
                <ContainerLeft>
                    {hasName && <Text size={15} lineHeight={15} align='left'>{booking.name}</Text>}
                </ContainerLeft>
                <ContainerRight style={{justifyContent: 'flex-start'}}>
                    <Text size={10} lineHeight={15}>{due_date_label}</Text>
                </ContainerRight>

                <ContainerLeft>
                    <Text size={10} align='left' style={{color: Color.text, marginVertical: 4}}>{transaction_id || booking.invoiceNumber}</Text>
                </ContainerLeft>
                <ContainerRight>
                </ContainerRight>

                <ContainerLeft>
                    <Text type='semibold' size={19} style={{color: Color.text}}>
                        {FormatMoney.getFormattedMoney(booking.amount)}
                    </Text>
                </ContainerLeft>
                <ContainerRight>
                    <Text type='semibold' size={15} style={{color: payment_status_color}}>{payment_status}</Text>
                </ContainerRight>
            </Container>
        </MainView>
    )
}

export default CardDuesItem;