/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
// import Icon from '@react-native-vector-icons/ionicons';

interface Option {
  label: string;
  value: any;
}

interface SelectProps {
  options: Option[];
  onSelect: (item: Option | null) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({options, onSelect, placeholder}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);

  const handleSelect = (item: Option) => {
    setSelectedValue(item);
    onSelect(item);
    setModalVisible(false);
  };

  const renderItem = ({item}: {item: Option}) => (
    <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.selectButtonText}>
          {selectedValue ? selectedValue.label : placeholder || 'Seleccionar'}
        </Text>
      </TouchableOpacity>
      {/* <Icon name="chevron-down" color="white" size={20} /> */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={item => item.value.toString()}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: 'red'}}>Cerrar</Text>
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
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
  },
});

export default Select;
