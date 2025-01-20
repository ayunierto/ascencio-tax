/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ScrollView,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { Input } from './Input';
import { AntDesign } from '@expo/vector-icons';
import Button from './Button';
import { theme } from './Theme';

interface SelectProps {
  options: Option[];
  onSelect: (item: Option | null) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

interface Option {
  label: string;
  value: any;
}

const Select = ({
  options: initialOptions,
  style,
  onSelect,
  className,
  placeholder,
}: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] =
    useState<Option[]>(initialOptions);

  useEffect(() => {
    if (searchText === '') {
      setFilteredOptions(initialOptions);
    } else {
      const newItems = initialOptions.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredOptions(newItems);
    }
  }, [searchText, initialOptions]); // It runs when search text or items changes

  const handleSelect = (item: Option) => {
    setSelectedValue(item);
    onSelect(item);
    setModalVisible(false);
    setSearchText(''); // Clean the search text when selecting an option
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={style} className={`${className}`}>
      <Button
        iconRight={
          <AntDesign
            name={modalVisible ? 'up' : 'down'}
            size={16}
            color={'white'}
          />
        }
        variant="outlined"
        style={{ borderColor: theme.input }}
        textStyle={{ fontWeight: 'normal', fontSize: 14 }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {selectedValue ? selectedValue.label : placeholder || 'Select'}
        </Text>
      </Button>

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
              onChange={(e) => handleSearchChange(e.nativeEvent.text)}
              value={searchText}
              placeholderTextColor={'#ccc'}
              style={{ color: 'black', borderColor: '#ccc' }}
            />
            <ScrollView>
              {filteredOptions.map((item) => (
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
              onPress={() => {
                setModalVisible(false);
                setSearchText('');
              }}
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
