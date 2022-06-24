import React, {useState, useEffect} from 'react';
import {View, useWindowDimensions, Image, ImageBackground} from 'react-native';
import {useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ImagesPath from './ImagesPath'

import {Text, TouchableOpacity, useColor} from '@src/components';
import {FormatMoney} from '@src/utils';
import {shadowStyle} from '@src/styles';
import {Container, Divider, Row} from 'src/styled';

const MemberRank = props => {
  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  return (
    <Container
      padding={10}
      marginHorizontal={16}
      radius={8}
      color={Color.textInput}
      style={{...shadowStyle}}>
      <Row justify="space-between">
        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Text size={10} type='reguler' color="#999999">
            Sambut Member Baru
          </Text>
          <Divider height={4}/>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={ImagesPath.avatar1} style={{width: 32, aspectRatio: 1, resizeMode: 'contain'}}/>
            <Image source={ImagesPath.ranking} style={{width: 14, aspectRatio: 1, resizeMode: 'contain', position: 'absolute', top: 12, left: 20}}/>
            <Divider width={10}/>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
              <Text size={14} type="bold">
                Helena Helinsky
              </Text>
              <Text size={10} color="#4579E6">
                Pemula
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Text size={10} type='reguler' color="#999999">
            Member Terbaik Bulan Ini
          </Text>
          <Divider height={4}/>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={ImagesPath.avatar2} style={{width: 32, aspectRatio: 1, resizeMode: 'contain'}}/>
            <Image source={ImagesPath.ranking} style={{width: 14, aspectRatio: 1, resizeMode: 'contain', position: 'absolute', top: 12, left: 20}}/>
            <Divider width={10}/>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
              <Text size={14} type="bold">
                Roger Danuarta
              </Text>
              <Text size={10} color="#4579E6">
                Veteran
              </Text>
            </View>
          </View>
        </View>
      </Row>
    </Container>
  );
};

export default MemberRank;
