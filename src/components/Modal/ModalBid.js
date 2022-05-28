import React, { useRef, forwardRef, useState, useEffect } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Popup, usePopup, Loading, useLoading, Text, useColor } from '@src/components';
import { useCombinedRefs } from 'src/hooks';
import { FormatMoney } from 'src/utils';
import FormInput from '../FormInput';
import { fetchVestaBalance } from 'src/api/vestaBalance';
import { statusBarHeight } from 'src/utils/constants';
import { Divider } from 'src/styled';
import { Button } from '../Button';

const defaultProps = {
	startPrice: 0,
	userLastBid: 0,
	highestBid: 0,
	onPress: () => {},
};

const amountData = [
	{ id: 1, bid: 5000 },
	{ id: 2, bid: 10000 },
	{ id: 3, bid: 25000 },
	{ id: 4, bid: 50000 },
	{ id: 5, bid: 100000 },
	{ id: 6, bid: 200000 }
];

const ModalBid = forwardRef((props, ref) => {
	const { onPress, startPrice, userLastBid, highestBid } = props;

	const modalizeRef = useRef(null);
	const combinedRef = useCombinedRefs(ref, modalizeRef);
	const [ loadingProps, showLoading ] = useLoading();
	const [ popupProps, showPopup ] = usePopup();
	const { Color } = useColor();
	const { width } = useWindowDimensions();

	const handlePosition = (position) => {
		setHandle(position === 'top');
	};

	// state
	const [handle, setHandle] = useState(false);
	const [text, setText] = useState(userLastBid.toString());
	const [selectedAmount, setSelectedAmount] = useState();
	const [vestaAmount, setVestaAmount] = useState(0);

	useEffect(() => {
		setText(userLastBid.toString());
	}, [userLastBid]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async() => {
		const result = await fetchVestaBalance();
		if (result.status) {
			setVestaAmount(result.data.amount);
		}
	}

	const onSubmit = () => {
		if (text) {
			if (parseInt(text) < startPrice) {
				showPopup('Minimal bid adalah Rp 5.000', 'warning');
			} else {
				onPress(text);
				combinedRef.current.close();
			}
		} else {
			showPopup('Silakan masukan nominal bid terlebih dulu', 'warning');
		}
	};

	const renderContent = () => {
		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					flexWrap: 'wrap',
				}}
			>
				{amountData.map((item, index) => {
					const isSelected = selectedAmount && selectedAmount.id === item.id;
					
					return (
						<View
							key={index}
							style={{
								width: `${100/3}%`,
								padding: 4,
							}}
						>
							<TouchableOpacity
								activeOpacity={1}
								onPress={() => {
									const calculate = highestBid + item.bid;
									setText(calculate.toString());
									setSelectedAmount(item);
								}}
								style={{
									flex: 1,
									borderRadius: 12,
									paddingVertical: 12,
									flexDirection: 'row',
									justifyContent: 'center',
									backgroundColor: isSelected ? Color.text : Color.grayLight,
								}}
							>
								<Text size={14} color={isSelected ? Color.textInput : Color.text}>
									+ {FormatMoney.getFormattedMoney(item.bid)}
								</Text>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>
		)
	};

	return (
		<Modalize
			ref={combinedRef}
			withHandle={false}
			handlePosition="inside"
			adjustToContentHeight
			handleStyle={{ width: width / 4, height: handle ? 4 : 4, backgroundColor: Color.primary, marginTop: 8 }}
			onPositionChange={handlePosition}
			childrenStyle={{
				marginTop: 8,
				paddingBottom: statusBarHeight,
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
			}}
			modalStyle={{
				backgroundColor: Color.theme,
				width: width,
			}}
			onClose={() => {
				setText(userLastBid.toString());
				setSelectedAmount();
			}}
		>
			<View style={{width, padding: 16}}>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginBottom: 16,
						alignItems: 'center',
					}}
				>
					<Text color={Color.text} type='bold'>
						Pasang Tawaran
					</Text>
					<TouchableOpacity
						onPress={() => {
							combinedRef.current.close();
						}}
					>
						<Ionicons name="chevron-down-outline" color={Color.text} size={18} />
					</TouchableOpacity>
				</View>

				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={{ flex: 1, alignItems: 'flex-start' }}>
						<Text style={{ color: Color.grayLight }}>Harga saat ini</Text>
						<Divider height={8} />
						<Text style={{ fontWeight: 'bold' }}>{FormatMoney.getFormattedMoney(highestBid, '')} Poin</Text>
					</View>
					<View style={{ flex: 1, alignItems: 'flex-start' }}>
						<Text style={{ color: Color.grayLight }}>Penawaranmu</Text>
						<Divider height={8} />
						<FormInput
							placeholder='-'
							value={text}
							onChangeText={(val) => {
								setText(val);
								setSelectedAmount();
							}}
							keyboardType='numeric'
						/>
					</View>
				</View>
			</View>

			<View style={{width, paddingHorizontal: 12}}>
				{renderContent()}
			</View>
			
			<View style={{width, padding: 16}}>
				<View style={{ flexDirection: 'column', alignItems: 'baseline' }}>
					<Text style={{ color: Color.grayLight }}>Poinku</Text>
					<Text style={{ fontWeight: 'bold' }}>{FormatMoney.getFormattedMoney(vestaAmount, '')} Poin</Text>
				</View>

				<Divider />

				<Button
					onPress={() => onSubmit()}
				>
					Pasang Tawaran
				</Button>
			</View>

			<Loading {...loadingProps} /> 

			<Popup {...popupProps} />
		</Modalize>
	);
});

ModalBid.defaultProps = defaultProps;
export default ModalBid;
