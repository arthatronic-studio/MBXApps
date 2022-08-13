import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Text from '@src/components/Text';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';
// import MaskedLinear from './MaskedLinear';
import { Container, Divider } from 'src/styled';
import { shadowStyle } from 'src/styles';

const propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf(['input', 'select']),
    style: PropTypes.object,
    onPress: PropTypes.func,
    value: PropTypes.string,
    onChangeText: PropTypes.func,
    textInputProps: PropTypes.object,
};

const defaultProps = {
    label: 'Cari',
    type: 'component',
    style: {},
    onPress: () => { },
    value: '',
    onChangeText: () => { },
    textInputProps: {},
};

const SearchBar = ({ type, label, style, onPress, value, onChangeText, textInputProps }) => {
    const { Color } = useColor();

    const isInputType = type === 'input';

    return (
        <TouchableOpacity style={{ paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, minHeight: 45, alignItems: 'center', justifyContent: 'space-between', backgroundColor: Color.textInput, borderRadius: 8, borderColor: Color.textSoft, borderWidth: 0.5, ...style }}>
                {isInputType ?
                    <>
                        <TextInput
                            {...textInputProps}
                            placeholder={label}
                            placeholderTextColor={Color.placeholder}
                            value={value}
                            onChangeText={onChangeText}
                            style={{
                                flex: 1,
                                color: Color.text,
                                backgroundColor: Color.textInput,
                            }}
                        />
                        {value !== '' ?
                            <Container color={Color.text} radius={50} padding={2}>
                                <Ionicons name='close' color={Color.theme} size={16} onPress={() => onChangeText('')} />
                            </Container>
                        :
                            <Octicons name='search' color={Color.border} size={16} />
                        }
                    </>
                    :
                    <>
                        <TouchableOpacity
                            onPress={() => onPress()}
                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <Text color={Color.placeholder} letterSpacinng={0.25}>{label}</Text>
                            <Octicons name='search' color={Color.textSoft} size={24} />
                        </TouchableOpacity>
                    </>
                }
            </View>
        </TouchableOpacity>
    );
}

SearchBar.propTypes = propTypes;
SearchBar.defaultProps = defaultProps;
export default SearchBar;