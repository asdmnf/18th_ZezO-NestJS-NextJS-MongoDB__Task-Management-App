"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { addTask, getTask, updateTask } from "@/lib/redux/slices/taskSlice";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import toast from "react-hot-toast";
import { format } from "date-fns";
import taskValidationSchema from "@/app/tasks/validation/taskValidationSchema";
import { AlertCard } from "./AlertCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const TaskForm = ({ taskId }: { taskId?: string }) => {
  const router = useRouter();

  // used with min attribute on date-time input to prevent past dates
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.task);
  const task = useSelector((state: RootState) => {
    const taskById = state.task.tasks.find((task) => task._id === taskId);
    return taskById || state.task.task;
  });

  const [taskInputs, setTaskInputs] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    completed: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
  });

  const setTaskInputsHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      title: "",
      description: "",
      category: "",
      dueDate: "",
    });

    const validationResult = taskValidationSchema.safeParse(taskInputs);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        setErrors((prev) => ({ ...prev, [issue.path[0]]: issue.message }));
      });
      return;
    }
    const taskDto = validationResult.data;

    if (taskId) {
      dispatch(updateTask({ id: task?._id as string, task: taskDto })).then(
        (res) => {
          if (res.type === "tasks/updateTask/fulfilled") {
            toast.success("Task updated successfully");
          } else {
            toast.error("Failed to update task");
          }
        }
      );
    } else {
      dispatch(addTask(taskDto)).then((res) => {
        if (res.type === "tasks/addTask/fulfilled") {
          toast.success("Task created successfully");
        } else {
          toast.error("Failed to create task");
        }
      });
    }

    router.push("/dashboard");
  };

  useEffect(() => {
    if (task) {
      setTaskInputs({
        title: task.title,
        description: task.description,
        category: task.category,
        dueDate: format(new Date(task?.dueDate), "yyyy-MM-dd'T'HH:mm:ss"),
        completed: task.completed,
      });

      // if user refreshes the page, data will be fetched from the server instead of redux global state
    } else if (taskId && !task) {
      dispatch(getTask(taskId));
    }
  }, [task, taskId]);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        {taskId ? "Edit Task" : "New Task"}
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          value={taskInputs.title}
          onChange={setTaskInputsHandler}
        />
        {errors.title && (
          <AlertCard
            title="Error"
            message={errors.title}
            variant="destructive"
            className="mt-3"
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description"
          value={taskInputs.description}
          onChange={setTaskInputsHandler}
        />
        {errors.description && (
          <AlertCard
            title="Error"
            message={errors.description}
            variant="destructive"
            className="mt-3"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <div className="mb-2">
          {categories &&
            categories.map((item) => (
              <Badge
                key={item}
                className="mr-1"
                onClick={() => setTaskInputs({ ...taskInputs, category: item })}
                variant={item === taskInputs.category ? "default" : "outline"}
              >
                {item}
              </Badge>
            ))}
        </div>
        <Input
          id="category"
          name="category"
          type="text"
          placeholder="Category"
          value={taskInputs.category}
          onChange={setTaskInputsHandler}
        />
        {errors.category && (
          <AlertCard
            title="Error"
            message={errors.category}
            variant="destructive"
            className="mt-3"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Due Date</label>
        <Input
          id="dueDate"
          name="dueDate"
          type="datetime-local"
          value={taskInputs.dueDate}
          onChange={setTaskInputsHandler}
          min={now.toJSON().split(":").slice(0, -1).join(":")}
        />
        {errors.dueDate && (
          <AlertCard
            title="Error"
            message={errors.dueDate}
            variant="destructive"
            className="mt-3"
          />
        )}
      </div>

      {task && (
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <Select
            defaultValue={task?.completed ? "completed" : "notCompleted"}
            onValueChange={(value) =>
              setTaskInputs({ ...taskInputs, completed: value === "completed" })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="notCompleted">Not Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full">
        {taskId ? "Update Task" : "Add Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
