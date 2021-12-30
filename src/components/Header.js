import React from 'react';
import {View, TouchableOpacity, TextInput, Image} from 'react-native';
import Styled from 'styled-components';
import {withNavigation} from '@react-navigation/compat';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCOmmunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import {
  Row,
  Col,
  Text,
  // TouchableOpacity,
  useColor,
} from '@src/components';
import ImagesPath from './ImagesPath';

const MainView = Styled(View)`
    width: 100%;
    height: 60px;
    elevation: 0;
    borderTopWidth: 4px;
`;

const TransparentMainView = Styled(MainView)`
    backgroundColor: transparent;
`;

const RowView = Styled(Row)`
    height: 100%;
`;

const ColumnView = Styled(Col)`
    justifyContent: center;
    alignItems: center;
`;

const TransparentBackView = Styled(View)`
    width: 100%;
    maxWidth: 74;
    minHeight: 25;
    justifyContent: center;
    alignItems: flex-end;
    paddingRight: 10;
    backgroundColor: #FFFFFF;
    borderTopRightRadius: 30;
    borderBottomRightRadius: 30;
`;

const SearchBar = Styled(TextInput)`
marginVertical: 6;
marginHorizontal : 10
`;

const LeftButton = Styled(TouchableOpacity)`
    height: 100%;
    width: 100%;
    paddingLeft: 16px;
    alignItems: flex-start;
    justifyContent: center;
`;

const RightButton = Styled(TouchableOpacity)`
    height: 100%;
    width: 100%;
    paddingRight: 16px;
    alignItems: flex-end;
    justifyContent: center;
`;

const defaultProps = {
  centerTitle: true,
  showLeftButton: true,
  showIconLeftButton: true,
  iconLeftButton: 'angle-left',
  actions: null,
};

const Header = props => {
  const {Color} = useColor();

  const onPressRightButton = () => {
    if (props.onPressRightButton) props.onPressRightButton();
  };

  const onPressLeftButton = () => {
    if (props.onPressLeftButton) props.onPressLeftButton();
    else props.navigation.pop();
  };

  const renderTransparentMode = () => {
    const {
      showLeftButton,
      showIconLeftButton,
      iconLeftButton,
      iconRightButton,
      children,
      ...style
    } = props;
    return (
      <TransparentMainView style={{borderColor: Color.theme, ...style}}>
        <RowView>
          <ColumnView size={2}>
            {showLeftButton ? (
              <LeftButton onPress={onPressLeftButton}>
                <TransparentBackView>
                  {showIconLeftButton && (
                    <Fontisto
                      name={iconLeftButton}
                      color={Color.primary}
                      size={18}
                    />
                  )}
                </TransparentBackView>
              </LeftButton>
            ) : (
              <View />
            )}
          </ColumnView>

          <ColumnView size={8}>{children || <View />}</ColumnView>

          <ColumnView size={2}>
            {iconRightButton ? (
              <RightButton onPress={onPressRightButton}>
                {iconRightButton}
              </RightButton>
            ) : (
              <View />
            )}
          </ColumnView>
        </RowView>
      </TransparentMainView>
    );
  };

  const renderActionsMode = () => {
    const {
      showLeftButton,
      showIconLeftButton,
      iconLeftButton,
      iconRightButton,
      titleRight,
      color,
      title,
      children,
      centerTitle,
      actions,
      ...style
    } = props;

    return (
      <MainView
        style={{
          backgroundColor: Color.textInput,
          borderColor: Color.theme,
          ...style,
        }}>
        <RowView>
          <ColumnView size={2}>
            {showLeftButton ? (
              <LeftButton onPress={onPressLeftButton}>
                {showIconLeftButton && (
                  <Fontisto
                    name={iconLeftButton}
                    color={color || Color.primary}
                    size={18}
                  />
                )}
              </LeftButton>
            ) : (
              <View />
            )}
          </ColumnView>

          <ColumnView
            size={10}
            style={{alignItems: 'flex-end', paddingRight: 16}}>
            {actions}
          </ColumnView>
        </RowView>
      </MainView>
    );
  };

  const renderNormalMode = () => {
    const {
      showLeftButton,
      hideLeftButton = false,
      showIconLeftButton,
      customIcon,
      searchbar,
      favoriteIcon,
      cartIcon,
      notifIcon,
      backgroundColor,
      type,
      iconLeftButton,
      iconRightButton,
      titleRight,
      color,
      title,
      children,
      centerTitle,
      ...style
    } = props;

    return (
      <MainView
        style={{
          backgroundColor: backgroundColor
            ? Color[backgroundColor]
            : Color.textInput,
          borderColor: Color.theme,
          ...style,
        }}>
        <RowView>
          {searchbar ? (
            <>
              {
                <View style={{width: '75%', justifyContent: 'center'}}>
                  {
                    <SearchBar
                      placeholder="Cari apa hari ini ..."
                      style={{
                        backgroundColor: 'white',
                        width: '92%',
                        height: '70%',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                      }}
                    />
                  }
                  {
                    <AntDesign
                      name={'search1'}
                      color={Color.gray}
                      size={13}
                      style={{
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        paddingHorizontal: 35,
                      }}
                    />
                  }
                </View>
              }
            </>
          ) : (
            <ColumnView size={2}>
              {showLeftButton ? (
                <LeftButton onPress={onPressLeftButton}>
                  {showIconLeftButton && (
                    <>
                      {customIcon ? (
                        <AntDesign
                          name={'arrowleft'}
                          color={color || Color.primary}
                          size={18}
                        />
                      ) : (
                        <Fontisto
                          name={iconLeftButton}
                          color={color || Color.primary}
                          size={18}
                        />
                      )}
                    </>
                  )}
                </LeftButton>
              ) : (
                <View />
              )}
            </ColumnView>
          )}

          <ColumnView>
            {cartIcon ? (
              <MaterialCOmmunityIcons
                name={'shopping-outline'}
                color={Color.white}
                size={18}
              />
            ) : (
              <></>
            )}
          </ColumnView>
          <ColumnView>
            {favoriteIcon ? (
              <Image
                source={ImagesPath.unfavorited}
                style={{width: 18, height: 18}}
              />
            ) : (
              <></>
            )}
          </ColumnView>
          <ColumnView>
            {notifIcon ? (
              <Ionicons
                name={'notifications-outline'}
                color={Color.white}
                size={18}
              />
            ) : (
              <></>
            )}
          </ColumnView>

          <ColumnView
            size={7.8}
            style={{alignItems: centerTitle ? 'center' : 'flex-start'}}>
            {children || (
              <Text
                size={16}
                type={type ? type : 'bold'}
                align="left"
                letterSpacing={0.23}
                color={color || Color.text}
                style={{paddingTop: showLeftButton ? 0 : '7%'}}>
                {title}
              </Text>
            )}
          </ColumnView>

          <ColumnView size={2.2}>
            {iconRightButton ? (
              <RightButton onPress={onPressRightButton}>
                {iconRightButton}
              </RightButton>
            ) : (
              <View />
            )}
            {titleRight && (
              <Text
                size={16}
                type="bold"
                align="left"
                letterSpacing={0.23}
                style={{marginRight: 12}}
                onPress={onPressRightButton}>
                {titleRight}
              </Text>
            )}
          </ColumnView>
        </RowView>
      </MainView>
    );
  };

  const {transparentMode, actions} = props;
  if (transparentMode) return renderTransparentMode();
  if (actions) return renderActionsMode();
  return renderNormalMode();
};

Header.defaultProps = defaultProps;

export default withNavigation(Header);
