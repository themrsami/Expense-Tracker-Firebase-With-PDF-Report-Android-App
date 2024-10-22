// components/Dropdown.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface DropdownProps {
  onLogout: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onLogout }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>Menu</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalItem} onPress={() => { onLogout(); setModalVisible(false); }}>
            <Text style={styles.modalItemText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalItemText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  dropdownText: {
    color: '#F7FAFC',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalItem: {
    backgroundColor: '#2D3748',
    padding: 15,
    width: '80%',
    borderRadius: 10,
    marginBottom: 10,
  },
  modalItemText: {
    color: '#F7FAFC',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Dropdown;
