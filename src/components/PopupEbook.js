import React from 'react';
import { View, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import {
    Header,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor
} from '@src/components';

import Text from '@src/components/Text';

import Feather from 'react-native-vector-icons/Feather';

import ImagesPath from 'src/components/ImagesPath';

const PopupEbook = ({navigation}) => {
  const {Color} = useColor()
  return (
      <View style={{backgroundColor: '#fff'}}>
        <View style={{width: '100%', paddingHorizontal: 16, paddingVertical: 24}}>
            <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 16}}>
                    <Image source={ImagesPath.eBook} />
                </View>
                <View>  
                    <View style={{width: '86%'}}>
                        <Text align='left' size={14} style={{fontWeight: 'bold'}}>Seni adalah ledakan</Text>

                    </View>
                    <Text align='left' size={10}>Karya Esa Riski Hari Utama</Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row', marginTop: 12, marginRight: 20}}>
                            <Image source={ImagesPath.eye} style={{width: 16, height: 16, marginRight: 9}} />
                            <Text align='left' size={10}>1.7K</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 12}}>
                            <Image source={ImagesPath.thumbsUp} style={{width: 16, height: 16, marginRight: 9}} />
                            <Text align='left' size={10}>240</Text>
                        </View>
                    </View>
                    <View style={{marginTop: 16}}>
                        <Text align='left' size={11} style={{fontWeight: 'bold'}}>Sinopsis</Text>
                    </View>
                    <View style={{width: '80%'}}>
                        <Text align='left' size={10} numberOfLines={4}>
                        Seni adalah sebuah ledakan merupakan ungkapan asli dari seniman abstrak terkenal Jepang Taro Okamoto. Ungkapan tersebut diucapkan oleh Deidara Akatsuki (tokoh dari novel manga terkenal asal jepang “Naruto).
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                <View style={{width: 44, height: 44, borderRadius: 21, borderWidth: 0.3, alignItems:'center', justifyContent: 'center'}}>
                    <Image source={ImagesPath.thumbsUp} style={{width: 22, height: 22}} />
                </View>
                <Submit
                    buttonLabel='Baca Sekarang'
                    buttonColor={Color.primary}
                    type='bottomSingleButton'
                    buttonBorderTopWidth={0}
                    style={{backgroundColor: Color.theme, paddingTop: 25, paddingBottom: 25, width: 250}}
                    onPress={() => navigation.navigate('PDFReaderScreen', { file: 'http://samples.leanpub.com/thereactnativebook-sample.pdf' })}
                />
            </View>
        </View>
      </View>
  );
};

export default PopupEbook;
