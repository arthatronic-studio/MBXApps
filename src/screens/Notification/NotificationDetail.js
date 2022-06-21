import React, { useEffect, useState } from "react";
import { View } from 'react-native';
import Moment from 'moment';

import { Scaffold, Text, useColor } from "src/components";
import { Divider } from "src/styled";

const NotificationDetail = ({ navigation, route }) => {
  const { Color } = useColor();
  
  const [item, setItem] = useState(route.params.item);

  useEffect(() => {
    
  }, []);
    
  return (
    <Scaffold
      headerTitle='Detail'
    >
      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: Color.textInput,
          borderColor: Color.border,
          borderWidth: 0.5,
        }}
      >
        <Text align='left' type='bold'>{item.title}</Text>
        <Divider height={4} />
        <Text align='left'>{item.text}</Text>
        <Divider height={4} />
        <Text align='left' size={12}>{Moment(item.date).format('DD-MM-YYYY HH:mm')}</Text>
      </View>
    </Scaffold>
  );
}

export default NotificationDetail;