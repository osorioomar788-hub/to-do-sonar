import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  toggleTask,
  updateTask,
} from "../taskService";


const createMockResponse = (
  data,
  status = 200,
  statusText = "OK",
) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText,
  json: jest.fn().mockResolvedValue(data),
});


describe("taskService", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete global.fetch;
  });


  test("getTasks obtiene la lista de tareas", async () => {
    const tasks = [
      {
        id: "1",
        title: "Estudiar Jest",
        description: "Realizar pruebas unitarias",
        completed: false,
      },
    ];

    global.fetch.mockResolvedValue(
      createMockResponse(tasks),
    );

    const result = await getTasks();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/todos",
      expect.any(Object),
    );

    expect(result).toEqual({
      data: tasks,
    });
  });


  test("getTask obtiene una tarea por su id", async () => {
    const task = {
      id: "5",
      title: "Tarea individual",
      description: "Consultar una tarea",
      completed: false,
    };

    global.fetch.mockResolvedValue(
      createMockResponse(task),
    );

    const result = await getTask("5");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/todos/5",
      expect.any(Object),
    );

    expect(result).toEqual({
      data: task,
    });
  });


  test("createTask envía una nueva tarea", async () => {
    const newTask = {
      title: "Nueva tarea",
      description: "Creada desde Jest",
      completed: false,
    };

    const savedTask = {
      id: "10",
      ...newTask,
      created_at: "2026-06-21T18:00:00.000Z",
    };

    global.fetch.mockResolvedValue(
      createMockResponse(savedTask, 201, "Created"),
    );

    const result = await createTask(newTask);

    expect(result).toEqual(savedTask);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/todos",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const requestOptions =
      global.fetch.mock.calls[0][1];

    const requestBody = JSON.parse(
      requestOptions.body,
    );

    expect(requestBody).toEqual(
      expect.objectContaining(newTask),
    );

    expect(requestBody.created_at).toEqual(
      expect.any(String),
    );
  });


  test("updateTask actualiza una tarea existente", async () => {
    const changes = {
      title: "Tarea actualizada",
      description: "Descripción modificada",
      completed: true,
    };

    const updatedTask = {
      id: "3",
      ...changes,
    };

    global.fetch.mockResolvedValue(
      createMockResponse(updatedTask),
    );

    const result = await updateTask("3", changes);

    expect(result).toEqual(updatedTask);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/todos/3",
      expect.objectContaining({
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      }),
    );
  });


  test("toggleTask cambia el estado de una tarea", async () => {
    const toggledTask = {
      id: "4",
      title: "Cambiar estado",
      completed: true,
    };

    global.fetch.mockResolvedValue(
      createMockResponse(toggledTask),
    );

    const result = await toggleTask("4", false);

    expect(result).toEqual(toggledTask);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/todos/4",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          completed: true,
        }),
      }),
    );
  });


  test("deleteTask elimina una tarea", async () => {
    global.fetch.mockResolvedValue(
      createMockResponse(null, 204, "No Content"),
    );

    const result = await deleteTask("8");

    expect(result).toBeNull();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/todos/8",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });


  test("lanza un error cuando la respuesta HTTP falla", async () => {
    global.fetch.mockResolvedValue(
      createMockResponse(
        {
          message: "Error interno",
        },
        500,
        "Internal Server Error",
      ),
    );

    await expect(getTasks()).rejects.toThrow(
      "Error HTTP 500",
    );
  });
});