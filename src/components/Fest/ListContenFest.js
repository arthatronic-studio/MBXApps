import React, {useState, useEffect} from 'react';
import {View, FlatList, useWindowDimensions} from 'react-native';
import PropTypes from 'prop-types';

import {ScreenEmptyData} from '@src/components';
import {Container, Divider, Row} from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import {initialItemState} from 'src/utils/constants';
import {fetchContentProduct, fetchContentUserProduct} from 'src/api/content';
import CardContentProduct from '@src/components/Content/CardContentProduct';
import {getAPI} from 'src/api-rest/httpService';
import PostingHeader from '../Posting/PostingHeader';
import CardContentFest from './CardContentFest';
import imageAssets from 'assets/images';

const propTypes = {
  userProfileId: PropTypes.number,
  productCategory: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  horizontal: PropTypes.bool,
  style: PropTypes.object,
  onLoadingEnd: PropTypes.func,
  showSeeAllText: PropTypes.bool,
};

const defaultProps = {
  userProfileId: null,
  productCategory: '',
  name: '',
  horizontal: false,
  style: {},
  onLoadingEnd: () => {},
  ListHeaderComponent: null,
  title: '',
  showSeeAllText: false,
  showHeader: false,
  onPress: () => {},
};

const ListContenFest = ({
  userProfileId,
  productCategory,
  name,
  horizontal,
  style,
  onLoadingEnd,
  ListHeaderComponent,
  showHeader,
  title,
  showSeeAllText,
  onPress,
}) => {
  const {width} = useWindowDimensions();
  const [itemData, setItemData] = useState(initialItemState);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (itemData.loadNext && itemData.page !== -1) {
      fetchData();
    }
  }, [itemData.loadNext]);

  const fetchData = async () => {
    // const result = await getAPI('event');

    // console.log('result', result);
    let newData = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];
    if (productCategory === 'ARTS') {
      newData = [
        {
          id: 1,
          imageBanner: imageAssets.festArts1,
          title: 'Pasar Wastra',
          date: '26 - 28 Sep 2022',
          location: 'Creative Hall',
          desc: 'Ada banyak keseruan #BerkainDiFestival yang menanti! \nSelain berbelanja kain, dipastikan teman-teman Remaja Nusantara akan banyak memberikan edukasi, memandu dan jadi kawan baru bagi kita untuk menjelajah kekayaan wastra Indonesia.\nAda panggung gembira dengan bermacam disjoki yang akan memainkan musik Indonesia terbaik.\nKabarnya, beberapa penampil di M Bloc Fest juga akan berbusana dengan kain-kain Indonesia, loh! Siapa saja ya? 🤔🙌🏻 \n Mari rayakan bersama di M Bloc Fest dan jadi bagian dari keseruan ini!',
          gallery: [
            imageAssets.festArts1,
            imageAssets.festArts2,
            imageAssets.festArts3,
          ],
          schedule: [
            {
              id: 1,
              title: 'Pasar Wastra',
              date: '28 Sep 2022'
            },
            {
              id: 2,
              title: 'Panggung Gembira',
              date: '28 Sep 2022'
            },
            {
              id: 3,
              title: 'Lokakarya Berkain',
              date: '28 Sep 2022'
            },
          ]
        },
        {
          id: 2,
          imageBanner: imageAssets.designWeek1,
          title: 'mbloc Design Week',
          date: '04 - 16 Okt 2022',
          location: 'Creative Hall',
          desc: 'M Bloc Design Week #MBDW22 akan menjadi ruang bagi para komunitas, pelaku dan pecinta desain di Indonesia untuk bertukar pikiran, pamer karya hingga berjejaring demi memantik ide karya selanjutnya! ✨\nMelalui karya-karya yang dipamerkan, bincang kreatif hingga workshop, semuanya akan berlangsung selama dua pekan dan bisa diikuti secara gratis.',
          gallery: [
            imageAssets.designWeek1,
            imageAssets.designWeek2,
            imageAssets.designWeek3,
            imageAssets.designWeek4,
            imageAssets.designWeek5,
            imageAssets.designWeek6,
            imageAssets.designWeek7,
          ],
          schedule: [
            {
              id: 1,
              title: 'Creative Talks',
              date: '04 - 16 Okt 2022'
            },
            {
              id: 2,
              title: 'Design Talks',
              date: '04 - 16 Okt 2022'
            },
            {
              id: 3,
              title: 'Workshop',
              date: '04 - 16 Okt 2022'
            },
            {
              id: 4,
              title: 'Music Performances',
              date: '04 - 16 Okt 2022'
            },
          ]
        },
      ];
    }
    if(productCategory === 'CardSchedule'){
      newData = [
        {
          id: 1,
          title: 'Creative Talks',
          date: '04 - 16 Okt 2022'
        },
        {
          id: 2,
          title: 'Design Talks',
          date: '04 - 16 Okt 2022'
        },
        {
          id: 3,
          title: 'Workshop',
          date: '04 - 16 Okt 2022'
        },
        {
          id: 4,
          title: 'Music Performances',
          date: '04 - 16 Okt 2022'
        },
      ]
    }
    if(productCategory === 'LITERATUR'){
      newData = [
        {
          id: 1,
          imageBanner: imageAssets.bookFestival1,
          title: 'The Writers Book Festival',
          date: '24 - 25 Sep 2022',
          location: 'Lobby Area',
          desc: 'Bekerja sama dengan komunitas “The Writers”, The Writers Book Festival akan menjadi salah satu program komunitas yang tergabung dalam M Bloc Fest. Festival ini akan fokus untuk memasyarakatkan literasi ke banyak orang.\n\nAcara ini akan meliputi pameran buku dari penulis-penulis lokal, Pameran kutipan-kutipan, kelas penulisan buku, dan juga musikalisasi puisi.',
          gallery: [
            imageAssets.bookFestival1,
            imageAssets.bookFestival2,
            imageAssets.bookFestival3,
            imageAssets.bookFestival1,
            imageAssets.bookFestival2,
            imageAssets.bookFestival3,
          ],
          schedule: [
            {
              id: 1,
              title: 'Bedah Buku',
              date: '24 Sep - 25 Sep 2022',
              desc: [
                {
                  title: 'ME 7 THE POWER OF MUSIC',
                  desc: 'Fairuz'
                },
                {
                  title: 'SOSIALIJAH',
                  desc: 'Citra'
                },
                {
                  title: 'PANGERAN DARI TIMUR',
                  desc: 'Iksaka Banu & Kurnia'
                },
                {
                  title: 'TANGGU DI TENGAH PANDEMI BELAJAR DARI BAKTERI',
                  desc: 'Yanki Hartijasti'
                },
              ]
            },
            {
              id: 2,
              title: 'Peluncuran Buku',
              date: '24 Sep - 25 Sep 2022',
              desc: [
                {
                  title: 'Nusantara Pelabuhan Hati',
                  desc: 'Sony Tan'
                },
                {
                  title: 'Orang-Orang Dari Tepi Kali',
                  desc: 'Dedi Vansophi'
                },
                {
                  title: 'Rempah Kita Nusantara',
                  desc: 'Lily Setiadinata dkk'
                },
              ]
            },
            {
              id: 3,
              title: 'Pameran Buku & Quotes',
              date: '24 Sep - 25 Sep 2022',
              desc: [
                {
                  title: 'Quotes',
                  desc: 'The Writes Book Community'
                },
              ]
            },
            {
              id: 4,
              title: 'Penampilan Musik',
              date: '24 Sep - 25 Sep 2022',
              desc: [
                {
                  title: 'Aura Diva',
                },
                {
                  title: 'Tya Subiakto',
                },
              ]
            },
          ]
        },
        {
          id: 2,
          imageBanner: imageAssets.bookFair1,
          title: 'Jakarta Art Book Fair 2022',
          date: '30 Sep - 02 Okt 2022',
          location: 'Creative Hall & Bloc Bar',
          desc: 'Kolaborasi bersama penyelenggara Jakarta Art Book Fair. Acara ini adalah sebuah pameran terkurasi dengan tujuan untuk memamerkan, menjual, dan menghubungkan para artis, kreator art book, illustrator, penulis, pencetak, dan sejenisnya.\n\nJKTABF akan menjadi pekan raya buku seni pertama di Jakarta dan di Indonesia yang akan menghadirkan 50 exhibitor lokal dan nternasional.',
          gallery: [
            imageAssets.bookFair1,
            imageAssets.bookFair2,
            imageAssets.bookFair3,
          ],
          schedule: [
            {
              id: 1,
              title: 'Talks (30 Sep)',
              date: '30 Sep 2022',
              desc: [
                {
                  title: 'Creative Solutions for Independent Publishers',
                  time: '13:30 - 14:30',
                  desc: 'oleh Fadhil (Qualita), Fandy (JKTABF), Kervin, Adhi (Fedrigoni Indonesia)'
                },
                {
                  title: 'Ragam Penyelenggaraan Alternatif Buku Foto: Dari Penerbitan Hingga Distribusi',
                  time: '14:45 - 15:45',
                  desc: 'oleh Aditya Pratama (Unobtainimum), Daud Sihombing (Kamboja Press), Prasety Yudha (Sokong)'
                },
                {
                  title: 'The Making of Award-Winning Books',
                  time: '16:15 - 17:15',
                  desc: 'oleh Lans Brahmantyo'
                },
                {
                  title: 'Art Publishing in The Southeast Asia',
                  time: '18:30 - 19:30',
                  desc: 'Oleh Yipei (SUAVEART, Taiwan), Nadya (Art Market, Singapore), Unlyy n Pep (Thailand)',
                },
              ]
            },
            {
              id: 2,
              title: 'Performance (30 Sep)',
              date: '30 Sep 2022',
              desc: [
                {
                  title: 'Budayakan Membaca Yang Tidak Benar by Dika+Lija',
                  time: '14:00 - 17:00',
                  desc: 'Budaya membaca yang tidak benar is a performance-based installation situated in the heart of the Jakarta Art Book Fair.\n\nIn the spirit of going against the classist academic systems, the project takes form in a public service announccement: disseminating a subversive manifesto on ways to read a book incorrectly'
                },
                {
                  title: 'Zine Launch: “Karaat Theater Show”',
                  time: '17:00 - 18:00',
                  desc: 'Puppetry performance/zine launch by Godmatter Published by Further reading press',
                }
              ]
            },
          ]
        },
      ];
    }


    setItemData({
      ...itemData,
      data: itemData.data.concat(newData),
      // data: [],
      // page: result.status === false ? itemData.page : result.data.length > 0 ? itemData.page + 1 : -1,
      page: -1,
      loading: false,
      loadNext: false,
      message: 'OK',
      // message: result.message,
      refresh: false,
    });

    onLoadingEnd(false);
  };

  const renderHeader = () => {
    return (
      <PostingHeader
        title={title}
        onSeeAllPress={() => {
          // navigation.navigate(nav, { title, userProfileId });
        }}
        productCategory={productCategory}
        showSeeAllText={showSeeAllText}
        style={{paddingHorizontal: 8}}
      />
    );
  };

  const renderSkeleton = () => {
    return (
      <Container paddingLeft={16} paddingTop={16} paddingRight={32}>
        <Row>
          <PostingSkeleton />
          <PostingSkeleton />
        </Row>
      </Container>
    );
  };

  let extraProps = {numColumns: 1};
  if (productCategory === 'LINEUP') extraProps.numColumns = 2;
  if (productCategory === 'AREA') extraProps.numColumns = 2;
  if (horizontal) extraProps = {};

  return (
    <View style={{}}>
      {showHeader && horizontal && renderHeader()}

      {itemData.loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          keyExtractor={(item, index) => item.toString() + index}
          data={itemData.data}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingHorizontal: 8,
            ...style,
          }}
          onEndReachedThreshold={0.3}
          onEndReached={() => setItemData({...itemData, loadNext: true})}
          {...extraProps}
          renderItem={({item, index}) => {
            if (index === 0) {
              return (
                <>
                  {showHeader && !horizontal && renderHeader()}

                  <CardContentFest
                    productCategory={productCategory}
                    item={item}
                    horizontal={horizontal}
                    onPress={onPress}
                    {...extraProps}
                  />
                </>
              );
            }

            return (
              <CardContentFest
                productCategory={productCategory}
                item={item}
                horizontal={horizontal}
                onPress={onPress}
                {...extraProps}
              />
            );
          }}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={() => {
            return (
              <>
                {showHeader &&
                  !horizontal &&
                  !itemData.loading &&
                  itemData.data.length === 0 &&
                  renderHeader()}

                <ScreenEmptyData
                  message={`${name} belum tersedia`}
                  style={{width: width - 16}}
                />
              </>
            );
          }}
        />
      )}
    </View>
  );
};

ListContenFest.propTypes = propTypes;
ListContenFest.defaultProps = defaultProps;
export default ListContenFest;