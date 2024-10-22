// ./components/ExpenseSummary.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExpenseSummaryProps {
  user: any; // Firebase Auth user object
  userData: any; // Firestore user-specific data
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ user, userData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.userName}>Hello, {user.displayName || 'User'}</Text>
      <Text style={styles.date}>October 10, 2023</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Expenses</Text>
          <Text style={styles.cardAmount}>${userData?.totalExpenses || 0}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Budget</Text>
          <Text style={styles.cardAmount}>${userData?.monthlyBudget || 0}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 18,
    color: '#888',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    color: '#333',
  },
  cardAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default ExpenseSummary;
