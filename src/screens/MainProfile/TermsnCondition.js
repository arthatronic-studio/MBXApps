
import React from 'react';
import { View} from 'react-native';
import {
    Header,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor,
    Text,
    Button
} from '@src/components';
import { CurrentRenderContext } from '@react-navigation/native';


const TermsnCondition = ({navigation}) => {
    const {Color} = useColor()
    return (
        
        <View style={{ backgroundColor: '#2C2C2C'  }}> 
            <Header 
                title="Syarat & Ketentuan"
                backgroundColor= '#2C2C2C'
                color={'#FFFFFE'}
                size={'24'}
            />
            <Text align='left' style={{ paddingLeft: 20, paddingTop: 20 }} type='bold'  size ='18px' color={'#FFFFFE'}>
                1. Disclaimer
            </Text>
            <Text align='center' style={{  marginLeft: 20, marginRight:20 }}color={'#CDD1D2'}>
            Cookie donut dessert dessert bonbon. Tiramisu sweet dessert icing candy canes dessert. Pudding sweet chocolate cake chocolate topping sweet chocolate bar cotton candy. Wafer wafer candy lemon drops cheesecake gingerbread gingerbread brownie. Powder chocolate shortbread chocolate pudding jelly-o jujubes chocolate bar. Croissant lollipop powder cupcake pudding chocolate cake sweet roll ice cream. Brownie tiramisu cotton candy chocolate cake jelly beans marzipan pie.
            </Text>
            
            <Submit
                    buttonLabel='Saya Setuju'
                    buttonColor={Color.gray}
                    type='bottomSingleButton'
                    align='center'
                    style={{backgroundColor: Color.grayLi, paddingTop: 380, paddingBottom: 25, width: 395}}
                    onPress={() => navigation.navigate('MainProfile')}
                />
        </View>
    );
}

export default TermsnCondition;