import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'

const DATA = [
    {
      id: 1,
      category: 'Hijab'
    },
    {
      id: 2,
      category: 'Fashion',
    },
    {
      id: 3,
      category: 'Instrument',
    },
    {
        id: 4,
        category: 'Kacamata',
    },
    {
        id: 4,
        category: 'Kacamata',
    },
    {
        id: 4,
        category: 'Kacamata',
    },
    {
        id: 4,
        category: 'Kacamata',
    },
  ];

const Category = () => {
    const renderItem = ({ item }) => (
        <View>
            <TouchableOpacity style={styles.btnCategory}>
        <Text style={styles.txtCategory}>{item.category}</Text>
            </TouchableOpacity>
        </View>
      );
    return (
        <View>
            <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data = {DATA}
            renderItem={renderItem}
            />
        </View>
    )
}

export default Category

const styles = StyleSheet.create({
    container:{
        borderRadius: 10
    },
    btnCategory: {
    width: 110,
    height: 35,
      borderWidth: 1,
      borderRadius: 15,
      backgroundColor: 'grey',
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center'
    },
    txtCategory:{
        color: 'white'
    }
  });
