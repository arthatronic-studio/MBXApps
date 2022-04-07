import React from 'react';
import { View, ImageBackground, Dimensions, Image, TextInput } from 'react-native';
import { Header } from '@src/components';
import { Divider } from 'src/styled';
import { useWindowDimensions } from 'react-native';
import { MainView } from '@src/styled';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Col, Scaffold, Text, TouchableOpacity, useColor } from '@src/components';
import { shadowStyle } from '@src/styles';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import CardChat from './CardChat';
import CardChatExist from './CardChatExist';
import ImagesPath from 'src/components/ImagesPath';
import Styled from 'styled-components';
import ChatEcommerceHeader from './ChatEcommerceHeader';
import Footer from 'src/components/Footer';

const BottomSection = Styled(View)`
  width: 100%;
  padding: 16px;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 85%;
  minHeight: 48px;
  padding: 0px 42px 0px 16px;
  borderRadius: 120px;
  borderWidth: 0.5px;
  justifyContent: center;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  fontSize: 12px;
`;

const CircleSend = Styled(TouchableOpacity)`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 50px;
  height: 50px;
  borderRadius: 25px;
  justifyContent: center;
  alignItems: center;
`;
const ChatDetail = ({ navigation, route }) => {
	const { Color } = useColor();

	return (
		<Scaffold header={<ChatEcommerceHeader navigation />}>
			<ScrollView style={{ backgroundColor: Color.grayLight }}>
				<View style={{ marginHorizontal: 16, marginVertical: 16, flexDirection: 'row' }}>
					<Image source={ImagesPath.chat} style={{ marginRight: 10, marginTop: 150 }} />
					<View style={{ backgroundColor: '#FDE4D2', borderRadius: 8, width: '75%', alignSelf: 'center' }}>
						<Text style={{ marginHorizontal: 8, marginVertical: 8 }}>
							Oat cake danish sweet roll jujubes tart cupcake toffee. Chocolate cake jelly beans carrot
							cake bonbon jujubes. Toffee sesame snaps croissant biscuit apple pie pudding dessert oat
							cake. Dragée topping sweet roll liquorice cookie candy biscuit marzipan
						</Text>
						<Text style={{ alignSelf: 'baseline', marginHorizontal: 20, marginBottom: 10 }}>19:11</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						marginHorizontal: 16,
						alignSelf: 'center'
					}}
				>
					<View
						style={{
							backgroundColor: '#FDE4D2',
							borderRadius: 8,
							width: '75%',
							marginLeft: 50
						}}
					>
						<Text style={{ marginHorizontal: 8, marginVertical: 8 }}>
							Oat cake danish sweet roll jujubes tart cupcake toffee. Chocolate cake jelly beans carrot
							cake bonbon jujubes. Toffee sesame snaps croissant biscuit apple pie pudding dessert oat
							cake. Dragée topping sweet roll liquorice cookie candy biscuit marzipan
						</Text>
						<Text style={{ alignSelf: 'baseline', marginHorizontal: 20, marginBottom: 10 }}>19:11</Text>
					</View>
					<Image source={ImagesPath.chat} style={{ marginTop: 150, marginLeft: 10 }} />
				</View>
			</ScrollView>
			<View style={{}}>
				<BottomSection style={{ borderColor: Color.theme }}>
					<BoxInput style={{ borderColor: Color.text, flexDirection: 'row' }}>
						<CustomTextInput
							name="text"
							placeholder="Kirim Pesan.."
							placeholderTextColor={Color.text}
							selectionColor={Color.primary}
							returnKeyType="done"
							returnKeyLabel="Done"
							blurOnSubmit={false}
							onBlur={() => {}}
							error={null}
							multiline
							style={{ color: Color.text, marginHorizontal: 20 }}
						/>
						<Image source={ImagesPath.plusCircleGray} style={{ marginVertical: 12 }} />
					</BoxInput>
					<CircleSend
						onPress={() => onSubmit()}
						style={{
							backgroundColor: Color.primary,
							marginRight: 5,
							marginBottom: 10
						}}
					>
						<Ionicons name="send" color={Color.textInput} size={15} />
					</CircleSend>
				</BottomSection>
			</View>
		</Scaffold>
	);
};

export default ChatDetail;
