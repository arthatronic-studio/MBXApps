import React, {useState, useEffect} from 'react';
import {View, useWindowDimensions, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ImagesPath from './ImagesPath'

import {Text, TouchableOpacity, useColor} from '@src/components';
import {FormatMoney} from '@src/utils';
import {shadowStyle} from '@src/styles';
import {Container, Divider, Row} from 'src/styled';

const MyRank = props => {
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
          <Text size={8} type='reguler'>
            Level Kamu
          </Text>
          <Divider height={4}/>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={ImagesPath.ranking} style={{width: 32, aspectRatio: 1, resizeMode: 'contain'}}/>
            <Divider width={4}/>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
              <Text size={14} type="bold" color="#4579E6">
                Pemula
              </Text>
              <Text size={10} color="#999999">
                Rank 5
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'column', padding: 8, borderRadius:8, backgroundColor: "#E6E9F2", alignItems: 'flex-start'}}>
          <Text size={8}>
            Poin Kamu
          </Text>
          <Divider height={4}/>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: "#761AAB", opacity: 0.4 }}>
              <Text size={13} color="#000000">P</Text>
            </View>
            <Divider width={5}/>
            <Text size={17} type="bold">
              2.350
            </Text>
            <Divider width={8}/>
            <TouchableOpacity onPress={() => {}}>
              <Text size={8} color="#3C58C1" style={{textDecorationLine: 'underline'}}>
                Lihat Detail
              </Text>
            </TouchableOpacity>
            <Divider width={12}/>
          </View>
        </View>
      </Row>
    </Container>
  );
};

export default MyRank;
