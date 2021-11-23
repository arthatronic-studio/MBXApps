import React from 'react';
import {View, TextInput as ReactTextInput} from 'react-native';
import Styled from 'styled-components';

import {Text, useColor} from '@src/components';

const MainView = Styled(View)`
    padding: 16px 16px 0px;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(ReactTextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  borderBottomWidth: 1px;
  borderColor: #666666;
  fontSize: 14px;
`;

const ErrorView = Styled(View)`
  width: 100%;
  paddingVertical: 4px;
  alignItems: flex-start;
`;

const defaultProps = {
  containerStyle: {},
  textInputStyle: {},
  textInputProps: {},
  title: 'Judul',
  error: '',
  value: '',
  placeholder: '',
  keyboardType: 'default',
  onChangeText: () => {},
  onBlur: () => {},
};

const TextInput = (props) => {
  const {
    containerStyle,
    textInputStyle,
    textInputProps,
    title,
    error,
    value,
    placeholder,
    keyboardType,
    onChangeText,
    onBlur,
  } = props;

  const {Color} = useColor();

  return (
    <MainView style={containerStyle}>
      <LabelInput>
        <Text
          size={12}
          letterSpacing={0.08}
          color={Color.theme}
          style={{opacity: 0.6}}>
          {title}
        </Text>
      </LabelInput>
      <EmailRoundedView>
        <CustomTextInput
          placeholder={placeholder}
          placeholderTextColor={Color.gray}
          keyboardType={keyboardType}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          onChangeText={(text) => onChangeText(text)}
          selectionColor={Color.primary}
          value={value}
          onBlur={() => onBlur()}
          style={{...textInputStyle, color: Color.text}}
          {...textInputProps}
        />
      </EmailRoundedView>
      <ErrorView>
        {error !== null && error !== '' && (
          <Text type="medium" color={Color.error}>
            {error}
          </Text>
        )}
      </ErrorView>
    </MainView>
  );
};

TextInput.defaultProps = defaultProps;

export default TextInput;
