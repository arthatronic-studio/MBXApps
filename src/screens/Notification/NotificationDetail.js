import React, { useEffect, useState } from "react";
import { View, FlatList } from 'react-native';
import Moment from 'moment';

import { Scaffold, TouchableOpacity, Text, useColor } from "src/components";
import { Divider } from "src/styled";

const NotificationDetail = ({ navigation, route }) => {
  const { Color } = useColor();
  
  const [item, setItem] = useState();

  useEffect(() => {
    setItem({
      id: 1, title: 'Pembayaran', body: 'halo semua, lorem ipsum dolor sit amet amet woi cak cuk cik cok lorem ipsum dolor sit amet amet woi cak cuk cik cok lorem ipsum dolor sit amet amet woi cak cuk cik cok'
    });
  }, []);
    
  return (
    <Scaffold
      headerTitle='Detail'
    >
      <FlatList
        keyExtractor={(item, index) => item.id+index.toString()}
        data={item ? [item] : []}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => onSelectNotif(item)}
              activeOpacity={0.75}
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
              <Text align='left'>{item.body}</Text>
              <Divider height={4} />
              <Text align='left' size={12}>{Moment().format('HH:mm')}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </Scaffold>
  );
}

export default NotificationDetail;