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
import CardChatEcommerce from './CardChatEcommerce';

const Data = [
	{
		id: 1,
		Image: '',
		Name: 'asisah',
		subtitle: 'Indonesia'
	}
];
const ChatEcommerce = ({ navigation, route }) => {
	const { Color } = useColor();

	return (
		<Scaffold
			header={<Header customIcon title="Chat Ecommerce" type="bold" centerTitle={false} />}
			onPressLeftButton={() => navigation.pop()}
		>
			<ScrollView>
				<View>
					<View style={{ width: '90%', alignSelf: 'center' }}>
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
					/>
					<FlatList
						data={Data}
						keyExtractor={(item, index) => item.toString() + index}
						renderItem={({ item }) => {
							return (
								<TouchableOpacity onPress={() => navigation.navigate('ChatDetail')}>
									<CardChatEcommerce />
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
