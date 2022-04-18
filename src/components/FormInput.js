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

    secureTextEntry: PropTypes.bool,
    suffixIcon: PropTypes.node,
    prefixIcon: PropTypes.node,
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
    
    secureTextEntry: false,
    suffixIcon: null,
    prefixIcon: null,
    multiline: false,
    editable: true,
    format: '', // currency
    style: {},
};

const FormInput = forwardRef((props, ref) => {
    const { label, placeholder, onChangeText, value, onBlur, returnKeyType, onSubmitEditing, keyboardType, error, secureTextEntry, prefixIcon, suffixIcon, multiline, editable, format, style } = props;

    const { Color } = useColor();

    return (
        <Container width='100%'>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    // height: multiline ? 100 : 50,
                    borderRadius: 6,
                    borderWidth: 0.5,
                    borderColor: Color.disabled,
                    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
                    paddingHorizontal: 12,
                }}
            >
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

                <Row>
                    {prefixIcon}

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
                        <TextInput
                            ref={ref}
                            placeholder={placeholder}
                            placeholderTextColor={Color.placeholder}
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            onChangeText={(val) => onChangeText(val)}
                            selectionColor={Color.text}
                            value={value}
                            onBlur={() => onBlur()}
                            returnKeyType={returnKeyType}
                            onSubmitEditing={() => onSubmitEditing()}
                            blurOnSubmit={false}
                            keyboardType={keyboardType}
                            style={{
                                // width: '100%',
                                // height: '100%',
                                textAlignVertical: multiline ? 'top' : 'center',
                                flex: 1,
                                fontSize: 14,
                                fontFamily: 'Inter-Regular',
                                marginTop: multiline ? 8 : 0,
                                color: Color.text,
                                includeFontPadding: false,
                                padding: 0,
                                ...style,
                            }}
                            secureTextEntry={secureTextEntry}
                            multiline={multiline}
                            editable={editable}
                        />
                    }

                    {suffixIcon}
                </Row>
            </View>
            <View style={{
                width: '100%',
                paddingTop: 2,
                paddingBottom: 10,
                alignItems: 'flex-start',
            }}>
              <Text size={12} color={Color.error} type='medium' align='left'>{error}</Text>
            </View>
        </Container>
    );
});

FormInput.propTypes = propTypes;
FormInput.defaultProps = defaultProps;
export default FormInput;