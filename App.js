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

import { Drink } from './components/Drink';

export default function App() {

  const [currentLayers, setCurrentLayers] = useState([]);

  const [drinkLayers, setDrinkLayers] = useState([
    { colour: '#ff8383' },
    { colour: '#4b4d26' },
    { colour: '#adc685' },
    { colour: '#e0b8c2' },
    { colour: '#8c80a6' },
    { colour: '#7c5d87' },
    { colour: '#80916d' },
    { colour: '#fff4ef' },
    { colour: '#724813' },
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
      if(orderStrList[i].drink === playerDrink){
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
                <Text style={{ fontSize: 28, }}>{customer.face}</Text>
                <View style={{
                  width: 40,
                  height: 70,
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
    height: '50%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3c29e',
  },
  orders: {
    width: '33%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: 'silver',
    paddingTop: 60,
  },
  order: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  drinkWrapper: {
    flexGrow: 1,
    height: '100%',
    // backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContentWrapper: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3c29e',
  },
  resetBtn: {
    borderRadius: 5,
    backgroundColor: '#db9b71',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectorWrapper: {
    width: 250,
    height: 250,
    borderRadius: 5,
    padding: 10,
    // backgroundColor: 'lightgray',
    gap: 10,
    marginTop: 10,
  },
  drinkLayerRow: {
    flexDirection: 'row',
    flex: 3,
    gap: 10,
  },
  drinkLayerSquare: {
    flex: 1,
    borderRadius: 15,
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
