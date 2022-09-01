import React from 'react';
import { View, ImageBackground, Dimensions, Image, TextInput } from 'react-native';
import { Header } from '@src/components';
import { Divider } from 'src/styled';
import { useWindowDimensions } from 'react-native';
import { MainView } from '@src/styled';
import { Col, Scaffold, Text, TouchableOpacity, useColor } from '@src/components';
import { shadowStyle } from '@src/styles';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import CardChat from './CardChat';
import CardChatExist from './CardChatExist';

const FirstRoute = () => <CardChat />;
const SecondRoute = () => <CardChatExist />;
const renderScene = SceneMap({
	first: FirstRoute,
	second: SecondRoute
});
const ChatRoom = (navigation, route) => {
	const { params } = route;
	const { width } = useWindowDimensions();

	const [ index, setIndex ] = React.useState(0);
	const { Color } = useColor();
	const [ routes ] = React.useState([ { key: 'first', title: 'Buyer' }, { key: 'second', title: 'Seller' } ]);

	const renderTabBar = (props) => (
		<TabBar
			{...props}
			activeColor={Color.primary}
			inactiveColor={Color.text}
			scrollEnabled
			labelStyle={{
				fontWeight: 'bold',
				textAlign: 'center',
				fontSize: 14,
				textTransform: 'none'
			}}
			indicatorStyle={{
				backgroundColor: Color.primary,
				marginLeft: 45
			}}
			style={{
				backgroundColor: Color.theme,
				paddingLeft: 45
			}}
		/>
	);

	return (
		<Scaffold
			header={<Header customIcon title="Chat Ecommerce" type="bold" centerTitle={false} />}
			onPressLeftButton={() => navigation.pop()}
		>
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width }}
				renderTabBar={renderTabBar}
			/>
		</Scaffold>
	);
};

export default ChatRoom;
