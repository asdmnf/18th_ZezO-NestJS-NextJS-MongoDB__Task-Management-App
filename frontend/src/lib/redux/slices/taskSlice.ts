import api from "@/lib/axios/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  category: string;
  completed: boolean;
}

type TaskDto = Omit<Task, "_id" | "completed">;

interface TaskState {
  task: Task | null;
  tasks: Task[];
  status: "idle" | "loading" | "failed";
  error: string | null;
  selectedCategory: string;
  categories: string[];
}

const initialState: TaskState = {
  task: null,
  tasks: [],
  status: "idle",
  error: null,
  selectedCategory: "All",
  categories: [],
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await api.get("/tasks");
  return response.data;
});

export const getTask = createAsyncThunk(
  "tasks/getTask",
  async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: TaskDto) => {
    const response = await api.post("/tasks", task);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData: { id: string; task: TaskDto }) => {
    const response = await api.put(`/tasks/${taskData.id}`, taskData.task);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
    return taskId;
  }
);

export const getUserCategories = createAsyncThunk(
  "tasks/getUserCategories",
  async () => {
    const response = await api.get(`/tasks/custom/categories`);
    return response.data;
  }
);

export const getTasksByCategory = createAsyncThunk(
  "tasks/getTasksByCategory",
  async (category: string) => {
    const response = await api.get(`/tasks/custom/categories/${category}`);
    return response.data;
  }
);

export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async (taskId: string) => {
    const response = await api.put(`/tasks/custom/${taskId}/complete`);
    return response.data;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setCategoryFilter(state, action) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "idle";
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "something went wrong, please try again";
      })

      // get task
      .addCase(getTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.status = "idle";
        state.task = action.payload;
        state.error = null;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "something went wrong, please try again";
      })

      // add task
      .addCase(addTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        // state.tasks.push(action.payload);
        state.error = null;
        state.status = "idle";
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "something went wrong, please try again";
      })

      // update task
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.error = null;
        state.status = "idle";
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "something went wrong, please try again";
      })

      // delete task
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.error = null;
        state.status = "idle";
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "something went wrong, please try again";
      })

      // get user categories
      .addCase(getUserCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUserCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getUserCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "something went wrong, please try again";
      })

      // get tasks by category
      .addCase(getTasksByCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTasksByCategory.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.error = null;
        state.status = "idle";
      })
      .addCase(getTasksByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "something went wrong, please try again";
      })

      // mark task as completed
      .addCase(completeTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.error = null;
        state.status = "idle";
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "something went wrong, please try again";
      });
  },
});

export const { setCategoryFilter } = taskSlice.actions;

export default taskSlice;
