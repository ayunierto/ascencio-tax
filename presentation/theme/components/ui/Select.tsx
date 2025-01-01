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
    <View style={[styles.container, style]} className={`${className}`}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {selectedValue ? selectedValue.label : placeholder || 'Seleccionar'}
        </Text>
      </TouchableOpacity>
      {/* <Icon name="chevron-down" color="white" size={20} /> */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} className="flex gap-4">
            <Input
              placeholder="Search"
              className="border-gray-400 color-slate-900"
              onChange={filterOptions}
              placeholderTextColor={'#ccc'}
            />
            <ScrollView>
              {options.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'red' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 'auto',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    borderRadius: 30,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontSize: 16,
    color: 'white',
    height: 50,
  },
  selectButtonText: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '50%',
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
  },
});

export default Select;
