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
const ChatDetailSeller = ({ navigation, route }) => {
	const { id, merchant, users } = route.params;
	const { Color } = useColor();
	const [roomId, setRoomId] = useState(id);
  const user = useSelector(state => state['user.auth'].login.user);
	const [userTarget, setUserTarget] = useState(users.find(item => item.user_id != user.userId));
	const { width, height } = useWindowDimensions();
	const [message, setMessage] = useState('');
	const [dataChat, setDataChat] = useState([]);
	const [userImage, setUserImage] = useState(merchant.profile_img);
	const [targetImage, setTargetImage] = useState(userTarget.photo_profile);

	const create_message = () => {
		const community_chat_user_params = [
			{ user_id: userTarget.user_id, room_type: 'ECOMMERCE', room_user_type: 'USER' },
			{ user_id: user.userId, room_type: 'ECOMMERCE', room_user_type: 'MERCHANT' },
		];
		const body = {community_chat_user_params: community_chat_user_params, chat_room_id: roomId, chat_message: message, user_id:  user.userId, chat_type: 'TEXT'};
		currentSocket.emit('create_community_chat_message', body);
		// currentSocket.on('create_community_chat_room', (res) => {
		// 	console.log('res create_community_chat_room', res);
		// });
		setMessage('');
  	}
	
	useEffect(() => {
		currentSocket.emit('community_chat_message', {chat_room_id: roomId});
		console.log("test");
		currentSocket.on('community_chat_message', (res) => {
			console.log('community_chat_message', res.data);
			if(Array.isArray(res.data)) {
				setDataChat(res.data);
			}
		});
	}, []);

	return (
		<Scaffold header={
			<ChatEcommerceHeader 
				name={userTarget.first_name}
				merchant={false}
				isOnline={userTarget.is_online}
			/>
		}>
			<FlatList
				key='Chat'
				keyExtractor={(item, index) => item.toString() + index}
				data={dataChat}
				numColumns={1}
				showsHorizontalScrollIndicator={false}
				style={{backgroundColor: Color.border}}
				contentContainerStyle={{marginHorizontal: 8, marginVertical: 8, paddingBottom: 8}}
				inverted
				renderItem={({ item, index }) => {
					return (
						<>
						{item.user_id == userTarget.user_id ?
							(
								<View style={{ marginHorizontal: 8, marginVertical: 8, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
									<Image source={{ uri: targetImage }} style={{ width: 36, aspectRatio: 1, borderRadius: 18, marginRight: 8 }} />
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
									<Image source={{ uri: userImage }} style={{ width: 36, aspectRatio: 1, borderRadius: 18, marginLeft: 8 }}/>
								</View>
							)
							}
						</>
					)
				}}
			/>

			<View>
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

export default ChatDetailSeller;
