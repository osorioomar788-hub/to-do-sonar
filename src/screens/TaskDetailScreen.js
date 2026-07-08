import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getTask } from "../api/taskService";

export default function TaskDetailScreen({ route, navigation }) {
  const taskId = route?.params?.taskId;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setErrorMessage("No se recibió el identificador de la tarea");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const response = await getTask(taskId);

        // Funciona si getTask devuelve la tarea directamente
        // o si devuelve un objeto con la propiedad data.
        const taskData = response?.data ?? response;

        setTask(taskData);
      } catch {
        setTask(null);
        setErrorMessage("No se pudo cargar la tarea");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <View
        style={styles.center}
        testID="task-detail-loading"
        accessibilityLabel="task-detail-loading"
      >
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!task) {
    return (
      <View
        style={styles.center}
        testID="task-detail-error"
        accessibilityLabel="task-detail-error"
      >
        <Text>{errorMessage || "No se encontró la tarea."}</Text>
      </View>
    );
  }

  const createdAt = task.created_at ?? task.createdAt;
  const createdDate = createdAt ? new Date(createdAt) : null;

  const createdDateText =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString()
      : "Fecha no disponible";

  return (
    <View
      style={styles.container}
      testID="task-detail-screen"
      accessibilityLabel="task-detail-screen"
    >
      <View
        style={styles.card}
        testID={`task-detail-card-${task.id}`}
        accessibilityLabel={`task-detail-card-${task.id}`}
      >
        <Text style={styles.label}>Título</Text>

        <Text
          style={styles.value}
          testID="task-detail-title"
          accessibilityLabel="task-detail-title"
        >
          {task.title}
        </Text>

        <Text style={styles.label}>Descripción</Text>

        <Text
          style={styles.value}
          testID="task-detail-description"
          accessibilityLabel="task-detail-description"
        >
          {task.description || "Sin descripción"}
        </Text>

        <Text style={styles.label}>Estado</Text>

        <Text
          style={[
            styles.badge,
            task.completed ? styles.done : styles.pending,
          ]}
          testID="task-detail-status"
          accessibilityLabel="task-detail-status"
        >
          {task.completed ? "✅ Completada" : "⏳ Pendiente"}
        </Text>

        <Text style={styles.label}>Creada el</Text>

        <Text
          style={styles.value}
          testID="task-detail-created-date"
          accessibilityLabel="task-detail-created-date"
        >
          {createdDateText}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("TaskForm", { task })}
        testID="edit-task-detail-button"
        accessibilityLabel="edit-task-detail-button"
      >
        <Text style={styles.btnText}>✏️ Editar tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F8",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    marginTop: 14,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  badge: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
  },
  done: {
    color: "#4CAF50",
  },
  pending: {
    color: "#FF9800",
  },
  btn: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});