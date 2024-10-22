// ./components/AddExpenseButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, TextInput, Button, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseconfig'; // Your Firestore config
import { useAuth } from '@/AuthContext';

const AddExpenseButton: React.FC = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAddExpense = async () => {
    if (!amount || !description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // Add the expense to Firestore
      await addDoc(collection(db, 'expenses'), {
        userId: user?.uid,
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString().split('T')[0], // Store the current date
      });
      Alert.alert("Success", "Expense added successfully");
      setModalVisible(false);
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error("Error adding expense: ", error);
      Alert.alert("Error", "Failed to add expense");
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Expense</Text>

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

            <View style={styles.modalButtons}>
              <Button title="Add" onPress={handleAddExpense} />
              <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AddExpenseButton;
