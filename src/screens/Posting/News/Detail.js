import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView, ImageBackground} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {useLoading, usePopup, useColor} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';

import {Divider} from '@src/styled';
import {shadowStyle} from '@src/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {iconWarning, iconHeart, iconShare, iconBookmarks} from '@assets/images/home';

const Example = Styled(View)`
`;

export default ({navigation, route}) => {
  const {item} = route.params;

  const [state, setState] = useState();

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  const [liked, setLike] = useState(false);

  const {Color} = useColor();

  const ref = useRef();

  useEffect(() => {}, []);

  console.log('routeeeee', route);
  console.log(item);

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      iconRightButton={
          <Image source={iconBookmarks} height={70} width={70}/>
      }
      loadingProps={loadingProps}>
      
      <ScrollView>
        {/* <View style={{padding: 16}}>
                    <Text size={24} type='bold' align='left' lineHeight={32}>
                        {item.productName}
                    </Text>
                </View> */}
        {/* <View style={{paddingHorizontal: 16}}>
                    <View style={{paddingVertical: 4, width: 100, borderWidth: 0.5, borderRadius: 8, borderColor: Color.primary}}>
                        <Text size={10} color={Color.primary}>
                            {item.productCategory}
                        </Text>
                    </View>
                </View> */}

        {/* <Divider /> */}

        <ImageBackground
          source={{uri: item.image}}
          style={{
            width: '100%',
            aspectRatio: 1.5,
            backgroundColor: Color.border,
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '70%',
              paddingLeft: 10,
              paddingBottom: 20,
            }}>
            <Text
              style={{fontWeight: 'bold', color: Color.textInput}}
              align="left"
              size={19}>
              {item.productName}
            </Text>
            <Text style={{color: Color.textInput}} align="left" size={11}>
              Ditulis oleh {item.fullname}
            </Text>
          </View>
        </ImageBackground>

        <View style={{padding: 16}}>
          <Text lineHeight={24} align="left">
            &nbsp;&nbsp;&nbsp;&nbsp;
            {item.productDescription}
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                height: 70,
                width: 70,
                borderRadius: 35,
                backgroundColor: Color.textInput,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setLike(!liked)}
                style={{
                  height: 70,
                  width: 70,
                  borderRadius: 35,
                  backgroundColor: Color.textInput,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={iconHeart} />
              </TouchableOpacity>
            </View>
            <Text size={12}>Suka</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                height: 70,
                width: 70,
                borderRadius: 35,
                backgroundColor: Color.textInput,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={iconShare} />
            </TouchableOpacity>
            <Text size={12}>Share</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                height: 70,
                width: 70,
                borderRadius: 35,
                backgroundColor: Color.textInput,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={iconWarning} />
            </TouchableOpacity>
            <Text size={12}>Lapor</Text>
          </View>
        </View>
        <Divider />
      </ScrollView>

      {/* <View style={{padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.textInput, ...shadowStyle, shadowOpacity: 0.2}}>
                <SimpleLineIcons name='share' size={20} color={Color.text} />
                <Ionicons name='heart-outline' size={24} color={Color.text} />
            </View> */}
    </Scaffold>
  );
};
