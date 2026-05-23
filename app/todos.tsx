import TodoItem from "@/components/TodoItem";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function TodosScreen() {
  const [todosList, setTodosList] = useState<Todo[]>([]); // State untuk menyimpan daftar todos yang diambil dari API

  // Fungsi untuk mengambil data todos dari API JSONPlaceholder, akan dipanggil saat komponen pertama kali dirender
  const fetchTodos = async () => {
    try {
      // 1. Lakukan fetch data dari API JSONPlaceholder untuk mendapatkan daftar todos
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
      );

      console.log("Fetch Response:", response); // Log response untuk melihat status dan data yang diterima dari API

      if (!response.ok) {
        // Jika response tidak OK (misalnya status 404 atau 500), lempar error untuk ditangani di catch block
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 2. Ubah response menjadi format JSON dan simpan hasilnya ke dalam state todosList, sehingga daftar todos akan otomatis terupdate di layar
      const todos = await response.json();
      console.log("Fetched Todos:", todos); // Log hasil fetch untuk melihat data yang diterima dari API
      // 3. Batasi hanya 20 item untuk disimpan di state, agar tidak terlalu banyak data yang ditampilkan
      setTodosList(todos);
    } catch (error) {
      // Tangani error jika terjadi masalah saat fetch data, misalnya dengan menampilkan pesan error di console
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos(); // Panggil fungsi fetchTodos saat komponen pertama kali dirender

    return () => {
      // Cleanup code if needed
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos Screen</Text>

      <FlatList
        data={todosList.slice(0, 10)} // Batasi hanya 20 item untuk ditampilkan
        keyExtractor={(item) => item.id.toString()} // Gunakan id sebagai key untuk setiap item di FlatList
        renderItem={({ item }) => <TodoItem item={item} />} // Render setiap item menggunakan komponen TodoItem, dengan prop item yang berisi data todo yang akan ditampilkan di layar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  item: {
    padding: 16,
    backgroundColor: "#dedede",
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "column",
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    color: "#666",
  },
});
