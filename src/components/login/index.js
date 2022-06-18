import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity  } from 'react-native';
import firebase from '../../services/firebaseConnection';

export default function Login({changeStatus}){
    const [tipo, setTipo] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(){
        
        if(tipo ==='login'){
            const user = firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                changeStatus(user.user.uid)
            })
            .catch((err) =>{
                console.log(err);
                alert('Parece que deu algum erro. Revise seus dados');
                return;
            })

        }else{
            const user = firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) =>{
                changeStatus(user.user.uid)
            }) 
            .catch((err) =>{
                console.log(err);
                alert('Parece que deu algum erro. Revise seus dados');
                return;
            })           

        }
    }
  
    return(
        <SafeAreaView style = {styles.container}>

            <TextInput 
            placeholder='Seu email'
            style = {styles.input}
            value = {email}
            onChangeText = { ( text ) => setEmail(text)}
            />     
            
            <TextInput 
            placeholder='*********'
            style = {styles.input}
            value = {password}
            onChangeText = { ( text ) => setPassword(text)}
            />  

            <TouchableOpacity 
            style = {[styles.handleLogin, { backgroundColor: tipo === 'login' ? '#006400' : '#141414'}]}
            onPress = {handleLogin}
            >
                <Text style = {styles.loginText}>
                    { tipo === 'login' ? 'Acessar': 'Cadastrar'}
                    </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress = {() =>setTipo(tipo => tipo === 'login' ? 'cadastrar' : 'login')}>
               <Text style = {{ textAlign: 'center'}}>
                {tipo === 'login' ? 'Criar conta' : ' Já possuo conta'}
                </Text> 
            </TouchableOpacity>

         </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: 50,        
        backgroundColor:'#5f9ea0',
        paddingHorizontal: 10
    },
    input:{
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 10,
        height: 45,
        borderWidth: 1,
        borderColor:'#141414'
    },
    handleLogin:{
        alignItems: 'center',
        justifyContent: 'center',         
        height: 45,
        marginBottom:10,       
    },
    loginText:{
        color: '#fff',
        fontSize: 17
    }
})