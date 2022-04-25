import React, {useState, useEffect} from 'react';
import { View, ImageBackground, useWindowDimensions, Image, TextInput } from 'react-native';
import { Header } from '@src/components';
import { Divider } from 'src/styled';
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
import {useSelector} from 'react-redux';
import Footer from 'src/components/Footer';
import { currentSocket } from '@src/screens/MainHome/MainHome';

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
	const { params } = route;
	const { Color } = useColor();
	const [roomId, setRoomId] = useState(params.id);
  const user = useSelector(state => state['user.auth'].login.user);
	const { width, height } = useWindowDimensions();
	const [message, setMessage] = useState('');
	const [dataChat, setDataChat] = useState([]);

	const create_message = () => {
    console.log("masukk", message);
    const body = {chat_room_id: 6, chat_message: message, user_id:  user.userId, chat_type: 'TEXT'};
    currentSocket.emit('create_community_chat_message', body);
		console.log(dataChat, "pesan create message");
  }
	
	useEffect(() => {
		if (roomId) {
			currentSocket.emit('community_chat_message', {chat_room_id: roomId});
			currentSocket.on('community_chat_message', (res) => {
				console.log('community_chat_message', res.data);
				if(Array.isArray(res.data)) {
					setDataChat(res.data);
				}
			});
		}
	}, [roomId]);

	console.log(dataChat, "pesan");

	return (
		<Scaffold header={
			<ChatEcommerceHeader 
				name={user.userId !== params.merchant.userId ? params.merchant.name : 'user'}
				merchant={user.userId !== params.merchant.userId ? true : false}
			/>
		}>
			<View style={{ backgroundColor: Color.grayLight, height: height-146 }}>

				<FlatList
					key='Chat'
					keyExtractor={(item, index) => item.toString() + index}
					data={dataChat}
					numColumns={1}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{marginHorizontal: 8, marginVertical: 8, paddingBottom: 8}}
					inverted
					renderItem={({ item, index }) => {
						return (
							<>
							{item.user_id == params.merchant.userId ?
								(
									<View style={{ marginHorizontal: 8, marginVertical: 8, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
										<Image source={ImagesPath.chat} style={{ marginRight: 8}} />
										<View style={{ backgroundColor: '#FDE4D2', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, maxWidth: width-(52) }}>
											<Text size={14} align='left'>
												{item.chat_message}
											</Text>
											<Text size={10} type="medium" color={Color.gray} style={{ marginTop: 3 }} align='left'>{new Date(item.created_date).getHours()}:{new Date(item.created_date).getMinutes()}</Text>
										</View>
									</View>
								) :
								(
									<View style={{ marginHorizontal: 8, marginVertical: 8, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
										<View style={{ backgroundColor: '#FDE4D2', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, maxWidth: width-(52) }}>
											<Text size={14} align='left'>
												{item.chat_message}
											</Text>
											<Text size={10} type="medium" color={Color.gray} style={{ marginTop: 3 }} align='left'>{new Date(item.created_date).getHours()}:{new Date(item.created_date).getMinutes()}</Text>
										</View>
										<Image source={ImagesPath.chat} style={{ marginLeft: 8}} />
									</View>
								)
								}
							</>
						)
					}}
				/>

			</View>
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
							error={null}
							multiline
							value={message}
							onChangeText={(text) => setMessage(text)}
							style={{ color: Color.text, marginHorizontal: 20 }}
						/>
						{/* <Image source={ImagesPath.plusCircleGray} style={{ marginVertical: 12 }} /> */}
					</BoxInput>
					<CircleSend
						onPress={() => create_message()}
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
