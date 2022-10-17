import React, { useState, useEffect, useRef } from 'react';
import { Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import imageAssets from 'assets/images';
import { FormatMoney } from 'src/utils';

const defaultProps = {
    numColumns: 2,
    onPress: () => {},
    cartProductQuantity: 0,
};

const CardTenantMenuList = ({ item, index, numColumns, onPress, cartProductQuantity }) => {
    const { Color } = useColor();
    const navigation = useNavigation();

    const [quantity, setQuantity] = useState(cartProductQuantity);

    useEffect(() => {
      setQuantity(cartProductQuantity);
    }, [cartProductQuantity]);

    let orderNumber = (index + 1).toString();
    if (orderNumber.length <= 1) orderNumber = '0'+orderNumber;
    
    return (
        <View
            key={index}
            style={{ width: `${100/numColumns}%`, paddingVertical: 8 }}
        >
            <TouchableOpacity
                onPress={() => {
                  onPress();
                }}
                style={{ width: '100%', flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 12, borderColor: Color.primary }}
            >
                <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text size={11} type='medium' color={Color.textSoft}>{orderNumber}</Text>
                </View>
                <View style={{flex: 7, alignItems: 'flex-start', justifyContent: 'center', paddingRight: 8}}>
                    <Text size={14} type='medium' align='left' numberOfLines={2}>{item.name}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {quantity > 0 && (
                      <View style={{width: 16, height: 16, borderRadius: 16/2, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8}}>
                        <Text size={9} type='bold' color={Color.textInput}>{quantity}</Text>
                      </View>
                    )}
                    <Text size={11} type='medium' color={Color.textSoft}>{FormatMoney.getFormattedMoney(item.price)}</Text>
                    <Image
                      source={imageAssets.addBox}
                      style={{
                        height: 24,
                        width: 24,
                        marginLeft: 4,
                      }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

CardTenantMenuList.defaultProps = defaultProps;
export default CardTenantMenuList;