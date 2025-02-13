import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  AnalyzeExpenseCommand,
  DetectDocumentTextCommand,
  FeatureType,
  TextractClient,
} from '@aws-sdk/client-textract';
import 'react-native-get-random-values';

import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

import Button from '@/presentation/theme/components/ui/Button';
import ImageViewer from '@/presentation/theme/components/ImageViewer';

const PlaceholderImage = require('@/assets/images/icon.png');

const ScanExpense = () => {
  const [data, setData] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // allowsEditing: true,
      // quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64 || null);
    } else {
      alert('You did not select any image.');
    }
  };

  const analyzeExpense = async () => {
    try {
      const config = {
        region: 'us-east-2',
        credentials: {
          accessKeyId: 'AKIA6PXJJGUAOV5Z7B5U',
          // accessKeyId: 'YOUR_ACCESS_KEY_ID',
          secretAccessKey: '2Eca8w0AM4S4BkiNFA1EfVTnjX1ZFA4yHbAvwSG0',
          // secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
        },
      };

      const client = new TextractClient(config);

      const input = {
        // AnalyzeExpenseRequest
        Document: {
          // Document
          Bytes: base64Image ? Buffer.from(base64Image, 'base64') : undefined, // convert image to byte
        },
      };
      const command = new AnalyzeExpenseCommand(input);

      const response = await client.send(command);
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer
            imgSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Button onPress={pickImageAsync}>Select image</Button>
          <Button onPress={analyzeExpense}>Run ORC</Button>
        </View>
        <Text style={{ marginTop: 10, color: 'white' }}>Image based64:</Text>

        {/* <Text style={{ marginTop: 10, color: 'white' }}>{base64Image}</Text> */}
        <View>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  imageContainer: {
    flex: 1,
  },
});

export default ScanExpense;
