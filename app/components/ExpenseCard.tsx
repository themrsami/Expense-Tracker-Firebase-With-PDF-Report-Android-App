// components/ExpenseCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExpenseCardProps {
  expense: {
    amount: number;
    description: string;
    createdAt: Date; // Ensure it's a Date type
  };
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  const formattedDate = new Date(expense.createdAt).toLocaleDateString(); // Format date

  return (
    <View style={styles.card}>
      <Text style={styles.cardAmount}>${expense.amount.toFixed(2)}</Text>
      <Text style={styles.cardDescription}>{expense.description}</Text>
      <Text style={styles.cardDate}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2D3748',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 150,
    alignItems: 'center',
  },
  cardAmount: {
    color: '#68D391',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#F7FAFC',
    textAlign: 'center',
  },
  cardDate: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});

export default ExpenseCard;
