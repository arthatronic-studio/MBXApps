import React, { useState, useEffect } from "react";
import { View, FlatList, Animated } from 'react-native';
import Moment from 'moment';

import { Scaffold, TouchableOpacity, Text, useColor } from "src/components";
import { Divider } from "src/styled";

const objDummy = { id: 1, title: 'Pembayaran', body: 'halo semua, lorem ipsum dolor sit amet amet woi cak cuk cik cok' };

const NotificationScreen = ({ navigation, route }) => {
  const { Color } = useColor();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(new Array(10).fill(objDummy));
  }, []);

  const renderPopUpNavigation = () => {
    return (
      <Animated.View
        style={[
          {position: 'absolute', bottom: 20, height: 36, width: '40%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center'},
        ]}
      >
        <View style={{width: '100%', height: 36, backgroundColor: Color.primary, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
            shadowColor: "#00000029",
            shadowOffset: { width: 0, height: 2, },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <TouchableOpacity
              onPress={() => {}}
              style={{alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}
              activeOpacity={0.75}
            >
              <Text color={Color.textInput}>Baca Semua</Text>
            </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  const onSelectNotif = (item) => {
    navigation.navigate('NotificationDetail', { id: item.id });
  }
    
  return (
    <Scaffold
      headerTitle='Notifikasi'
    >
      <FlatList
        keyExtractor={(item, index) => item.id+index.toString()}
        data={history}
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

      {renderPopUpNavigation()}
    </Scaffold>
  );
}

export default NotificationScreen;