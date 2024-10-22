import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '@/AuthContext';
import { useRouter } from 'expo-router';
import { db } from '@/firebaseconfig';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

const getImageDataURI = async (uri: string): Promise<string> => {
  const response = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  return `data:image/jpeg;base64,${response}`;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currentExpenseId, setCurrentExpenseId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [image, setImage] = useState<string | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'This app needs permission to access your media library.');
      }
    })();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'expenses'), (snapshot) => {
        const expensesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expensesData);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      router.push('/login');
    }
  }, [user]);

  const handleAddOrUpdateExpense = async () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      if (currentExpenseId) {
        const expenseRef = doc(db, 'users', user.uid, 'expenses', currentExpenseId);
        await updateDoc(expenseRef, {
          amount: parseFloat(amount),
          description,
          image,
          createdAt: new Date(),
        });
      } else {
        await addDoc(collection(db, 'users', user.uid, 'expenses'), {
          amount: parseFloat(amount),
          description,
          image,
          createdAt: new Date(),
        });
      }

      setAmount('');
      setDescription('');
      setImage(null);
      setCurrentExpenseId(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding/updating expense: ", error);
    }
  };

  const handleEditExpense = (expense: any) => {
    setAmount(expense.amount.toString());
    setDescription(expense.description);
    setCurrentExpenseId(expense.id);
    setImage(expense.image);
    setModalVisible(true);
  };

  const handleDeleteExpense = async (id: string) => {
    const expenseRef = doc(db, 'users', user.uid, 'expenses', id);
    await deleteDoc(expenseRef);
  };

  const groupExpensesByDate = (expenses: any[]) => {
    const grouped: { [key: string]: any[] } = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt.seconds * 1000);
      const dateString = date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!grouped[dateString]) {
        grouped[dateString] = [];
      }
      grouped[dateString].push(expense);
    });

    return grouped;
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.createdAt.seconds * 1000);
    return (
      expenseDate.getFullYear() === selectedYear &&
      expenseDate.getMonth() === selectedMonth - 1
    );
  });

  const groupedExpenses = groupExpensesByDate(filteredExpenses);

  const generateReport = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const reportExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt.seconds * 1000);
      return expenseDate >= start && expenseDate <= end;
    });
  
    if (reportExpenses.length === 0) {
      Alert.alert('No Data', 'No expenses found for the selected date range.');
      return;
    }
  
    let totalAmount = 0;
    reportExpenses.forEach(expense => {
      totalAmount += expense.amount;
    });
  
    const reportContent = `
      <html>
        <body style="color: black; background-color: white;">
          <h1>Expense Report</h1>
          <p>From: ${startDate} To: ${endDate}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid black; padding: 8px;">Date</th>
              <th style="border: 1px solid black; padding: 8px;">Description</th>
              <th style="border: 1px solid black; padding: 8px;">Amount</th>
              <th style="border: 1px solid black; padding: 8px;">Image</th>
            </tr>
            ${(await Promise.all(reportExpenses.map(async (expense) => {
              const expenseDate = new Date(expense.createdAt.seconds * 1000).toLocaleDateString();
              const imageUri = expense.image ? await getImageDataURI(expense.image) : null;
              return `
                <tr>
                  <td style="border: 1px solid black; padding: 8px;">${expenseDate}</td>
                  <td style="border: 1px solid black; padding: 8px;">${expense.description}</td>
                  <td style="border: 1px solid black; padding: 8px;">$${expense.amount.toFixed(2)}</td>
                  <td style="border: 1px solid black; padding: 8px;">
                    ${imageUri ? `<img src="${imageUri}" style="width:100px; height:auto;" />` : 'N/A'}
                  </td>
                </tr>
              `;
            }))).join('')}
            <tr>
              <td colspan="2" style="border: 1px solid black; padding: 8px; text-align: right;">Total</td>
              <td style="border: 1px solid black; padding: 8px;">$${totalAmount.toFixed(2)}</td>
              <td style="border: 1px solid black; padding: 8px;"></td>
            </tr>
          </table>
        </body>
      </html>
    `;
  
    const { uri } = await Print.printToFileAsync({ html: reportContent });
  
    Alert.alert(
      'Report Generated',
      'What would you like to do with your report?',
      [
        {
          text: 'Share',
          onPress: async () => {
            await Sharing.shareAsync(uri);
          },
        },
        {
          text: 'Save Locally',
          onPress: async () => {
            const asset = await MediaLibrary.createAssetAsync(uri);
            Alert.alert('Saved', 'Your report has been saved to your media library.');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  
    setReportModalVisible(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!user || loading) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Expenses</Text>

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedYear}
          style={styles.filterPicker}
          onValueChange={(itemValue: number) => setSelectedYear(itemValue)}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedMonth}
          style={styles.filterPicker}
          onValueChange={(itemValue: number) => setSelectedMonth(itemValue)}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <Picker.Item key={month} label={month.toString()} value={month} />
          ))}
        </Picker>
      </View>

      <ScrollView>
        {Object.entries(groupedExpenses).map(([date, expenses]) => (
          <View key={date} style={styles.dateContainer}>
            <Text style={styles.dateText}>{date}</Text>
            {expenses.map((expense) => (
              <View key={expense.id} style={styles.expenseContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text>{new Date(expense.createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
                    <Text style={{ fontSize: 20 }}>{expense.description}</Text>
                    <Text>Rs. {expense.amount.toFixed(2)}</Text>
                  </View>
                  {expense.image && <Image source={{ uri: expense.image }} style={styles.expenseImage} />}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => handleEditExpense(expense)} style={styles.editButton}>
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteExpense(expense.id)} style={styles.deleteButton}>
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text>Add Expense</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setReportModalVisible(true)} style={styles.reportButton}>
        <Text>Generate Report</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text>Select Image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
          <TouchableOpacity onPress={handleAddOrUpdateExpense} style={styles.submitButton}>
            <Text>{currentExpenseId ? 'Update' : 'Add'} Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={reportModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
          />
          <TouchableOpacity onPress={generateReport} style={styles.submitButton}>
            <Text>Generate Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReportModalVisible(false)} style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'black' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderWidth: 1, borderColor: 'black', borderRadius: 5 },
  filterPicker: { flex: 1, marginHorizontal: 5,  },
  dateContainer: { marginBottom: 20 },
  dateText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' },
  expenseContainer: { padding: 10, borderWidth: 1, borderColor: 'black', borderRadius: 5, marginBottom: 10, backgroundColor: 'white' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  editButton: { backgroundColor: 'white', padding: 10, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '50%', alignItems: 'center' },
  deleteButton: { backgroundColor: 'white', padding: 10, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '50%', alignItems: 'center' },
  addButton: { backgroundColor: 'white', padding: 15, borderColor: 'black', borderWidth: 1, borderRadius: 5, alignItems: 'center' },
  reportButton: { backgroundColor: 'white', padding: 15, borderColor: 'black', borderWidth: 1, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
  input: { borderWidth: 1, borderColor: 'black', padding: 10, marginBottom: 20, borderRadius: 5 },
  imagePicker: { backgroundColor: 'white', padding: 10, borderColor: 'black', borderWidth: 1, borderRadius: 5, alignItems: 'center' },
  selectedImage: { width: 100, height: 100, marginTop: 10 },
  submitButton: { backgroundColor: 'white', padding: 10, borderColor: 'black', borderWidth: 1, borderRadius: 5, alignItems: 'center' },
  closeButton: { backgroundColor: 'white', padding: 10, borderColor: 'black', borderWidth: 1, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  expenseImage: { width: 100, height: 100, marginTop: 10 },
});

export default Dashboard;
