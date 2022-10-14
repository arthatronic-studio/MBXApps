import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  onRefresh,
  RefreshControl,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import Banner from 'src/components/Banner';
import {useColor, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {queryBannerList} from 'src/lib/query/banner';
import {Row, Divider, Container} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import client from 'src/lib/apollo';
import HighlightContentProductV2 from 'src/components/Content/HighlightContentProductV2';
import moment from 'moment';
import {useCurrentUser} from 'src/hooks/useCanGenerateContent';
import HighlightArticle from './HighlightArticle';
import ListTenantItem from 'src/screens/Tenant/ListTenantItem';
import ListArticle from './ListArticle';
import imageAssets from 'assets/images';

const DetailArticleScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const {height, width} = useWindowDimensions();
  const scrollRef = useRef();

  const cardImage = (image) => {
    return (
      <Container align="center">
        <Image
          source={image}
          style={{
            width: '100%',
            height: width / 3,
            resizeMode: 'cover',
          }}
        />
        <Divider height={8} />
        <Container width="80%">
          <Text size={9} lineHeight={15} color={'#AEAEAE'} type="medium">
            Sekte Komik IKJ tahun 1996. Yang mana Pepeng Naif, Adi Cumi dan
            Andri Lemes? [Foto: dok. Andri lemes]
          </Text>
        </Container>
        <Divider height={8} />
        <Container align="center" flex={1} flexDirection="row">
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
          <Divider width={8} />
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
          <Divider width={8} />
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
        </Container>
      </Container>
    );
  };

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}>
      <ScrollView ref={scrollRef}>
          <View
            style={{
              width: '100%',
              height: width * 1.21,
              paddingHorizontal: 16
            }}>
            <Image
              source={imageAssets.article1}
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            />
          </View>
          <Divider height={18} />
          <Container flex={1} flexDirection="row" paddingHorizontal={16}>
            <Container
              flex={1}
              marginRight={4}
              flexDirection="row"
              align="flex-start">
              <Text size={12} type="medium" lineHeight={14.4}>
                ●
              </Text>
              <Divider width={4} />
              <Container flex={1}>
                <Text
                  align="left"
                  size={10}
                  lineHeight={14.4}
                  type="semibold"
                  color={Color.black}>
                  ARTICLE
                </Text>
                <Text align="left" size={10} lineHeight={12} type="medium">
                  Wendi Putranto 11 Sept 2022
                </Text>
              </Container>
            </Container>
            <Container flex={4} marginLeft={4}>
              {/* title */}
              <Text size={24} lineHeight={28.8} type="semibold" align="left">
                Institut Kesenian Jakarta: SCHOOL OF ROCK [Editor's Cut]
              </Text>

              <Divider height={16} />

              {/* subtitle */}
              <Text size={12} lineHeight={16} type="semibold" align="left">
                Institut Kesenian Jakarta adalah kampus yang banyak mencetak
                “gembel naik kelas.”
              </Text>

              <Divider height={16} />

              {/* desc */}
              <Text
                align="left"
                size={12}
                lineHeight={18}
                color={Color.black}
                type="medium">
                “Tahun ini udah tiga kali kami reuni. Mudah-mudahan ini
                benar-benar reuni kami yang terakhir dan tidak ada reuni lagi di
                masa depan,” ujar Andri, vokalis Rumahsakit dengan nada datar
                seraya menurunkan stand mikropon yang terlihat agak ketinggian
                bagi dirinya. Para penonton yang mayoritas mahasiswa Institut
                Kesenian Jakarta [IKJ] hanya tersenyum saja mendengar ucapannya.
                “Sebelum ada Rumahsakit, musik di IKJ cuma Rolling Stones, The
                Doors dan Bob Marley,” puji Ricky MH Malau dan Jimi Multhazam
                usai Rumahsakit manggung. Dua orang berkarakter keras tersebut
                malam itu menjadi MC bagi acara Nostalgia di Plaza Luwes. Di
                penghujung dekade 90an, dynamic duo ini memang MC sakti yang
                setia mengawal berbagai acara musik di IKJ dengan
                banyolan-banyolan cerdas mereka.{'\n\n'}Malam itu memang malam
                yang istimewa, khususnya bagi scene musik IKJ. Band-band seperti
                Rumahsakit, Naif, Clubeighties, The Upstairs, White Shoes & The
                Couples Company, The Adams, Goodnight Electric, The Sastro dan
                sebagainya manggung reuni di kampus untuk merayakan ulang tahun
                IKJ yang ke-36 sekaligus bernostalgia di almamater yang telah
                melahirkan mereka semua. Tidak terlalu berlebihan rasanya jika
                dibilang satu dekade belakangan ini adalah the golden era dari
                scene musik IKJ mengingat kiprah mereka yang istimewa di luar
                kampus.
              </Text>

              <Divider height={16} />

              {cardImage(imageAssets.article2)}

              <Divider height={16} />

              <Text
                align="left"
                size={12}
                lineHeight={18}
                color={Color.black}
                type="medium">
                Andri Ashari adalah figur sentral Rumahsakit, sebuah band pop
                yang menjadi pelopor lahirnya scene musik IKJ di awal dekade
                90-an. Pria lajang berusia 33 tahun yang terlihat sangat awet
                muda ini masuk ke Fakultas Seni Rupa Desain IKJ pada tahun 1992.
                Ia sebenarnya lulus SMA tahun 1991 dan sebelumnya sempat gagal
                dua kali tes masuk ITB. Seniornya di IKJ kemudian memberinya
                julukan Andri Lemes karena kondisinya yang sering terlihat
                lemas. Belakangan saya mendengar julukannya berubah menjadi
                Andri Kenceng karena makin meningkatnya aktivitas di berbagai
                diskotik dan klub malam Jakarta.
              </Text>

              <Divider height={16} />

              {cardImage(imageAssets.article3)}

              <Divider height={16} />

              <Text
                align="left"
                size={12}
                lineHeight={18}
                color={Color.black}
                type="medium">
                Awal masuk kuliah Andri masih berambut gondrong dan menggemari
                musik thrash metal/grindcore seperti Slayer, Godflesh, Nocturnus
                dan Death Angel. Kebetulan zaman itu memang masa jayanya thrash
                metal dan tak sedikit anak muda ibukota yang kemudian masuk
                lingkaran setan: menjadi “anak metal.” Suatu malam di tahun 1989
                Andri menyaksikan program Chart Attack di RCTI yang menampilkan
                video klip “I Wanna Be Adored” dari The Stone Roses. Video
                itulah yang kemudian mengubah hidup Andri untuk selamanya.
                “Waktu itu RCTI masih pakai decoder untuk menangkap sinyal
                siarannya, tapi nggak tahu kenapa TV di rumah gue bisa menangkap
                siarannya tanpa decoder. Aneh,” ujarnya mengenang.
              </Text>
              <Divider height={16} />
              <Container flex={1} flexDirection="row" justify='center'>
                <Image
                  source={imageAssets.iconApp}
                  style={{
                    height: 8,
                    width: 8,
                    resizeMode: 'contain',
                  }}
                />
                <Divider width={8} />
                <Image
                  source={imageAssets.iconApp}
                  style={{
                    height: 8,
                    width: 8,
                    resizeMode: 'contain',
                  }}
                />
                <Divider width={8} />
                <Image
                  source={imageAssets.iconApp}
                  style={{
                    height: 8,
                    width: 8,
                    resizeMode: 'contain',
                  }}
                />
              </Container>
            </Container>
          </Container>
          <Divider height={24} />
          <HighlightArticle
            title='● OTHER ARTICLES'
            numColumns={1}
            tenantType='eat'
            showSeeAllText={false}
          />
      </ScrollView>
    </Scaffold>
  );
};

export default DetailArticleScreen;
