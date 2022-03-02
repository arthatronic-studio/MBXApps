import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {useNavigation} from '@react-navigation/native';

import {
  Text,
  TouchableOpacity,
  useColor,
} from '@src/components';
import {shadowStyle} from '@src/styles';
import {Container} from '@src/styled';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { listMenuHome } from 'src/screens/MainHome/staticMenuHome';
import { useSelector } from 'react-redux';

const SambatanMenuView = Styled(View)`
  width: 100%;
  borderRadius: 8px;
  paddingTop: 24px;
  paddingHorizontal: 8px;
  flexDirection: row;
  flexWrap: wrap;
`;

const CardMenu = Styled(TouchableOpacity)`
  flexDirection: column;
  marginBottom: 12px;
`;

const UserIcon = Styled(View)`
  height: 100%;
  justifyContent: flex-start;
  alignItems: center;
`;

const ImageProperty = Styled(Image)`
  height: 50%;
  aspectRatio: 1;
  marginBottom: 6;
`;

const ComingSoonContainer = Styled(View)`
  width: 100%;
  justifyContent: center;
  alignItems: center;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: -24;
`;

const ComingSoonView = Styled(View)`
  borderRadius: 30;
  padding: 0px 5px 2px 5px;
  justifyContent: center;
  alignItems: center;
`;

const WidgetMenuHome = (props) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const user = useSelector(state => state['user.auth'].login.user);

  const renderComingSoon = () => {
    return (
      <ComingSoonContainer>
        <ComingSoonView style={{backgroundColor: Color.border}}>
          <Text size={8}>Coming Soon</Text>
        </ComingSoonView>
      </ComingSoonContainer>
    );
  };

  const renderMenuBadge = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: -6,
          right: 16,
        }}>
        <ComingSoonView style={{backgroundColor: Color.red}}>
          <Text size={8} color={Color.textInput}>
            New
          </Text>
        </ComingSoonView>
      </View>
    );
  };

  let menuRealLength = 0;
  listMenuHome.map((e) => e.show ? menuRealLength +=1 : null);
  let widthMenu = menuRealLength < 4 ? 100 / menuRealLength : 25;

  return (
    <Container paddingHorizontal={16}>
      <SambatanMenuView
        style={{...shadowStyle, backgroundColor: Color.textInput}}>
        {listMenuHome.map((menu, idx) => {
          if (!menu.show || (Platform.OS === 'ios' && menu.comingsoon)) {
            return null;
          }

          return (
            <CardMenu
              key={idx}
              activeOpacity={0.75}
              disabled={menu.comingsoon}
              onPress={() => {
                props.onPress(menu);

                if (menu.nav === '') return;
                navigation.navigate(menu.nav, menu.params);
                GALogEvent(menu.name, {
                  id: menu.code,
                  product_name: menu.name,
                  user_id: user.userId,
                  method: analyticMethods.viewAll,
                });
              }}
              style={{
                width: `${widthMenu}%`,
                aspectRatio: menuRealLength,
              }}
            >
              <UserIcon>
                <ImageProperty
                  style={menu.comingsoon ? {opacity: 0.3} : {} }
                  resizeMode="contain"
                  source={menu.images}
                />
                <Text size={12} style={menu.comingsoon && {opacity: 0.3}}>
                  {menu.name}
                </Text>
                {/* {(menu.comingsoon || menu.nav === '') && renderComingSoon()} */}
                {menu.badge && renderMenuBadge()}
              </UserIcon>
            </CardMenu>
          );
        })}
      </SambatanMenuView>
    </Container>
  );
};

export default WidgetMenuHome;
