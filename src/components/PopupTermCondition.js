import React from 'react';
import {
    View,
} from 'react-native';
import Modal from 'react-native-modal';

import {
    Text,
    Submit,
    useColor,
} from '@src/components';

const PopupTermCondition = ({ visible, onSubmit, onClose }) => {
    const { Color } = useColor();

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={() => onClose()}
            animationIn="slideInDown"
            animationOut="slideOutDown"
            backdropColor={Color.semiwhite}
        >
            <View style={{ backgroundColor: Color.theme, width: '90%', alignItems: 'flex-start', alignSelf: 'center', borderRadius: 8, padding: 16}}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                    Syarat & Ketentuan
                </Text>
                <View style={{ paddingTop: 12 }}>
                    <Text align="left" style={{ fontWeight: 'bold', fontSize: 18 }}>
                        Larangan Komunitas
                    </Text>
                    <Text
                        align="left"
                        style={{ marginTop: 8 }}>
                        Dilarang keras membuat, menyebarkan serta ikut berkonstribusi
                        dalam kegiatan berikut ini :
                    </Text>
                    <Text
                        align="left"
                        style={{ marginTop: 8 }}>
                        1. Pornografi {'\n'}2. Perjudian {'\n'}3. Pemerasan {'\n'}4.
                        Penipuan {'\n'}5. Kekerasan {'\n'}6. Fitnah/pencemaran nama baik{' '}
                        {'\n'}7. Pelanggaran kekayaan intelektual {'\n'}8. Provokasi SARA{' '}
                        {'\n'}9. Berita HOAX (Bohong) {'\n'}10. Terorisme/Radikalisme{' '}
                        {'\n'}11. Informasi/dokumen elektronik pribadi yag bersifat
                        rahasia
                    </Text>
                    <Text
                        align="left"
                        style={{ marginTop: 8 }}>
                        Jika ada anggota yang melanggar salah satu/beberapa ketentuan
                        diatas, maka akan diberikan sanksi berupa pengeluaran anggota dari
                        aplikasi.
                    </Text>

                    <Submit
                        buttonLabel='Mengerti'
                        buttonColor={Color.primary}
                        type='bottomSingleButton'
                        buttonBorderTopWidth={0}
                        style={{ backgroundColor: Color.theme, paddingTop: 25 }}
                        onPress={() => {
                            onSubmit();
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default PopupTermCondition;