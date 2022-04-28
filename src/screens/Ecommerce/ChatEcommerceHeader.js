import { View, Text, TextInput, Pressable, SafeAreaView, TouchableOpacity, Touchable, Image } from 'react-native';
import React from 'react';
import Styled from 'styled-components';
import { useNavigation } from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColor, Header, Row } from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import { Divider } from '@src/styled';

const MainView = Styled(SafeAreaView)`
      flex: 1;
  `;

const ChatEcommerceHeader = (props) => {
	const {
    name,
		merchant,
		isOnline
  } = props;
	const { Color } = useColor();

	const navigation = useNavigation();
	return (
		<View
			style={{
				paddingVertical: 5,
				paddingHorizontal: 20,
				width: '100%',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexDirection: 'row'
			}}
		>
			<View flexDirection='row' alignItems="center">
				<Pressable onPress={() => navigation.pop()} style={{ marginRight: 20 }}>
					<AntDesign name={'arrowleft'} size={20} />
				</Pressable>
				<View>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text
							style={{
								fontWeight: 'bold'
							}}
						>
							{name}
						</Text>
						{merchant &&
							<Image source={ImagesPath.toko} style={{marginLeft: 5}} />
						}
					</View>
					<Divider height={2} />
					{merchant ?
						<Text
							style={{
								fontSize: 10
							}}
						>	
							Akun Merchant
						</Text> 
					:
						<View flexDirection="row">
							<Entypo name={'controller-record'} color={isOnline ? '#B8E271' : '#9CA3A5'} style={{marginRight: 4}}/>
							<Text
								style={{
									fontSize: 10
								}}
							>	
								{isOnline ? 'Online' : 'Offline'}
							</Text>
						</View>
					}
				</View>
			</View>

			<TouchableOpacity>
				<Entypo name={'dots-three-vertical'} size={22} />
			</TouchableOpacity>
		</View>
	);
};

export default ChatEcommerceHeader;
