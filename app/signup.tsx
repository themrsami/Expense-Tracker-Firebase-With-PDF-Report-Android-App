import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '@/firebaseconfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    // Validation
    if (!fullName.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
  
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await sendEmailVerification(user);
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        createdAt: new Date(),
        expenses: []
      });
  
      setSuccessModalVisible(true);
      setErrorMessage('');
    } catch (error) {
      const errorCode = (error as any).code;
  
      if (errorCode === 'auth/email-already-in-use') {
        setErrorMessage("This email is already in use. Please use a different email.");
      } else {
        setErrorMessage((error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create an Account</Text>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#A0AEC0"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A0AEC0"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A0AEC0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#A0AEC0"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginText}> Log In</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.successMessage}>Signup Successful!</Text>
            <Text style={styles.successText}>Please check your email for verification.</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                setSuccessModalVisible(false);
                router.push('/login');
              }}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F0F0F0',
    color: 'black',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#D0D0D0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
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
    alignItems: 'center',
  },
  successMessage: {
    color: '#68D391',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successText: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#D0D0D0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'black',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'black',
    fontSize: 16,
  },
  loginText: {
    color: '#68D391',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Signup;
