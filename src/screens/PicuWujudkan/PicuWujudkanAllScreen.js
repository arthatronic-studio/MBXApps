import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import {Scaffold, Text} from 'src/components';
import ListPicuWujudkan from './ListPicuWujudkan';

const PicuWujudkanAllScreen = ({navigation, route}) => {
  const param = route.params;
    const {height, width} = useWindowDimensions();

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}>
      <ListPicuWujudkan
        style={{
          paddingBottom: height / 7,
        }}
        title={`ALL ${param.contentName}`}
        category={param.category}
      />
    </Scaffold>
  );
};

export default PicuWujudkanAllScreen;
