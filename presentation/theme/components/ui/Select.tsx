/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleProp,
  ViewStyle,
  ScrollView,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { Input } from './Input';
import { AntDesign } from '@expo/vector-icons';
// import Icon from '@react-native-vector-icons/ionicons';

interface Option {
  label: string;
  value: any;
}

interface SelectProps {
  options: Option[];
  onSelect: (item: Option | null) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const Select = ({
  options: items,
  style,
  onSelect,
  className,
  placeholder,
}: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);
  const [options, setOptions] = useState(items);

  const handleSelect = (item: Option) => {
    setSelectedValue(item);
    onSelect(item);
    setModalVisible(false);
  };

  function filterOptions(
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ): void {
    const newItems = items.filter((item) =>
      item.label.toLowerCase().includes(e.nativeEvent.text.toLowerCase())
    );
    setOptions(newItems);
  }

  return (
    <View style={style} className={`${className}`}>
      <TouchableOpacity
        className="border border-white rounded-full h-12 flex flex-row px-5 justify-between items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {selectedValue ? selectedValue.label : placeholder || 'Seleccionar'}
        </Text>
        {modalVisible ? (
          <AntDesign
            className="transition-all duration-300"
            name="up"
            size={16}
            color={'white'}
          />
        ) : (
          <AntDesign
            className="transition-all duration-300"
            name="down"
            size={16}
            color={'white'}
          />
        )}
      </TouchableOpacity>
      {/* <Icon name="chevron-down" color="white" size={20} /> */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-['#0009']">
          <View className="flex gap-4 bg-white p-5 rounded-2xl w-10/12 max-h-['80%'] ">
            <Input
              placeholder="Search"
              onChange={filterOptions}
              placeholderTextColor={'#ccc'}
              style={{ color: 'black', borderColor: '#ccc' }}
            />
            <ScrollView>
              {options.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => handleSelect(item)}
                  className="px-2 py-3"
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-red-500">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButtonText: {
    color: 'white',
  },

  closeButton: {
    padding: 10,
    alignItems: 'center',
  },
});

export default Select;
