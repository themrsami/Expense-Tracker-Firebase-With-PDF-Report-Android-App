// ./components/MonthlyReport.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseconfig';

interface MonthlyReportProps {
  userId: string;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ userId }) => {
  const [monthlyExpense, setMonthlyExpense] = useState(0);

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const q = query(collection(db, 'expenses'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += data.amount; // Sum monthly expenses
        });
        setMonthlyExpense(total);
      } catch (error) {
        console.error("Error fetching monthly report: ", error);
      }
    };

    fetchMonthlyExpenses();
  }, [userId]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Monthly Report</Text>
      <Text style={styles.amount}>${monthlyExpense}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    color: '#333',
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default MonthlyReport;
