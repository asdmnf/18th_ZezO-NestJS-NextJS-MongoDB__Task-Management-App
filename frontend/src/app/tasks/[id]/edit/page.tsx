"use client";

import TaskForm from "@/components/TaskForm";

const EditTaskPage = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <section className="container mt-8">
      <TaskForm taskId={id as string} />
    </section>
  );
};

export default EditTaskPage;
