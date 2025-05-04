import { Task, TaskList } from '@/types/task';
import { format } from 'date-fns';
import {Calendar, ListTodo, MessageSquare, Plus, Share2, Trash2, X} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { ShareModal } from './ShareModal';
import { TaskComments } from './TaskComments';

interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

interface TaskDetailModalProps {
    task: Task;
    lists?: TaskList[];
    currentUserId: string;
    currentUserName: string;
    currentUserPhoto?: string;
    onClose: () => void;
    onSave: (updatedTask: Task) => void;
    onDelete?: (taskId: string) => void;
    onShareTask?: (task: Task, email: string, role: 'viewer' | 'editor' | 'admin') => void;
    onUpdatePermission?: (task: Task, userId: string, role: 'viewer' | 'editor' | 'admin') => void;
    onRemoveUser?: (task: Task, userId: string) => void;
    onAddComment?: (taskId: string, content: string) => void;
    onDeleteComment?: (commentId: string) => void;
}

export function TaskDetailModal({
    task,
    lists = [],
    currentUserId,
    currentUserName,
    currentUserPhoto,
    onClose,
    onSave,
    onDelete,
    onShareTask,
    onUpdatePermission,
    onRemoveUser,
    onAddComment,
    onDeleteComment
}: TaskDetailModalProps) {
    const [editedTask, setEditedTask] = useState<Task>({ ...task });
    const [subtasks, setSubtasks] = useState<SubTask[]>(task.subtasks || []);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [showListSelector, setShowListSelector] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const handleSave = () => {
        if (editedTask.title.trim()) {
            onSave({
                ...editedTask,
                subtasks,
                updatedAt: new Date().toISOString()
            });
            onClose();
        }
    };

    const addSubtask = () => {
        if (newSubtaskTitle.trim()) {
            const newSubtask: SubTask = {
                id: Date.now().toString(),
                title: newSubtaskTitle,
                completed: false
            };
            setSubtasks([...subtasks, newSubtask]);
            setNewSubtaskTitle('');
        }
    };

    const toggleSubtaskCompletion = (subtaskId: string) => {
        setSubtasks(
            subtasks.map(subtask =>
                subtask.id === subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask
            )
        );
    };

    const deleteSubtask = (subtaskId: string) => {
        setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(task.id);
            onClose();
        }
    };

    const getListName = (listId?: string) => {
        if (!listId) return 'No list';
        const list = lists.find(l => l.id === listId);
        return list ? list.name : 'Unknown list';
    };

    const getListColor = (listId?: string) => {
        if (!listId) return 'text-gray-600';
        const list = lists.find(l => l.id === listId);
        if (!list || !list.color) return 'text-gray-600';

        switch (list.color) {
            case 'blue': return 'text-blue-600';
            case 'green': return 'text-green-600';
            case 'red': return 'text-red-600';
            case 'purple': return 'text-purple-600';
            case 'amber': return 'text-amber-600';
            default: return 'text-gray-600';
        }
    };

    const getListBgColor = (listId?: string) => {
        if (!listId) return 'bg-gray-50';
        const list = lists.find(l => l.id === listId);
        if (!list || !list.color) return 'bg-gray-50';

        switch (list.color) {
            case 'blue': return 'bg-blue-50';
            case 'green': return 'bg-green-50';
            case 'red': return 'bg-red-50';
            case 'purple': return 'bg-purple-50';
            case 'amber': return 'bg-amber-50';
            default: return 'bg-gray-50';
        }
    };

    const isShared = editedTask.sharedWith && editedTask.sharedWith.length > 0;

    // Calculate completion percentage for subtasks
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter(s => s.completed).length;
    const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={onClose}>
            <div className="max-w-4xl w-full mx-4 h-[calc(100vh-80px)] max-h-[700px] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col h-full overflow-hidden">
                    {/* Header with color accent */}
                    <div className={`h-1.5 ${getListBgColor(editedTask.listId)}`}></div>

                    <div className="p-5 flex-grow flex flex-col overflow-hidden">
                        {/* Task title section */}
                        <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                            <Input
                                value={editedTask.title}
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                placeholder="Task name"
                                className="text-xl font-medium border-0 px-0 h-auto focus-visible:ring-0 pb-2 -mt-1 w-full"
                            />

                            <div className="flex flex-wrap gap-2 mt-4">
                                {/* List selector */}
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`text-xs rounded-full h-7 px-3 border-gray-200 ${getListColor(editedTask.listId)}`}
                                        onClick={() => setShowListSelector(!showListSelector)}
                                    >
                                        <ListTodo className="h-3 w-3 mr-1.5" />
                                        {getListName(editedTask.listId)}
                                    </Button>

                                    {showListSelector && (
                                        <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10 w-48">
                                            <div className="py-1">
                                                <button
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    onClick={() => {
                                                        setEditedTask({ ...editedTask, listId: undefined });
                                                        setShowListSelector(false);
                                                    }}
                                                >
                                                    No list
                                                </button>
                                                {lists.map(list => (
                                                    <button
                                                        key={list.id}
                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${editedTask.listId === list.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                                        onClick={() => {
                                                            setEditedTask({ ...editedTask, listId: list.id });
                                                            setShowListSelector(false);
                                                        }}
                                                    >
                                                        {list.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Date picker button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs rounded-full h-7 px-3 border-gray-200"
                                    onClick={() => {
                                        const today = new Date().toISOString().split('T')[0];
                                        setEditedTask({ ...editedTask, dueDate: today });
                                    }}
                                >
                                    <Calendar className="h-3 w-3 mr-1.5" />
                                    {editedTask.dueDate
                                        ? format(new Date(editedTask.dueDate), 'MMM d, yyyy')
                                        : 'Add due date'}
                                </Button>

                                {/* Share button - moved to the right */}
                                {onShareTask && (
                                    <Button
                                        variant={isShared ? "outline" : "default"}
                                        size="sm"
                                        className={`text-sm rounded-full h-7 p-2 ml-auto ${isShared
                                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 dark:border-blue-800"
                                            : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"}`}
                                        onClick={() => setShowShareModal(true)}
                                    >
                                        <Share2 className="h-4 w-4 mr-1.5" />
                                        {isShared ? `Shared (${editedTask.sharedWith?.length})` : 'Share'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Main content area with flex layout */}
                        <div className="flex-grow overflow-hidden flex flex-col md:flex-row md:gap-6">
                            {/* Left column - Task details */}
                            <div className="md:w-1/2 md:max-w-md flex flex-col mb-4 md:mb-0 overflow-hidden">
                                <div className="flex flex-col gap-4 h-full">
                                    {/* Due date */}
                                    <div className="rounded-lg bg-white border border-gray-100 dark:border-gray-700 dark:bg-gray-800/90 p-3 flex items-center gap-2">
                                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-xs font-medium text-gray-500 mb-1">Due Date</div>
                                            <Input
                                                type="date"
                                                value={editedTask.dueDate || ''}
                                                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                                                className="border-0 p-0 h-6 text-sm focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="rounded-lg bg-white border border-gray-100 dark:border-gray-700 dark:bg-gray-800/90 p-3 flex flex-col gap-2 flex-grow overflow-hidden">
                                        <div className="text-xs font-medium text-gray-500">Notes</div>
                                        <textarea
                                            className="w-full flex-grow resize-none border-0 p-0 text-sm focus:ring-0 focus:outline-none dark:bg-transparent"
                                            value={editedTask.notes || ''}
                                            onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
                                            placeholder="Add notes here..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right column - Subtasks & Comments */}
                            <div className="md:w-1/2 flex flex-col gap-4 h-full overflow-hidden">
                                {/* Subtasks */}
                                <div className="rounded-lg bg-white border border-gray-100 dark:border-gray-700 dark:bg-gray-800/90 p-3 flex flex-col gap-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs font-medium text-gray-500">Subtasks</div>
                                        {totalSubtasks > 0 && (
                                            <span className="text-xs text-gray-500">
                                                {completedSubtasks}/{totalSubtasks}
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress bar */}
                                    {totalSubtasks > 0 && (
                                        <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${subtaskProgress}%` }}
                                            ></div>
                                        </div>
                                    )}

                                    {/* Subtasks list */}
                                    <div className="space-y-1 mb-2 max-h-[100px] overflow-y-auto scrollbar-thin">
                                        {subtasks.map(subtask => (
                                            <div
                                                key={subtask.id}
                                                className="flex items-center gap-2 group py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md"
                                            >
                                                <Checkbox
                                                    checked={subtask.completed}
                                                    onCheckedChange={() => toggleSubtaskCompletion(subtask.id)}
                                                    className="h-4 w-4 rounded-sm border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500"
                                                />
                                                <span className={`text-sm flex-grow ${subtask.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                                                    {subtask.title}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 rounded-full hover:bg-red-50 hover:text-red-500"
                                                    onClick={() => deleteSubtask(subtask.id)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}

                                        {subtasks.length === 0 && (
                                            <div className="text-center py-2 text-gray-400 dark:text-gray-500 text-sm">
                                                No subtasks yet
                                            </div>
                                        )}
                                    </div>

                                    {/* Add subtask */}
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            placeholder="Add a subtask"
                                            value={newSubtaskTitle}
                                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                                            className="text-sm"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={addSubtask}
                                            disabled={!newSubtaskTitle.trim()}
                                            className="shrink-0 h-9 w-9 rounded-full hover:bg-gray-100"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Comments section */}
                                {onAddComment && (
                                    <div className="rounded-lg bg-white border border-gray-100 dark:border-gray-700 dark:bg-gray-800/90 p-3 flex flex-col gap-2 flex-grow overflow-hidden max-h-[280px]">
                                        <div className="text-xs font-medium text-gray-500 flex items-center mb-1">
                                            <MessageSquare className="h-3 w-3 mr-1.5" />
                                            Comments
                                        </div>

                                        <div className="flex-grow overflow-y-auto scrollbar-thin">
                                            <TaskComments
                                                task={editedTask}
                                                currentUserId={currentUserId}
                                                currentUserName={currentUserName}
                                                currentUserPhoto={currentUserPhoto}
                                                onAddComment={onAddComment}
                                                onDeleteComment={onDeleteComment || (() => { })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer with actions */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                        {onDelete && (
                            <Button
                                variant="ghost"
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
                                size="sm"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="border-gray-200 h-9"
                                size="sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
                                disabled={!editedTask.title.trim()}
                                size="sm"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Close button - floating, outside main container */}
            <button
                className="absolute top-4 right-4 h-8 w-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                onClick={onClose}
            >
                <X className="h-4 w-4" />
            </button>

            {showShareModal && onShareTask && onUpdatePermission && onRemoveUser && (
                <ShareModal
                    item={editedTask}
                    itemType="task"
                    onClose={() => setShowShareModal(false)}
                    onShare={(task, email, role) => {
                        onShareTask(task as Task, email, role);
                    }}
                    onUpdatePermission={(task, userId, role) => {
                        onUpdatePermission(task as Task, userId, role);
                    }}
                    onRemoveUser={(task, userId) => {
                        onRemoveUser(task as Task, userId);
                    }}
                />
            )}
        </div>
    );
}
