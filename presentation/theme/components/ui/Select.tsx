import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Input } from './Input';
import Button from './Button';
import { theme } from './Theme';
import Divider from './Divider';

interface SelectProps {
  enableFilter?: boolean;
  options: Option[];
  placeholder?: string;
  readOnly?: boolean;
  selectedOptions?: Option;
  style?: StyleProp<ViewStyle>;

  /**
   * On Select.
   * @param {Option} option - Option to return.
   * @returns {void}
   * @deprecated This property is deprecated. Use the `onChange` property instead.
   */
  onSelect?: (option: Option) => void;
  onChange?: (id: string) => void;
}

export interface Option {
  label: string;
  value: string;
}

const Select = ({
  enableFilter = true,
  onChange,
  onSelect,
  options: initialOptions,
  placeholder,
  readOnly = false,
  selectedOptions: defaultSelected,
  style,
}: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] =
    useState<Option[]>(initialOptions);

  useEffect(() => {
    if (defaultSelected) {
      setSelectedValue(defaultSelected);
    }
  }, [defaultSelected]);

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

  const handleSelect = (option: Option) => {
    setSelectedValue(option);
    if (onSelect) onSelect(option);
    if (onChange) onChange(option.value);
    setModalVisible(false);
    setSearchText(''); // Clean the search text when selecting an option
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={style}>
      <Button
        disabled={readOnly}
        iconRight={
          <AntDesign name={modalVisible ? 'up' : 'down'} color={'white'} />
        }
        variant="outlined"
        textStyle={{ fontWeight: 'normal', fontSize: 14 }}
        onPress={() => setModalVisible(true)}
        containerTextAndIconsStyle={{ justifyContent: 'space-between' }}
      >
        <Text style={styles.selectButtonText}>
          {selectedValue ? (
            selectedValue.label
          ) : placeholder ? (
            <Text style={{ color: theme.muted }}>{placeholder}</Text>
          ) : (
            'Select'
          )}
        </Text>
      </Button>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0009',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              width: '90%',
              maxWidth: 360,
              maxHeight: '80%',
            }}
          >
            {enableFilter && (
              <Input
                placeholder="Search"
                onChange={(e) => handleSearchChange(e.nativeEvent.text)}
                value={searchText}
                placeholderTextColor={theme.mutedForeground}
                style={{ color: 'black', borderColor: theme.mutedForeground }}
              />
            )}
            <ScrollView>
              {filteredOptions.map((option) => (
                <Button
                  key={option.label}
                  iconLeft={
                    <Ionicons
                      name={
                        selectedValue && selectedValue.label === option.label
                          ? 'checkbox-outline'
                          : 'square-outline'
                      }
                      size={20}
                      color={
                        selectedValue && selectedValue.label === option.label
                          ? theme.primary
                          : theme.muted
                      }
                    />
                  }
                  variant="ghost"
                  onPress={() => handleSelect(option)}
                  containerTextAndIconsStyle={{
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedValue && selectedValue.label === option.label
                          ? theme.primary
                          : '#000',
                      fontWeight:
                        selectedValue && selectedValue.label === option.label
                          ? 'bold'
                          : 'normal',
                    }}
                  >
                    {option.label}
                  </Text>
                </Button>
              ))}
            </ScrollView>

            <Divider style={{ backgroundColor: '#eee', marginVertical: 10 }} />

            <Button
              variant="outlined"
              onPress={() => {
                setModalVisible(false);
                setSearchText('');
              }}
            >
              <Text style={{ color: theme.destructive }}>Close</Text>
            </Button>
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
});

export default Select;
