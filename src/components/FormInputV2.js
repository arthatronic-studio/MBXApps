import React, {useState, useEffect, forwardRef} from 'react';
import {View, TextInput, Platform} from 'react-native';
import PropTypes from 'prop-types';
// import CurrencyInput from 'react-native-currency-input';

import Text from '@src/components/Text';
import Button from 'src/components/Button';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import {useColor} from '@src/components/Color';

import {shadowStyle} from '@src/styles';
import {Container, Divider, Row, Line} from 'src/styled';

const propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
  value: PropTypes.any,
  onBlur: PropTypes.func,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  keyboardType: PropTypes.string,
  error: PropTypes.string,
  hideErrorHint: PropTypes.bool,
  hideBorder: PropTypes.bool,

  secureTextEntry: PropTypes.bool,
  prefixIcon: PropTypes.node,
  prefixText: PropTypes.string,
  suffixIcon: PropTypes.node,
  suffixText: PropTypes.string,
  textinputProps: PropTypes.object,
  placeholderTextColor: PropTypes.string,
  borderColor: PropTypes.string,
};

const defaultProps = {
  label: '',
  placeholder: '',
  onChangeText: () => {},
  onBlur: () => {},
  returnKeyType: 'next',
  onSubmitEditing: () => {},
  keyboardType: 'default',
  error: null,
  hideErrorHint: false,
  hideBorder: false,

  secureTextEntry: false,
  prefixIcon: null,
  prefixText: '',
  suffixIcon: null,
  suffixText: '',
  multiline: false,
  editable: true,
  format: '', // currency
  style: {},
  textinputProps: {},
};

const FormInputV2 = forwardRef((props, ref) => {
  const {
    label,
    placeholder,
    onChangeText,
    value,
    onBlur,
    returnKeyType,
    onSubmitEditing,
    keyboardType,
    error,
    hideErrorHint,
    hideBorder,
    secureTextEntry,
    prefixIcon,
    prefixText,
    suffixIcon,
    suffixText,
    multiline,
    editable,
    format,
    style,
    textinputProps,
    placeholderTextColor,
    borderColor,
  } = props;

  const {Color} = useColor();

  const [isFocus, setIsFocus] = useState(false);

  let extraStyle = {};
  if (multiline) extraStyle.height = 120;

  return (
    <Container width="100%">
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          borderRadius: 8,
          paddingVertical: Platform.OS === 'ios' ? 18 : 10,
          //   paddingHorizontal: 12,
          flex: 1,
        }}>
        <Row align="center" justify="space-between">
          {label !== '' && (
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginBottom: Platform.OS === 'ios' ? 4 : 2,
              }}>
              <Text type="medium" size={14} lineHeight={16} color={'#797979'}>
                {label}
              </Text>
            </View>
          )}

          <Divider width={40} />

          <View style={{flex: 1, flexDirection: 'column'}}>
            <Row>
              {prefixText !== '' && (
                <Container paddingRight={8}>
                  <Text type="medium" size={22} lineHeight={26} color="#141414">
                    {prefixText}
                  </Text>
                </Container>
              )}
              <TextInput
                ref={ref}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor || Color.placeholder}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                onChangeText={val => onChangeText(val)}
                selectionColor={Color.placeholder}
                value={value}
                onBlur={() => {
                  onBlur();
                  setIsFocus(false);
                }}
                onFocus={() => {
                  setIsFocus(true);
                }}
                returnKeyType={returnKeyType}
                onSubmitEditing={() => onSubmitEditing()}
                blurOnSubmit={false}
                keyboardType={keyboardType}
                autoCapitalize={secureTextEntry ? 'none' : undefined}
                keyboardAppearance={Color.colorDominant}
                style={{
                  // width: '100%',
                  // height: '100%',
                  textAlignVertical: multiline ? 'top' : 'center',
                  flex: 1,
                  fontSize: 22,
                  lineHeight: 26,
                  fontFamily: 'Inter-Regular',
                  marginTop: multiline
                    ? Platform.OS === 'android'
                      ? 8
                      : 0
                    : 0,
                  marginBottom: multiline
                    ? Platform.OS === 'android'
                      ? 0
                      : 4
                    : 0,
                  color: Color.text,
                  includeFontPadding: false,
                  padding: 0,
                  ...extraStyle,
                  ...style,
                }}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                editable={editable}
                {...textinputProps}
              />
              {suffixText !== '' && (
                <Container paddingRight={8}>
                  <Text type="medium">{suffixText}</Text>
                </Container>
              )}
            </Row>
            <Divider height={10}/>
            <View style={{ borderWidth: 1, height: 1, borderColor: '#141414' }}/>
          </View>

          {suffixIcon}
        </Row>
      </View>
      {!hideErrorHint && (
        <View
          style={{
            width: '100%',
            paddingTop: 2,
            paddingBottom: 10,
            alignItems: 'flex-start',
          }}>
          <Text size={12} color={Color.error} type="medium" align="left">
            {error}
          </Text>
        </View>
      )}
    </Container>
  );
});

FormInputV2.propTypes = propTypes;
FormInputV2.defaultProps = defaultProps;
export default FormInputV2;
