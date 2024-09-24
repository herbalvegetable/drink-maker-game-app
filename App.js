import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Pressable,
} from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';

import { Drink } from './components/Drink';

export default function App() {

    const [currentLayers, setCurrentLayers] = useState([]);

    const [drinkLayers, setDrinkLayers] = useState([
        { colour: '#52681D' },
        { colour: '#2E3D17' },
        { colour: '#035718' },

        { colour: '#b9dca9' },
        { colour: '#E4EDB6' },
        { colour: '#bdbe2e' },

        { colour: '#76a51d' },
        { colour: '#e7ddff' },
        { colour: '#aaabb8' },
    ]);
    const getDrinkLayerGrid = (layers, chunkSize) => {
        let output = [];
        for (let i = 0; i < layers.length; i += chunkSize) {
            const chunk = layers.slice(i, i + chunkSize);
            output.push(chunk);
        }
        return output;
    }

    const handleAddToCurrentLayers = layer => {
        setCurrentLayers([{ ...layer }, ...currentLayers]);
    }
    const handleResetCurrentLayers = () => {
        setCurrentLayers([]);
    }

    /*
    order = {
      drink: {layers: [], topping: singular}
      customer: singular
    }
    */
    const [orders, setOrders] = useState([]);
    const ordersRef = useRef(orders);
    ordersRef.current = orders;
    const [customers, setCustomers] = useState([
        {
            face: '🐶',
            name: '',
        },
        {
            face: '🐱',
            name: '',
        },
        {
            face: '🐼',
            name: '',
        },
        {
            face: '🐻‍❄️',
            name: '',
        },
        {
            face: '🐸',
            name: '',
        },
        {
            face: '🐨',
            name: '',
        },
        {
            face: '🐯',
            name: '',
        },
        {
            face: '🦊',
            name: '',
        },
        {
            face: '🐵',
            name: '',
        },
        {
            face: '🙂',
            name: '',
        },
        {
            face: '👽',
            name: '',
        },
        {
            face: '🤖',
            name: '',
        },
    ]);
    const getShuffledItemsFromArray = (arr, count) => {
        let currArr = [...arr];
        let output = [];
        for (let i = 0; i < count; i++) {
            let randIndex = Math.floor(Math.random() * currArr.length);
            output.push(currArr[randIndex]);
            currArr.splice(randIndex, 1);
        }
        return output;
    }
    const getRandomDrink = () => {
        let layerNum = Math.floor(Math.random() * 3) + 1;
        let layers = getShuffledItemsFromArray(drinkLayers, layerNum);
        return { layers };
    }
    const getRandomCustomer = () => {
        return { ...customers[Math.floor(Math.random() * customers.length)] }
    }
    const getRandomOrder = () => {
        return {
            drink: getRandomDrink(),
            customer: getRandomCustomer(),
        }
    }
    const handleAddOrder = (orders, order) => {
        // console.log('Add order', [...orders], order, [...orders, order]);
        setOrders([...orders, order]);
    }
    const handleCompleteOrder = (orderIndex) => {
        let newOrders = [...orders];
        newOrders.splice(orderIndex, 1);
        setOrders(newOrders);

        handleResetCurrentLayers();
    }
    // create a timer to spawn new orders
    let spawnOrderIntervalRef = useRef();
    useEffect(() => {
        spawnOrderIntervalRef.current = setInterval(() => {
            if (ordersRef.current.length >= 3) {
                console.log('Too many orders. Rejecting new order.');
                return;
            };
            handleAddOrder(ordersRef.current, getRandomOrder());
        }, 3000);
    }, [])
    useEffect(() => {
        console.log(orders);
    }, [orders]);

    const convertDrinkToString = (drink) => {
        let { layers } = drink;

        let drinkStr = '';
        drinkStr += layers.map(layer => layer.colour).join('.');
        drinkStr += '/';
        return drinkStr;
    }

    const handleSendOrder = (drink) => {
        //drinkToSend will be a simple string to check
        let playerDrink = convertDrinkToString(drink);
        let orderStrList = orders.map(ord => {
            return {
                drink: convertDrinkToString(ord.drink),
                customer: ord.customer,
            }
        });
        for (let i = 0; i < orderStrList.length; i++) {
            if (orderStrList[i].drink === playerDrink) {
                handleCompleteOrder(i);
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.topContentWrapper}>
                <View style={styles.orders}>
                    {/* <Text>Orders</Text> */}
                    {
                        orders.slice(0, 3).map((order, orderIndex) => {
                            const { drink, customer } = order;
                            return <View
                                key={orderIndex.toString()}
                                style={styles.order}>
                                <Text style={{ fontSize: 24, }}>{customer.face}</Text>
                                <View style={{
                                    width: 60,
                                    height: 90,
                                    backgroundColor: 'white',
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                }}>
                                    <Drink layers={drink.layers} />
                                </View>
                            </View>
                        })
                    }
                </View>
                <View style={styles.drinkWrapper}>
                    <View style={{
                        width: 70,
                        height: 150,
                    }}>
                        <Drink layers={[...currentLayers]} />
                    </View>
                </View>
            </View>

            <View style={styles.bottomContentWrapper}>
                <Pressable
                    style={styles.resetBtn}
                    onPress={() => handleResetCurrentLayers()}>
                    <Text style={{ color: 'white' }}>RESET DRINK</Text>
                </Pressable>
                <View style={styles.selectorWrapper}>
                    {
                        getDrinkLayerGrid(drinkLayers, 3).map((row, rowIndex) => {
                            return (
                                <View
                                    key={rowIndex.toString()}
                                    style={styles.drinkLayerRow}>
                                    {
                                        row.map((layer, layerIndex) => {
                                            const { colour } = layer;
                                            return <Pressable
                                                key={layerIndex.toString()}
                                                onPressIn={() => {
                                                    if (currentLayers.length >= 3) return;
                                                    handleAddToCurrentLayers({ ...layer });
                                                }}
                                                style={{
                                                    backgroundColor: colour,
                                                    ...styles.drinkLayerSquare,
                                                }}
                                            >
                                            </Pressable>
                                        })
                                    }
                                </View>
                            )
                        })
                    }
                </View>
                <Pressable
                    style={styles.sendBtn}
                    onPress={() => handleSendOrder({
                        layers: currentLayers,
                    })}>
                    <Text style={{ color: 'white' }}>SEND DRINK</Text>
                </Pressable>
            </View>

            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
    },
    topContentWrapper: {
        width: '100%',
        height: '55%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#bf9059',
    },
    orders: {
        width: '100%',
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'silver',
        gap: 15,
    },
    order: {
        flexDirection: 'row',
        gap: 15,
        // backgroundColor: 'beige',
    },
    drinkWrapper: {
        flexGrow: 1,
        width: '100%',
        // backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContentWrapper: {
        width: '100%',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ccaa66',
        borderTopWidth: 2,
        borderColor: 'black',
    },
    resetBtn: {
        borderRadius: 5,
        backgroundColor: '#db9b71',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    selectorWrapper: {
        width: 300,
        height: 200,
        borderRadius: 5,
        // backgroundColor: 'lightgray',
        gap: 10,
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drinkLayerRow: {
        flexDirection: 'row',
        flex: 3,
        gap: 10,
    },
    drinkLayerSquare: {
        flex: 1,
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 2,
    },
    sendBtn: {
        borderRadius: 5,
        backgroundColor: '#724813',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});
