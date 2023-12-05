import { Column, Id, Task } from "@/lib/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { BsTrash3Fill } from "react-icons/bs";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import TaskCard from "./task_card";

interface ColumnContainerProps {
  column: Column;
  deleteColumn?: (id: Id) => void;
  updateColumn?: (id: Id, title: string) => void;
  createTask?: (id: Id) => void;
  deleteTask?: (id: Id) => void;
  updateTask?: (id: Id, content: string) => void;
  tasks: Task[];
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) => {
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor opacity-40 border-2 border-pink-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className=" bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn!(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          className=" text-gray-500 hover:text-white hover:bg-columnBackgroundColor rounded-full p-2"
          onClick={() => deleteColumn!(column.id)}
        >
          <BsTrash3Fill className="h-full w-full" />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        className="flex gap-2 items-center justify-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => createTask!(column.id)}
      >
        <FaPlus />
        Add Task
      </button>
    </div>
  );
};

export default ColumnContainer;
