import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabaseClient';

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('notes').select('*');
    if (error) console.log(error);
    else setNotes(data);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const addNote = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert('Please login again.');
    return;
  }

  const { error } = await supabase
    .from('notes')
    .insert([{ title, content, image_url: image, user_id: user.id }]);

  if (error) console.log('Insert error:', error);
  else {
    setTitle('');
    setContent('');
    setImage(null);
    fetchNotes();
  }
};


  const deleteNote = async (id: number) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) console.log(error);
    else fetchNotes();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
      />
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Add Note" onPress={addNote} />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
            {item.image_url && <Image source={{ uri: item.image_url }} style={styles.noteImage} />}
            <TouchableOpacity onPress={() => deleteNote(item.id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Logout" color="red" onPress={() => supabase.auth.signOut().then(() => router.push('/login'))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 8 },
  image: { width: '100%', height: 200, marginVertical: 10, borderRadius: 8 },
  noteCard: { padding: 10, borderBottomWidth: 1, borderColor: '#eee', marginBottom: 10 },
  noteTitle: { fontWeight: 'bold', fontSize: 16 },
  noteImage: { width: '100%', height: 150, marginTop: 5, borderRadius: 8 },
  deleteBtn: { color: 'red', marginTop: 5 },
});
