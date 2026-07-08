const BASE_URL = "http://localhost:3000";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const getTasks = async () => {
  const tasks = await request("/todos");

  return {
    data: tasks,
  };
};

export const getTask = async (id) => {
  const task = await request(`/todos/${id}`);

  return {
    data: task,
  };
};

export const createTask = async (task) => {
  return request("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...task,
      created_at: new Date().toISOString(),
    }),
  });
};

export const updateTask = async (id, task) => {
  return request(`/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
};

export const deleteTask = async (id) => {
  return request(`/todos/${id}`, {
    method: "DELETE",
  });
};

export const toggleTask = async (id, currentCompleted) => {
  return request(`/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: !currentCompleted,
    }),
  });
};
