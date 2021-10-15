import { View, SafeAreaView } from 'react-native';
import Styled from 'styled-components';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Container = Styled(View)`
    flex: 1;
    paddingHorizontal: 16px;
`;

const Divider = Styled(View)`
    height: ${props => props.height || 16};
    width: ${props => props.width || 16};
`;

export {
    MainView,
    Container,
    Divider,
};