import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, Dimensions } from 'react-native';
import Styled from 'styled-components';
import {
    Header,
    Text,
    useColor
} from '@src/components';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';

import {
    imageBlank,
} from '@assets/images';

const MainView = Styled(View)`
    flex: 1;
`;

const windowWidth = Dimensions.get('window').width;

const DetailEbookScreen = ({ route, navigation }) => {
    const { code } = route.params;

    const [item, setItem] = useState();
    const [imageSize, setImageSize] = useState({width: '100%', height: 0});

    const { Color } = useColor();
    
    useEffect(() => {
        Client.query({
            query: queryContentProduct,
            variables: {
                productCode: code
            }
          })
          .then((res) => {
            console.log(res, 'res detail');
      
            if (res.data.contentProduct.length > 0) {
                setItem(res.data.contentProduct[0]);
                Image.getSize(res.data.contentProduct[0].image, (width, height) => {
                    let result = 0;
                    if (windowWidth > width) {
                        result = height + (windowWidth - width);
                    } else {
                        result = height - (width - windowWidth);
                    }

                    setImageSize({ height: result });
                });
            }
          })
          .catch((err) => {
              console.log(err, 'err detail');
          });
    }, []);

    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <ScrollView>
                <View style={{width: '100%', aspectRatio: 0.75, backgroundColor: Color.gray}}>
                    <Image
                        source={item && item.image ? { uri: item.image } : imageBlank}
                        style={{width: '100%', height: '100%'}}
                    />
                </View>
                        
                <View style={{width: '100%', marginTop: 36, paddingHorizontal: 16}}>
                    <Text size={18} align='left' color={Color.theme}>{item ? item.productName : ''}</Text>
                    <Text size={12} align='left' color={Color.theme}>{item ? item.productDescription : ''}</Text>
                </View>
            </ScrollView>
 
            <Header transparentMode style={{position: 'absolute', top: 0}} />
        </MainView>
    )
}

export default DetailEbookScreen;