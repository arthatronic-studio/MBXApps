import React from 'react';
import {View, Image} from 'react-native';
import {useColor} from '@src/components/Color';
import {Text, TouchableOpacity} from '@src/components';

import ImagesPath from 'src/components/ImagesPath';

const CardForumPopular = ({item}) => {
  const {Color} = useColor();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity style={{flexDirection: 'row'}}>
        <View
          style={{
            height: 36,
            width: 36,
            backgroundColor: Color.grayLight,
            borderRadius: 4,
            marginRight: 10,
          }}
        />
        <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 2,
            }}>
            <Image source={ImagesPath.trendUp} style={{marginRight: 10}} />
            <Text size="11">{item.title}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{height: 16, width: 16, marginRight: 4}}
              source={ImagesPath.iconTypeG}
            />
            <Text size="8"> {item.subtitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text size="11" style={{color: Color.primary}}>
          Lihat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CardForumPopular;
