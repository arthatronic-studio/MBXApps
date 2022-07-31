import React from 'react';
import { View, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';

import {
  Text,
  useColor,
} from '@src/components';

const defaultProps = {
  isMeModerator: false,
  onPressOptions: () => {},
};

const CardGroupMember = ({ item, isMeModerator, onPressOptions }) => {
  const { Color } = useColor();

  return (
    <View
      style={{
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: item.image }}
            style={{
              borderRadius: 25,
              width: 50,
              height: 50,
              backgroundColor: Color.border,
              borderColor: Color.primary,
              marginRight: 8
            }}
          />
          <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text type="bold">{item.fullname}</Text>
            <Text size={10}>{moment(item.createdDate).format('DD MMM YYYY')}</Text>
          </View>
        </View>

        {isMeModerator && <Feather
          onPress={() => {
            onPressOptions();
          }}
          name='more-vertical'
          size={20}
        />}
      </View>
    </View>
  )
}

CardGroupMember.defaultProps = defaultProps;
export default CardGroupMember;