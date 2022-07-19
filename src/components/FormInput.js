import React, { useState, useEffect, forwardRef } from 'react';
import { View, TextInput, Platform } from 'react-native';
import PropTypes from 'prop-types';
// import CurrencyInput from 'react-native-currency-input';

import Text from '@src/components/Text';
import Button from 'src/components/Button';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';

import { shadowStyle } from '@src/styles';
import { Container, Row } from 'src/styled';

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

    secureTextEntry: PropTypes.bool,
    prefixIcon: PropTypes.node,
    prefixText: PropTypes.string,
    suffixIcon: PropTypes.node,
    suffixText: PropTypes.string,
    textinputProps: PropTypes.object,
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

const FormInput = forwardRef((props, ref) => {
    const { label, placeholder, onChangeText, value, onBlur, returnKeyType, onSubmitEditing, keyboardType, error, hideErrorHint, secureTextEntry, prefixIcon, prefixText, suffixIcon, suffixText, multiline, editable, format, style, textinputProps } = props;

    const { Color } = useColor();

    let extraStyle = {};
    if (multiline) extraStyle.height = 120;

    return (
        <Container width='100%'>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    borderRadius: 6,
                    borderWidth: 0.5,
                    borderColor: Color.disabled,
                    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
                    paddingHorizontal: 12,
                    backgroundColor: Color.textInput,
                }}
            >
                <Row align='flex-end'>
                    {prefixIcon}

                    <View style={{flex: 1}}>
                        {label !== '' && <View
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                marginBottom: Platform.OS === 'ios' ? 4 : 2,
                            }}
                        >
                            <Text size={12} color={Color.placeholder}>{label}</Text>
                        </View>}

                        {format === 'currency' ? 
                            <View />
                            // <CurrencyInput
                            //     onChangeValue={(val) => onChangeText(val)}
                            //     precision={0}

                            //     ref={ref}
                            //     placeholder={placeholder}
                            //     placeholderTextColor={Color.gray}
                            //     underlineColorAndroid='transparent'
                            //     autoCorrect={false}
                            //     selectionColor={Color.text}
                            //     value={value}
                            //     onBlur={() => onBlur()}
                            //     returnKeyType={returnKeyType}
                            //     onSubmitEditing={() => onSubmitEditing()}
                            //     blurOnSubmit={false}
                            //     keyboardType={keyboardType}
                            //     style={{
                            //         // width: '100%',
                            //         // height: '100%',
                            //         textAlignVertical: multiline ? 'top' : 'center',
                            //         flex: 1,
                            //         fontSize: 14,
                            //         fontFamily: 'Inter-Regular',
                            //         marginTop: multiline ? 8 : 0,
                            //         paddingHorizontal: 16,
                            //         color: Color.gray,
                            //         includeFontPadding: false,
                            //     }}
                            //     secureTextEntry={secureTextEntry}
                            //     multiline={multiline}
                            //     editable={editable}
                            // />
                        :
                            <Row>
                                {prefixText !== '' && <Container paddingRight={8}>
                                    <Text type='medium'>{prefixText}</Text>
                                </Container>}
                                <TextInput
                                    ref={ref}
                                    placeholder={placeholder}
                                    placeholderTextColor={Color.border}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(val) => onChangeText(val)}
                                    selectionColor={Color.placeholder}
                                    value={value}
                                    onBlur={() => onBlur()}
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
                                        fontSize: 14,
                                        fontFamily: 'Inter-Regular',
                                        marginTop: multiline ? (Platform.OS === 'android' ? 8 : 0) : 0,
                                        marginBottom: multiline ? (Platform.OS === 'android' ? 0 : 4) : 0,
                                        color: Color.text,
                                        includeFontPadding: false,
                                        padding: 0,
                                        backgroundColor: Color.textInput,
                                        ...extraStyle,
                                        ...style,
                                    }}
                                    secureTextEntry={secureTextEntry}
                                    multiline={multiline}
                                    editable={editable}
                                    {...textinputProps}
                                />
                                {suffixText !== '' && <Container paddingRight={8}>
                                    <Text type='medium'>{suffixText}</Text>
                                </Container>}
                            </Row>
                        }
                    </View>

                    {suffixIcon}
                </Row>
            </View>
            {!hideErrorHint && <View style={{
                width: '100%',
                paddingTop: 2,
                paddingBottom: 10,
                alignItems: 'flex-start',
            }}>
              <Text size={12} color={Color.error} type='medium' align='left'>{error}</Text>
            </View>}
        </Container>
    );
});

FormInput.propTypes = propTypes;
FormInput.defaultProps = defaultProps;
export default FormInput;