import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { createTask, updateTask } from "../api/taskService";

export default function TaskFormScreen({ route, navigation }) {
  const existing = route.params?.task;

  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(
    existing?.description || ""
  );
  const [completed, setCompleted] = useState(
    existing?.completed || false
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTitleChange = (value) => {
    setTitle(value);

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSave = async () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setErrorMessage("El título es obligatorio");
      return;
    }

    if (cleanTitle.length > 100) {
      setErrorMessage(
        "El título no puede tener más de 100 caracteres"
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const taskData = {
        title: cleanTitle,
        description: description.trim(),
        completed,
      };

      if (existing) {
        await updateTask(existing.id, taskData);
      } else {
        await createTask(taskData);
      }

      navigation.goBack();
    } catch {
      setErrorMessage("No se pudo guardar la tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={styles.container}
      testID="task-form-screen"
      accessibilityLabel="task-form-screen"
    >
      <Text style={styles.label}>Título *</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={handleTitleChange}
        placeholder="Ej: Estudiar para el examen"
        testID="task-title-input"
        accessibilityLabel="task-title-input"
      />

      <Text style={styles.label}>Descripción</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción opcional..."
        multiline
        numberOfLines={4}
        testID="task-description-input"
        accessibilityLabel="task-description-input"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Completada</Text>

        <Switch
          value={completed}
          onValueChange={setCompleted}
          trackColor={{ true: "#6C63FF" }}
          testID="task-completed-switch"
          accessibilityLabel="task-completed-switch"
        />
      </View>

      {errorMessage ? (
        <Text
          style={styles.errorText}
          testID="form-error-message"
          accessibilityLabel="form-error-message"
        >
          {errorMessage}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleSave}
        disabled={loading}
        testID="save-task-button"
        accessibilityLabel="save-task-button"
      >
        <Text
          style={styles.btnText}
          testID="save-task-button-text"
          accessibilityLabel="save-task-button-text"
        >
          {loading
            ? "Guardando..."
            : existing
              ? "Actualizar tarea"
              : "Crear tarea"}
        </Text>
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

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 14,
    textAlign: "center",
  },

  btn: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  btnDisabled: {
    opacity: 0.6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});