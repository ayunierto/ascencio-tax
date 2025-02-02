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

interface SelectProps {
  options: Option[];
  onSelect: (item: Option | null) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  enableFilter?: boolean;
  defaultSelected?: Option;
  readOnly?: boolean;
}

interface Option {
  label: string;
  value: any;
}

const Select = ({
  options: initialOptions,
  style,
  onSelect,
  placeholder,
  enableFilter = true,
  defaultSelected,
  readOnly = false,
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
    <View style={style}>
      <Button
        disabled={readOnly}
        iconRight={
          <AntDesign
            name={modalVisible ? 'up' : 'down'}
            // size={12}
            color={'white'}
          />
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
              {filteredOptions.map((item) => (
                <Button
                  iconLeft={
                    selectedValue && selectedValue.label === item.label ? (
                      <Ionicons
                        name="checkbox-outline"
                        size={20}
                        color={theme.primary}
                      />
                    ) : (
                      <Ionicons
                        name="square-outline"
                        size={20}
                        color={theme.muted}
                      />
                    )
                  }
                  key={item.label}
                  variant="ghost"
                  onPress={() => handleSelect(item)}
                  containerTextAndIconsStyle={{
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedValue && selectedValue.label === item.label
                          ? theme.primary
                          : '#000',
                      fontWeight:
                        selectedValue && selectedValue.label === item.label
                          ? 'bold'
                          : 'normal',
                    }}
                  >
                    {item.label}
                  </Text>
                </Button>
              ))}
            </ScrollView>

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
