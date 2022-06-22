import { View, Text, TextInput,TouchableOpacity, ColorPropType } from 'react-native'
import React, {useRef} from 'react'
import Scaffold from '@src/components/Scaffold';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
import {Container, Divider} from '@src/styled';
import {
    useLoading,
    usePopup,
    useColor,
    Header,
    Row,
    Col,
    ModalListAction
  } from '@src/components';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const ReportArticle = () => {
    const {Color} = useColor();
    const modalListActionRef = useRef();

  return (
    <Scaffold
    headerTitle='Laporkan'
>
    <View style={{height: '85%'}}>
        <Text style={{paddingHorizontal: 15, fontWeight: 'bold'}}>Kenapa kamu melaporkan artikel ini?</Text>
        <Divider/>
        <TouchableOpacity onPress={() => modalListActionRef.current.open()}
         style={{ paddingVertical: 5,width: '92%',borderRadius: 5, alignSelf: 'center', paddingHorizontal: 10, borderWidth: 1, borderColor: Color.secondary, height: 45}}>
            <Text style={{fontSize: 8, color: Color.secondary,}}>Alasan</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{width: '95%'}}>Pilih Alasan</Text>
                <MaterialIcons name={'keyboard-arrow-down'} size={20}/>
            </View>
        </TouchableOpacity>
        <Divider/>
        <View>
            <Text style={{position: 'absolute', fontSize: 8, color: Color.secondary, paddingHorizontal: 25, paddingVertical: 8}}>Deskripsi</Text>
            <TextInput placeholder='Tuliskan deskripsi laporan di sini . . .' style={{paddingHorizontal: 10,width: '92%', borderRadius: 5, alignSelf: 'center',height: 150, borderColor: Color.secondary, borderWidth: 1}}> 

            </TextInput>
        </View>
        <Divider/>
        <View style={{alignItems: 'center',flexDirection: 'row',borderRadius: 5,alignSelf: 'center',backgroundColor: '#e2ebfe', width: '92%', height: 42,}}> 
            <IonIcons name={'information-circle-outline'} color={Color.secondary} style={{marginHorizontal: 10}}/>
            <Text style={{color: Color.secondary, fontSize: 10, width: '90%', lineHeight: 15}}>Laporan yang kamu dikirimkan akan ditindaklanjuti lebih jauh oleh admin</Text>
        </View>
    </View>
    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center',backgroundColor: Color.disabled, width:'90%', alignSelf: 'center', height: '5%', borderRadius: 30}}>
        <Text style={{color: Color.textInput}}>Laporkan</Text>
    </TouchableOpacity>

    <ModalListAction
                ref={modalListActionRef}
                data={[
                    {
                        id: 0,
                        name: 'Alasan',
                        color: Color.secondary,
                    },
                    {
                        id: 1,
                        name: 'Konten mengandung unsur SARA',
                        color: Color.text,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 2,
                        name: 'Mengandung unsur ketelanjangan',
                        color: Color.text,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 3,
                        name: 'Ini menghina dan berbahaya',
                        color: Color.text,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 4,
                        name: 'Terdapat tindakan kekerasan yang tidak wajar',
                        color: Color.text,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 5,
                        name: 'Ini mencurigakan atau spam',
                        color: Color.text,
                        onPress: () => {
                            modalListActionRef.current.close();
                        },
                    },
                ]}
            />
</Scaffold>
  )
}

export default ReportArticle