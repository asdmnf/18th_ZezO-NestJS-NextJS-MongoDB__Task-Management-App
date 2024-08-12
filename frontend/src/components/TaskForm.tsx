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

const TaskForm = ({ taskId }: { taskId?: string }) => {
  const router = useRouter();

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  const dispatch = useDispatch<AppDispatch>();
  const task = useSelector((state: RootState) => {
    const taskById = state.task.tasks.find((task) => task._id === taskId);
    return taskById || state.task.task;
  });

  const { categories } = useSelector((state: RootState) => state.task);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [category, setCategory] = useState(task?.category || "");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(format(new Date(task?.dueDate), "yyyy-MM-dd'T'HH:mm:ss"));
      setCategory(task.category);
      // if user refreshes the page, data will be fetched from the server instead of redux global state
    } else if (taskId && !task) {
      dispatch(getTask(taskId));
    }
  }, [task, taskId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskDto = { title, description, dueDate, category };

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

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        {taskId ? "Edit Task" : "New Task"}
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <div className="mb-2">
          {categories &&
            categories.map((item) => (
              <Badge
                key={item}
                className="mr-1"
                onClick={() => setCategory(item)}
                variant={item === category ? "default" : "outline"}
              >
                {item}
              </Badge>
            ))}
        </div>
        <Input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Due Date</label>
        <Input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required={!!!task?.dueDate}
          min={now.toJSON().split(":").slice(0, -1).join(":")}
        />
      </div>

      <Button type="submit" className="w-full">
        {taskId ? "Update Task" : "Add Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
