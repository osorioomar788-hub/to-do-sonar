import { registerRootComponent } from "expo";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TaskListScreen from "./src/screens/TaskListScreen";
import TaskFormScreen from "./src/screens/TaskFormScreen";
import TaskDetailScreen from "./src/screens/TaskDetailScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#6C63FF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ title: "📝 Mis Tareas" }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: "Detalle de tarea" }}
        />
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={({ route }) => ({
            title: route.params?.task ? "Editar tarea" : "Nueva tarea",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);