import React, { useEffect, useState, useRef } from 'react';
import { View, Image, TextInput, useWindowDimensions, Animated, Keyboard } from 'react-native';
import Moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Col, Row, Scaffold, Text, Header } from '@src/components';
import { useColor } from '@src/components/Color';
import { Container, Divider, MainView } from 'src/styled';
import ImagesPath from 'src/components/ImagesPath';

const CardKutipan = ({ tagged, item }) => {
  const { Color } = useColor();
  const { height } = useWindowDimensions();

  if (tagged) {
    return (
      <View
        style={{
          backgroundColor: '#3C58C11A',
          borderRadius: 4,
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingHorizontal: 8,
            paddingBottom: 8,
            borderRadius: 8,
          }}
        >
          <View style={{ width: '100%' }}>
            <Container align='flex-start' paddingVertical={8}>
              <Text size={10} color={Color.placeholder}>Mengutip</Text>
            </Container>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {typeof item.fullname === 'string' && <Text size={12} align='left' type='bold'>{item.fullname.trim()}</Text>}

              {item.isDirector && <Image
                source={ImagesPath.ranking}
                style={{
                  width: 14,
                  height: 14,
                }}
              />}
            </View>
  
            <Divider height={4} />
  
            <Text size={12} align='left' type='medium' numberOfLines={1}>{item.comment}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: 16,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          padding: 8,
          borderColor: Color.border,
          borderWidth: 1,
          borderRadius: 8,
        }}
      >
        <View style={{ width: '15%', alignItems: 'center' }}>
          <Image source={{ uri: item.image }} style={{ width: '100%', aspectRatio: 1, borderRadius: 50, backgroundColor: Color.primary }} />
        </View>

        <View style={{ width: '85%', padding: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {typeof item.fullname === 'string' && <Text size={12} align='left' type='bold'>{item.fullname.trim()}</Text>}
            {item.isDirector && <Image
              source={ImagesPath.ranking}
              style={{
                width: 14,
                height: 14,
              }}
            />}
            <Text size={8} align='left'>{' • '}{Moment(parseInt(item.commentDate)).format('dddd, HH:mm')}</Text>
          </View>

          <Divider height={4} />

          <Text size={12} align='left' type='medium' numberOfLines={1}>{item.comment}</Text>
        </View>
      </View>
    </View>
  );
};

export default CardKutipan;
