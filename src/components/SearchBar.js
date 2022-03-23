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
import { Divider } from 'src/styled';
import { shadowStyle } from 'src/styles';

const propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf(['input', 'select']),
    style: PropTypes.object,
    onPress: PropTypes.func,
    value: PropTypes.string,
    searchbar: PropTypes.string,
    onChangeText: PropTypes.func,
};

const defaultProps = {
    label: 'Cari',
    type: 'component',
    style: {},
    onPress: () => { },
    value: '',
    onChangeText: () => { },
};

const SearchBar = ({ type, label, style, onPress, value, onChangeText }) => {
    const [state, set] = useState();

    const { Color } = useColor();


    useEffect(() => {

    }, []);

    const isInputType = type === 'input';

    return (
        <TouchableOpacity style={{ paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, minHeight: 45, alignItems: 'center', justifyContent: 'space-between', backgroundColor: Color.border, borderRadius: 4, ...shadowStyle, ...style }}>
                {isInputType ?
                <>
                    <Octicons name='search' color={Color.text} size={16} />
                    <TextInput
                        placeholder={label}
                        value={value}
                        onChangeText={onChangeText}
                        style={{
                            flex: 1,
                            paddingLeft: 8,
                            color: Color.text,
                        }}
                    />
                    {value !== '' && <Ionicons name='close' color={Color.red} size={18} onPress={() => onChangeText('')} />}
                </>
                :
                <>
                    <TouchableOpacity
                        onPress={() => onPress()}
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
                    >
                        <Octicons name='search' color={Color.text} size={16} />
                        <Divider width={8} />
                        <Text>{label}</Text>
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