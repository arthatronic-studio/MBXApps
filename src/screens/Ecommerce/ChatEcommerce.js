import React, {useState, useEffect} from 'react';
import { View, ImageBackground, Dimensions, Image, TextInput } from 'react-native';
import { Header } from '@src/components';
import { Col, Scaffold, Text, TouchableOpacity, useColor } from '@src/components';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import CardChatEcommerce from './CardChatEcommerce';
import { useIsFocused } from '@react-navigation/native';
import { currentSocket } from '@src/screens/MainHome/MainHome';

const Data = [
	{
		id: 1,
		Image: '',
		Name: 'asisah',
		subtitle: 'Indonesia'
	},
	{
		id: 2,
		Image: '',
		Name: 'asisah',
		subtitle: 'Indonesia'
	},
	{
		id: 3,
		Image: '',
		Name: 'asisah',
		subtitle: 'Indonesia'
	},
	{
		id: 4,
		Image: '',
		Name: 'asisah',
		subtitle: 'Indonesia'
	}
];
const ChatEcommerce = ({ navigation, route }) => {
	const { Color } = useColor();
	const [rooms, setRooms] = useState([]);
	// const {type} = route.params;

	const get_list_room = () => {
		var body = {room_type: 'ECOMMERCE', room_user_type: 'USER'};
		// if(type == "buyer"){
			// body = {room_type: 'ECOMMERCE', room_user_type: 'USER'};
		// }
    currentSocket.emit('community_chat_room', body);
    currentSocket.on('community_chat_room', (res) => {
      console.log('community_chat_room', res);
			setRooms(res.data);
    });
  }

	useEffect(() => {
		get_list_room();
	}, []);

	console.log(rooms, "rooms");

	return (
		<Scaffold
			header={<Header customIcon title="Chat Ecommerce" type="bold" centerTitle={false} />}
			onPressLeftButton={() => navigation.pop()}
		>
			<ScrollView>
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
						data={rooms}
						keyExtractor={(item, index) => item.toString() + index}
						renderItem={({ item }) => {
							return (
								<TouchableOpacity onPress={() => navigation.navigate('ChatDetail', {id: item.id, merchant: item.merchant})}>
									<CardChatEcommerce item={item}/>
								</TouchableOpacity>
							);
						}}
					/>
				</View>
			</ScrollView>
		</Scaffold>
	);
};

export default ChatEcommerce;
