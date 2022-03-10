import React from 'react';
import {View, ScrollView, TextInput} from 'react-native';
import Styled from 'styled-components';

import {Scaffold} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';

import {queryContentProduct} from '@src/lib/query';
import {useColor} from '@src/components/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ListForumSearch from './ListForumSearch';
import ListForumPopular from './ListForumPopular';

const BottomSection = Styled(View)`
  width: 100%;
  padding: 16px;
  flexDirection: row;
  alignItems: center;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 100%;
  backgroundColor: #FFFFFF;
  padding: 4px 16px 4px 16px;
  borderRadius: 32px;
  borderWidth: 0.5px;
  flexDirection: row;
`;

const TextInputNumber = Styled(TextInput)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  height: 40px;
`;

const CircleSend = Styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  borderRadius: 20px;
  justifyContent: center;
  alignItems: center;
  
`;

const DATA = [
  {
    id: 1,
    title: 'Gaming',
  },
  {
    id: 2,
    title: 'Coding',
  },
  {
    id: 3,
    title: 'Programmer',
  },
  {
    id: 4,
    title: 'Caferacer',
  },
];

const DATA_POPULER = [
  {
    id: 1,
    title: 'Sabyan',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
  {
    id: 2,
    title: 'Tribesocial',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
  {
    id: 3,
    title: 'Karang Taruna',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
  {
    id: 4,
    title: 'Dunia Paralel',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
];

// DATA.map((item)=>{
//   console.log("ini data bos",item.id)
// })

const ForumSearch = ({navigation, route}) => {
  const {Color} = useColor();
  return (
    <Scaffold
      header={
        <BottomSection style={{borderColor: Color.border}}>
          <BoxInput
            style={{
              backgroundColor: Color.textInput,
              borderColor: Color.border,
            }}>
            <TextInputNumber
              name="text"
              placeholder="Cari Topik apa kali ini  . . ."
              placeholderTextColor={Color.placeholder}
              returnKeyType="done"
              returnKeyLabel="Done"
              blurOnSubmit={false}
              onBlur={() => {}}
              error={null}
              onChangeText={text => {}}
              style={{
                backgroundColor: Color.textInput,
                color: Color.text,
              }}
            />
            <CircleSend
              style={{backgroundColor: Color.primary}}
              onPress={() => {}}>
              <Ionicons name="search" size={16} color={Color.text} />
            </CircleSend>
          </BoxInput>
        </BottomSection>
      }>
      <ScrollView>
        {/* LIST SEARCH */}
        <ListForumSearch data={DATA} />

        {/* EMPTY SEARCH */}

        {/* <Col style={{alignItems:'center',justifyContent:'space-around',height:90}}>
          <Row>
            <Image source={ImagesPath.searchEmpty} />
          </Row>
          <Row>
            <Text size="10" style={{color: Color.gray}}>
              Belum ada hasil pencarian terbaru
            </Text>
          </Row>
      
        </Col> */}

        <View paddingHorizontal={16}>
          {/* LIST POPULAR */}
          <ListForumPopular data={DATA_POPULER} />
        </View>
      </ScrollView>
    </Scaffold>
  );
};

export default ForumSearch;
