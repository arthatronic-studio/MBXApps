import React, { useState, useEffect, forwardRef } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import Fontisto from 'react-native-vector-icons/Fontisto';

import Text from '@src/components/Text';
import Button from 'src/components/Button';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';

import { shadowStyle } from '@src/styles';
import { Container } from 'src/styled';

const propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChangeText: PropTypes.func,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    returnKeyType: PropTypes.string,
    onSubmitEditing: PropTypes.func,
    keyboardType: PropTypes.string,
    error: PropTypes.string,

    secureTextEntry: PropTypes.bool,
    suffixIcon: PropTypes.node,
    prefixIcon: PropTypes.node,
    onPress: PropTypes.func,
};

const defaultProps = {
    label: '',
    placeholder: '',
    onChangeText: () => {},
    value: '',
    onBlur: () => {},
    returnKeyType: 'next',
    onSubmitEditing: () => {},
    keyboardType: 'default',
    error: null,

    secureTextEntry: false,
    suffixIcon: null,
    prefixIcon: null,
    onPress: () => {},
};

const FormSelect = forwardRef(({ label, placeholder, onPress, onChangeText, value, onBlur, returnKeyType, onSubmitEditing, keyboardType, error, secureTextEntry, prefixIcon, suffixIcon }, ref) => {
    const { Color } = useColor();

    useEffect(() => {
        
    }, []);

    return (
        <Container width='100%'>
            <View style={{
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingHorizontal: 16,
                paddingTop: 16,
            }}>
                <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>{label}</Text>
            </View>
            <TouchableOpacity
                onPress={() => onPress()}
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: Color.textInput,
                }}
            >
                {prefixIcon}

                <Container flex={1} align='flex-start' justify='center' paddingHorizontal={16}>
                    <Text color={Color.gray}>
                        {value || placeholder}
                    </Text>
                </Container>

                {/* <TextInput
                    ref={ref}
                    placeholder={placeholder}
                    placeholderTextColor={Color.gray}
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
                        flex: 1,
                        // height: '100%',
                        paddingHorizontal: 16,
                        color: Color.gray,
                    }}
                    secureTextEntry={secureTextEntry}
                /> */}

                {suffixIcon || <View style={{height: '100%', width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
                    <Fontisto size={14} name='angle-down' color={Color.gray} />
                </View>}
            </TouchableOpacity>
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

FormSelect.propTypes = propTypes;
FormSelect.defaultProps = defaultProps;
export default FormSelect;