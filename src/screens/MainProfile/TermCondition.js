import React from 'react';
import { View, ScrollView } from 'react-native';
import {
    Header,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor,
    Text,
    Button,
    Scaffold
} from '@src/components';
import { CurrentRenderContext } from '@react-navigation/native';
import { Container, Divider } from 'src/styled';


const TermsCondition = ({navigation}) => {
    const {Color} = useColor();

    return (
        <Scaffold
            headerTitle='Syarat & Ketentuan'
        >
            <ScrollView>
                <Container padding={16}>
                    <Text align='left' type='bold' size={18}>
                        1. Disclaimer
                    </Text>
                    <Divider />
                    <Text align='center'>
                        Cookie donut dessert dessert bonbon. Tiramisu sweet dessert icing candy canes dessert. Pudding sweet chocolate cake chocolate topping sweet chocolate bar cotton candy. Wafer wafer candy lemon drops cheesecake gingerbread gingerbread brownie. Powder chocolate shortbread chocolate pudding jelly-o jujubes chocolate bar. Croissant lollipop powder cupcake pudding chocolate cake sweet roll ice cream. Brownie tiramisu cotton candy chocolate cake jelly beans marzipan pie.
                    </Text>
                </Container>
            </ScrollView>
            <Submit
                buttonLabel='Saya Setuju'
                buttonColor={Color.primary}
                type='bottomSingleButton'
                align='center'
                style={{backgroundColor: Color.grayLi, paddingTop: 380, paddingBottom: 25, width: 395}}
                onPress={() => navigation.pop()}
            />
        </Scaffold>
    );
}

export default TermsCondition;