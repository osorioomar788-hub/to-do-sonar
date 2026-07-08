import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteTask, getTasks, toggleTask } from "../api/taskService";

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data.data || []);
    } catch {
      Alert.alert("Error", "No se pudo conectar a la API");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, []),
  );

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Seguro que deseas eliminar esta tarea?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteTask(id);
          fetchTasks();
        },
      },
    ]);
  };

  const handleToggle = async (task) => {
    await toggleTask(task.id, task.completed);
    fetchTasks();
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );

  return (
    <View
      style={styles.container}
      testID="task-list-screen"
      accessibilityLabel="task-list-screen"
    >
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text
            style={styles.empty}
            testID="empty-task-message"
            accessibilityLabel="empty-task-message"
          >
            No hay tareas aún.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={styles.card}
            testID={`task-card-${item.id}`}
            accessibilityLabel={`task-card-${item.id}`}
          >
            <TouchableOpacity
              style={styles.checkBox}
              onPress={() => handleToggle(item)}
              testID={`toggle-task-${item.id}`}
              accessibilityLabel={`toggle-task-${item.id}`}
            >
              <Text style={styles.checkIcon}>
                {item.completed ? "✅" : "⬜"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardBody}
              onPress={() =>
                navigation.navigate("TaskDetail", { taskId: item.id })
              }
              testID={`open-task-${item.id}`}
              accessibilityLabel={`open-task-${item.id}`}
            >
              <Text
                style={[styles.title, item.completed && styles.done]}
                testID={`task-title-${item.id}`}
                accessibilityLabel={`task-title-${item.id}`}
              >
                {item.title}
              </Text>
              {item.description ? (
                <Text style={styles.description}>{item.description}</Text>
              ) : null}
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => navigation.navigate("TaskForm", { task: item })}
                testID={`edit-task-${item.id}`}
                accessibilityLabel={`edit-task-${item.id}`}
              >
                <Text style={styles.editBtn}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                testID={`delete-task-${item.id}`}
                accessibilityLabel={`delete-task-${item.id}`}
              >
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TaskForm", { task: null })}
        testID="new-task-button"
        accessibilityLabel="new-task-button"
      >
        <Text style={styles.fabText}>+ Nueva tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F8", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkBox: { marginRight: 10 },
  checkIcon: { fontSize: 22 },
  cardBody: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", color: "#333" },
  done: { textDecorationLine: "line-through", color: "#aaa" },
  description: { fontSize: 13, color: "#888", marginTop: 2 },
  actions: { flexDirection: "row", gap: 10 },
  editBtn: { fontSize: 20 },
  deleteBtn: { fontSize: 20 },
  fab: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
