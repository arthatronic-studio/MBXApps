import React from 'react';
import { View, TextInput as ReactTextInput, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    Text,
    // TouchableOpacity,
    useColor
} from '@src/components';

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
  marginTop: 8px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(ReactTextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Raleway-Regular;
  backgroundColor: transparent;
  borderBottomWidth: 1px;
  borderColor: #666666;
  fontSize: 14px;
`;

const CustomTouch = Styled(TouchableOpacity)`
    width: 33.33%;
    height: 100%;
    backgroundColor: transparent;
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
    selectType: 'small',
    iconName: '',
    title: 'Judul',
    error: '',
    value: '',
    placeholder: '',
    keyboardType: 'default',
    onChangeText: () => {},
    onBlur: () => {},
    onPress: () => {},
}

const TouchSelect = (props) => {
    const {
        containerStyle,
        textInputStyle,
        textInputProps,
        selectType,
        iconName,
        title,
        error,
        value,
        placeholder,
        keyboardType,
        onChangeText,
        onBlur,
        onPress,
    } = props;

    const { Color } = useColor();

    return (
        <MainView style={containerStyle}>
            <LabelInput>
                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>{title}</Text>
            </LabelInput>
            <EmailRoundedView>
                {selectType === 'small' ?
                    <CustomTouch onPress={() => onPress()}>
                        <View style={{height: 34, marginTop: 6, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: Color.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={{height: 34, paddingRight: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Ionicons name={iconName} color={Color.text} />
                                <Text size={12} style={{marginTop: 2, marginLeft: 4}}>{value}</Text>
                            </View>
                            <Ionicons name='chevron-down-outline' color={Color.text} />
                        </View>
                    </CustomTouch>
                :
                    <CustomTextInput
                        placeholder={placeholder}
                        placeholderTextColor={Color.gray}
                        keyboardType={keyboardType}
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        onChangeText={(text) => onChangeText(text)}
                        selectionColor={Color.primary}
                        value={value}
                        onBlur={() => onBlur()}
                        style={{...textInputStyle, color: Color.text}}
                        {...textInputProps}
                    />
                }
            </EmailRoundedView>
            <ErrorView>
                {error !== null && error !== '' && <Text type='medium' color={Color.error}>{error}</Text>}
            </ErrorView>
        </MainView>
    )
}

TouchSelect.defaultProps = defaultProps;

export default TouchSelect;