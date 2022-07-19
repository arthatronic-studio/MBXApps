import React, {useState, useEffect} from 'react';
import { View, ImageBackground, Dimensions, Image, TextInput } from 'react-native';
import { Header } from '@src/components';
import { Col, Scaffold, Text, TouchableOpacity, useColor } from '@src/components';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import CardChatEcommerce from './CardChatEcommerce';
import { useIsFocused } from '@react-navigation/native';
import { initSocket } from 'src/api-socket/currentSocket';

const ChatEcommerceSeller = ({ navigation, route }) => {
	const currentSocket = initSocket();
	
	const { Color } = useColor();
	const [roomSellers, setRoomSellers] = useState([]);

	const get_list_room = () => {
		const body = {room_type: 'ECOMMERCE', room_user_type: 'MERCHANT'};
		currentSocket.emit('community_chat_room', body);
	}

	useEffect(() => {
		currentSocket.on('community_chat_room', (res) => {
			console.log('community_chat_room', res);
			setRoomSellers(res.data);
		});
		get_list_room();
	}, []);

	return (
		<Scaffold
			header={<Header customIcon title="Chat Ecommerce seller" type="bold" centerTitle={false} />}
			onPressLeftButton={() => {
				currentSocket.off('community_chat_room');
				navigation.pop()
			}}>
			<View>
				{/* <View style={{ width: '90%', alignSelf: 'center' }}>
					<TextInput
						placeholder="Cari apa hari ini . . ."
						style={{
							backgroundColor: Color.grayLight,
							width: '95%',
							borderRadius: 7,
							height: 40,
							marginHorizontal: 10,
							marginVertical: 10,
							paddingHorizontal: 10
						}}
					/>
				</View>
				<Octicons
					name={'search'}
					size={14}
					style={{
						color: Color.placeholder,
						alignSelf: 'flex-end',
						paddingRight: 40,
						marginVertical: 22,
						position: 'absolute'
					}}
				/> */}
				<FlatList
					data={roomSellers}
					keyExtractor={(item, index) => item.toString() + index}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity onPress={() => {
								navigation.navigate('ChatDetailSeller', {id: item.id, merchant: item.merchant, users: item.users})}}
								>
								<CardChatEcommerce item={item} type={'seller'}/>
							</TouchableOpacity>
						);
					}}
				/>
			</View>
		</Scaffold>
	);
};

export default ChatEcommerceSeller;
