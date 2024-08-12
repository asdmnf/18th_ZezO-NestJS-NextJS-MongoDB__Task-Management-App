"use client";

import {
  completeTask,
  deleteTask,
  fetchTasks,
  getUserCategories,
  setCategoryFilter,
} from "@/lib/redux/slices/taskSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { BookCheck, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  category: string;
  completed: boolean;
}

const TaskDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, categories, selectedCategory, status, error } = useSelector(
    (state: RootState) => state.task
  );

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(getUserCategories());
  }, [dispatch]);

  const handleCategoryChange = (category: string) => {
    dispatch(setCategoryFilter(category));
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId)).then((res) => {
      if (res.type === "tasks/deleteTask/fulfilled") {
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    });
  };

  const filteredTasks = tasks.filter(
    (task) => selectedCategory === "All" || task.category === selectedCategory
  );

  const tasksByDay = filteredTasks.reduce((acc: Record<string, any>, task) => {
    const date = format(new Date(task.dueDate), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  const handleCompleteTask = (taskId: string) => {
    dispatch(completeTask(taskId)).then((res) => {
      if (res.type === "tasks/completeTask/fulfilled") {
        dispatch(fetchTasks());
        toast.success("Task completed successfully");
      } else {
        toast.error("Failed to complete task");
      }
    });
  };

  return (
    <section className="container">
      <div className="mt-8 flex max-[350px]:flex-col justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
        <Button asChild variant="default">
          <Link href="/tasks/new">Add Task</Link>
        </Button>
      </div>
      <div className="max-w-3xl mx-auto mt-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            {categories && categories.length > 0 && (
              <Button
                onClick={() => handleCategoryChange("All")}
                variant="outline"
                className={selectedCategory === "All" ? "bg-slate-200" : ""}
              >
                All
              </Button>
            )}

            {categories?.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategoryChange(category)}
                variant="outline"
                className={`${
                  selectedCategory === category ? "bg-slate-200" : ""
                } ms-1 mb-1`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {status === "loading" && <p>Loading tasks...</p>}
        {error && <p>Error loading tasks: {error}</p>}

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(tasksByDay).map(([date, tasks]) => (
            <Card key={date} className="p-4">
              <h3 className="text-lg font-bold">{date}</h3>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {tasks.map((task: Task) => (
                  <Card key={task._id} className="p-4">
                    <h3 className="text-lg font-bold">{task.title}</h3>
                    <p>{task.description}</p>
                    <p className="text-sm text-gray-500">
                      Due: {format(new Date(task.dueDate), "PPP p")}
                    </p>
                    <div className="flex items-center my-2 space-x-2">
                      <BookCheck className="w-6 h-6" />
                      <span>{task.category}</span>
                    </div>
                    <div className="mt-4 flex justify-between max-[400px]:flex-col max-[400px]:space-y-2">
                      <div className="flex items-center space-x-2 max-[400px]:justify-between">
                        <Button asChild variant="outline">
                          <Link href={`/tasks/${task._id}/edit`}>Edit</Link>
                        </Button>
                        {!task.completed ? (
                          <span
                            title="Mark as completed"
                            className="cursor-pointer"
                            onClick={() => handleCompleteTask(task._id)}
                          >
                            <CircleCheckBig className="w-6 h-6" />
                          </span>
                        ) : (
                          <Badge variant="default">Completed</Badge>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TaskDashboard;
