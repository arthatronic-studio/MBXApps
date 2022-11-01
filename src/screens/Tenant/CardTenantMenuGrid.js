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
import { Container, Divider } from 'src/styled';
import { shadowStyle } from 'src/styles';
import { imageContentItem } from 'assets/images/content-item';
import { fetchFavoriteProduct } from 'src/api-rest/fetchFavoriteProduct';

const defaultProps = {
  numColumns: 2,
  onPress: () => { },
  cartProductQuantity: 0,
};

const CardTenantMenuGrid = ({ item, index, numColumns, onPress, cartProductQuantity }) => {
  const { Color } = useColor();
  const navigation = useNavigation();

  const [quantity, setQuantity] = useState(cartProductQuantity);
  const [productLike, setProductLike] = useState(0);
  const [isProductLike, setIsProductLike] = useState(false);

  useEffect(() => {
    setQuantity(cartProductQuantity);
  }, [cartProductQuantity]);

  const isLeft = (index + 1) % numColumns === 0;
  let imageUrl = '';
  if (Array.isArray(item.images) && item.images.length > 0) {
    imageUrl = item.images[0];
  }

  return (
    <View
      key={index}
      style={{ width: `${100 / numColumns}%`, paddingTop: 8 }}
    >
      <TouchableOpacity
        onPress={() => {
          onPress();
        }}
        style={{
          width: '100%',
          paddingLeft: isLeft ? 8 : 0,
          paddingRight: isLeft ? 0 : 8,
        }}
      >
        <View
          style={{
            backgroundColor: Color.textInput,
            ...shadowStyle,
          }}
        >
          <View style={{ width: '100%', aspectRatio: 1 }}>
            <Image
              source={{ uri: imageUrl }}
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </View>

          <Container paddingTop={12} paddingBottom={8} paddingHorizontal={8}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
              {quantity > 0 && (
                <View style={{ width: 18, height: 18, borderRadius: 18 / 2, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center', marginRight: 4, }}>
                  <Text size={12} type='bold' color={Color.textButtonInline}>{quantity}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text size={14} type='medium' align='left' numberOfLines={1} lineHeight={18}>{item.name}</Text>
              </View>
            </View>

            <View style={{ marginTop: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
              <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text size={12} type='medium'>{FormatMoney.getFormattedMoney(item.total_price)}</Text>
                {item.total_price != item.price &&
                  <Text size={10} type='medium' style={{ textDecorationLine: 'line-through' }}>{FormatMoney.getFormattedMoney(item.price)}</Text>
                }
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{height: 24, width: 24, padding: 4,}}>
                  <TouchableOpacity
                    onPress={async () => {
                      const body = {
                        product_id: item.id
                      }
                      const res = await fetchFavoriteProduct(body);
                      console.log(res, "resssss")
                      if (res.status) {
                        if (isProductLike) {
                          setProductLike(productLike - 1);
                        } else {
                          setProductLike(productLike + 1);
                        }
                        setIsProductLike(!isProductLike)
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: Color.textInput,
                      borderColor: Color.text,
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      source={isProductLike ? imageContentItem.heart_active : imageContentItem.heart_nonactive}
                      style={{
                        height: 10,
                        width: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <Image
                  source={imageAssets.addBox}
                  style={{
                    height: 24,
                    width: 24,
                    resizeMode: 'contain'
                  }}
                />
              </View>
            </View>
          </Container>
        </View>
      </TouchableOpacity>
    </View>
  )
}

CardTenantMenuGrid.defaultProps = defaultProps;
export default CardTenantMenuGrid;