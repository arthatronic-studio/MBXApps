import {View, Text} from 'react-native';
import React from 'react';
import {Scaffold, Header, useColor} from 'src/components';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';
const Saved = ({navigation, route}) => {
  const {Color} = useColor();
  // const { title, userProfileId } = route.params;
  return (
    <Scaffold
      style={{backgroundColor: Color.border}}
      header={
        <Header
          customIcon
          title="Artikel Tersimpan"
          type="regular"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <ListContentProductV2
        productCategory="ARTIKEL"
        name="Artikel tersimpan"
        saved={true}
      />
    </Scaffold>
  );
};

export default Saved;
