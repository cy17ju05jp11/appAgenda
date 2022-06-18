import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text,
     StyleSheet, 
     SafeAreaView, 
     TextInput,
     TouchableOpacity,
     FlatList,
     Keyboard
    } from 'react-native';

import Login from './src/components/login/index.js';
import TaskList from './src/components/TaskList';
import firebase from './src/services/firebaseConnection';
import Feather from 'react-native-vector-icons/Feather'

export default function App(){
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const inputRef = useRef(null);
    const [newTask, setNewTask] = useState(''); 
    const [key, setKey] = useState('');

    useEffect(() =>{
        function getUser(){
            if(!user){
                return;
            }
            firebase.database().ref('tarefas').child(user).once('value', (snapchot)=>{
                setTasks([]);

                snapchot?.forEach((childItem)=>{
                    let data = {
                       key:childItem.key, 
                       nome: childItem.val().nome
                    }
                    setTasks(oldTasks =>[...oldTasks, data])
                })
            })
        }

        getUser();

    }, [user])

    function handleAdd(){
        if(newTask === ''){
            return;
        }

        //editar tarefa
        if(key !== ''){
            firebase.database().ref('tarefas').child(user).child(key).update({
                nome: newTask
            })
            .then(() => {
                const taskIndex = tasks.findIndex( item => item.key === key)
                let taskClone = tasks;
                taskClone[taskIndex].nome = newTask

                setTasks([...taskClone])
            })

            Keyboard.dismiss();
            setNewTask('');
            setKey('');
            return;
        }

        let tarefas = firebase.database().ref('tarefas').child(user);
        let chave = tarefas.push().key;

        tarefas.child(chave).set({
            nome: newTask
        })
        .then(() =>{
            const data = {
                key: chave,
                nome: newTask
            };
            setTasks(oldTasks =>[...oldTasks, data])
        })
        Keyboard.dismiss();
        setNewTask('');
    }

    function handleDelete(key){
        firebase.database().ref('tarefas').child(user).child(key).remove()
        .then(()=> {
           const findTasks = tasks.filter(item => item.key !== key)
           setTasks(findTasks) 
        })
    }

    function handleEdit(data){
        setKey(data.key)
        setNewTask(data.nome)
        inputRef.current.focus();
    }

    function cancelEdit(){
        setKey('');
        setNewTask('');
        Keyboard.dismiss();
    }

    if(!user){
        return<Login changeStatus = {(user) => setUser(user)}/>
    }

    return(
        <SafeAreaView style = {styles.container}>

            { key.length > 0 && (
                   <View style ={{flexDirection: 'row', marginBottom: 8 }}>
                   <TouchableOpacity onPress={cancelEdit}>
                       <Feather name = 'x-circle' size={20} color='#ff0'/>
                   </TouchableOpacity>
                   <Text style={{marginLeft: 5, color:'#ff0'}}>
                       Você está editando uma tarefa!
                   </Text>
               </View>
            )}

            <View style = {styles.containerTask}>
            <TextInput
              style = {styles.input}
              placeholder = 'Qual compromisso de hoje?'
              value = {newTask}
              onChangeText = {(text) => setNewTask(text)}
              ref ={inputRef}
              />
            <TouchableOpacity style = {styles.buttonAdd} onPress={handleAdd}>
              <Text style = {styles.buttonText}>+</Text>   
            </TouchableOpacity>
            </View>

            <FlatList
              data = {tasks}
              keyExtractor = {item => item.key}
              renderItem = {({item}) =>(
                <TaskList data  = {item}  deleteItem = {handleDelete} editItem={handleEdit} />                
              )}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: 50,
        paddingHorizontal:20,
        backgroundColor:'#5f9ea0'
    },
    containerTask:{
        flexDirection: 'row'
    },
    input:{
        flex:1,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor:'#141414',
        height: 45

    },
    buttonAdd:{
        backgroundColor: '#141414',
        height: 45,
        alignItems:'center',
        justifyContent: 'center',
        marginLeft: 5,
        paddingHorizontal: 20,
        borderRadius: 4

    },
    buttonText:{
        color: '#fff',
        fontSize: 25
    }
})
