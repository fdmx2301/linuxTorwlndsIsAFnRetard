import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Modal from "./Modal";
import '../styles/InteractiveList.css';

function InteractiveList() {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [completedItems, setCompletedItems] = useState([]);
    const [isAddingNewItem, setIsAddingNewItem] = useState(false);
    const [newItem, setNewItem] = useState({
        id: null,
        description: "",
    });
    const [inputError, setInputError] = useState(false);
    const inputRef = useRef(null);
    
    const [isEditingItem, setIsEditingItem] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editedDescription, setEditedDescription] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClearListModalOpen, setIsClearListModalOpen] = useState(false);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);

    const [deletingItemId, setDeletingItemId] = useState(null);
    const [isDeleteSingleItemModalOpen, setIsDeleteSingleItemModalOpen] = useState(false);

    const memoizedCompletedItems = useMemo(() => completedItems, [completedItems]);
    const memoizedSelectedItems = useMemo(() => selectedItems, [selectedItems]);

    const toggleSelectItem = useCallback((itemId) => {
        if (isAddingNewItem || isEditingItem) return;
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter((id) => id !== itemId)
                : [...prevSelectedItems, itemId]
        );
    }, [isAddingNewItem, isEditingItem]);
    
    const openClearListModal = () => {
        setIsModalOpen(true);
        setIsClearListModalOpen(true);
    };
    const openDeleteSelectedModal = () => {
        setIsModalOpen(true);
        setIsDeleteSelectedModalOpen(true);
    };
    const openDeleteSingleItemModal = (itemId) => {
        setIsModalOpen(true);
        setDeletingItemId(itemId);
        setIsDeleteSingleItemModalOpen(true);
    };

    const clearList = useCallback(() => {
        setItems([]);
        setSelectedItems([]);
        setCompletedItems([]);
        setIsAddingNewItem(false);
        setNewItem({ id: null, description: "" });
        setInputError(false);
    }, []);

    const deleteSelectedItems = useCallback(() => {
        setItems((prevItems) =>
            prevItems.filter((item) => !memoizedSelectedItems.includes(item.id))
        );
        setSelectedItems([]);
    }, [memoizedSelectedItems]);

    const confirmClearList = useCallback(() => {
        clearList();
        closeModals();
    }, [clearList]);
    
    const confirmDeleteSelected = useCallback(() => {
        deleteSelectedItems();
        closeModals();
    }, [deleteSelectedItems]);

    const clearItem = useCallback((itemId) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.filter((id) => id !== itemId)
        );
        setCompletedItems((prevCompletedItems) =>
            prevCompletedItems.filter((id) => id !== itemId)
        );
    }, []);

    const confirmDeleteSingleItem = useCallback(() => {
        if (deletingItemId !== null) {
            clearItem(deletingItemId);
        }
        closeModals();
    }, [deletingItemId, clearItem]);

    const closeModals = () => {
        setDeletingItemId(null);
        setIsModalOpen(false);
        setIsClearListModalOpen(false);
        setIsDeleteSelectedModalOpen(false);
        setIsDeleteSingleItemModalOpen(false);
    };

    const startAddingItem = () => {
        setIsAddingNewItem(true);
        setNewItem({ id: Date.now(), description: "" });
        setInputError(false);
        setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    };

    const validateInput = useCallback((e) => {
        if (newItem.description.trim() === "") {
            e.preventDefault();
            setInputError(true);
            return false;
        }
        return true;
    }, [newItem]);

    const confirmAddItem = useCallback((e) => {
        if (!validateInput(e)) return;

        setItems((prevItems) => [...prevItems, newItem]);
        setIsAddingNewItem(false);
        setNewItem({ id: null, description: "" });
        setInputError(false);
    }, [newItem, validateInput]);

    const declineAddItem = useCallback((e) => {
        e.preventDefault();
        setIsAddingNewItem(false);
        setNewItem({ id: null, description: "" });
        setInputError(false);
    }, []);

    const completeItem = useCallback((itemId) => {
        toggleSelectItem(itemId);

        if (memoizedCompletedItems.includes(itemId)) return;

        setCompletedItems((prevCompletedItems) =>
            prevCompletedItems.includes(itemId)
                ? prevCompletedItems.filter((id) => id !== itemId)
                : [...prevCompletedItems, itemId]
        );
        setSelectedItems([]);
    }, [memoizedCompletedItems, toggleSelectItem]);

    const startEditingItem = (item) => {
        setIsEditingItem(true);
        setEditingItemId(item.id);
        setEditedDescription(item.description);
    };
    
    const confirmEditItem = (itemId) => {
        setIsEditingItem(false);
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, description: editedDescription } : item
            )
        );
        setEditingItemId(null);
        setEditedDescription("");
    };
    
    const cancelEditItem = () => {
        setIsEditingItem(false);
        setEditingItemId(null);
        setEditedDescription("");
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && isModalOpen) {
            if (isClearListModalOpen) {
                confirmClearList();
            }
            if (isDeleteSelectedModalOpen) {
                confirmDeleteSelected();
            }
            if (isDeleteSingleItemModalOpen) {
                confirmDeleteSingleItem();
            }
        }
    
        if (e.key === "Enter" && !isModalOpen) {
            confirmAddItem(e);
        }
    
        if (e.key === "Escape" && isModalOpen) {
            closeModals();
        }
    
        if (e.key === "Escape" && !isModalOpen) {
            setSelectedItems([]);
            if (isAddingNewItem) {
                setIsAddingNewItem(false);
                setNewItem({ id: null, description: "" });
                setInputError(false);
            }
        }
    }, [
        confirmAddItem, 
        isAddingNewItem, 
        isModalOpen, 
        confirmClearList, 
        confirmDeleteSelected, 
        confirmDeleteSingleItem,
        isDeleteSelectedModalOpen,
        isClearListModalOpen,
        isDeleteSingleItemModalOpen
    ]);
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="list__wrapper">
            <div className="list__control-panel">
                <button
                    className="control-panel__item control-panel__item--add"
                    type="button"
                    onClick={startAddingItem}
                    disabled={isAddingNewItem || isEditingItem}
                    title="Добавить задачу"
                >
                    Добавить задачу
                </button>
                <button
                    className="control-panel__item control-panel__item--delete-selected"
                    type="button"
                    onClick={openDeleteSelectedModal}
                    disabled={selectedItems.length === 0 || isAddingNewItem || isEditingItem}
                    title="Удалить выбранные задачи"
                >
                    Удалить выбранные
                </button>
                <button
                    className="control-panel__item control-panel__item--complete"
                    type="button"
                    onClick={() => selectedItems.map((id) => completeItem(id))}
                    disabled={selectedItems.length === 0 || isAddingNewItem || isEditingItem}
                    title="Завершить задачу"
                >
                    Закрыть выбранные
                </button>
                <button
                    className="control-panel__item control-panel__item--clearlist"
                    type="button"
                    onClick={openClearListModal}
                    disabled={items.length === 0}
                    title="Очистить список"
                >
                    Очистить список
                </button>
            </div>
    
            <Modal
                isOpen={isClearListModalOpen}
                onClose={closeModals}
                title="Очистить список?"
            >
                <p>Вы действительно хотите удалить все задачи из списка?</p>
                <div className="modal__actions">
                    <button className="modal__button" onClick={confirmClearList}>
                        Да
                    </button>
                    <button className="modal__button modal__button--cancel" onClick={closeModals}>
                        Отмена
                    </button>
                </div>
            </Modal>
    
            <Modal
                isOpen={isDeleteSelectedModalOpen}
                onClose={closeModals}
                title="Удалить выбранные задачи?"
            >
                <p>Вы уверены, что хотите удалить выбранные задачи?</p>
                <div className="modal__actions">
                    <button className="modal__button" onClick={confirmDeleteSelected}>
                        Да
                    </button>
                    <button className="modal__button modal__button--cancel" onClick={closeModals}>
                        Отмена
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={isDeleteSingleItemModalOpen}
                onClose={closeModals}
                title="Удалить задачу?"
            >
                <p>Вы уверены, что хотите удалить эту задачу?</p>
                <div className="modal__actions">
                    <button className="modal__button" onClick={confirmDeleteSingleItem}>
                        Да
                    </button>
                    <button className="modal__button modal__button--cancel" onClick={closeModals}>
                        Отмена
                    </button>
                </div>
            </Modal>

            <ul className="list__body">
                {items.map((item) => (
                    <li
                        className={`list__item ${
                            completedItems.includes(item.id) ? "list__item--completed" : ""
                        }`}
                        key={item.id}
                        onClick={() => toggleSelectItem(item.id)}
                    >
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => e.stopPropagation()}
                            className="list__item-checkbox"
                        />
    
                        {editingItemId === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") confirmEditItem(item.id);
                                        if (e.key === "Escape") cancelEditItem();
                                    }}
                                    autoFocus
                                    className="list__item-input"
                                />
                                <button
                                    className="list__item-confirm"
                                    onClick={() => confirmEditItem(item.id)}
                                >
                                    ✓
                                </button>
                                <button className="list__item-cancel" onClick={cancelEditItem}>
                                    ✕
                                </button>
                            </>
                        ) : (
                            <>
                                <span>{item.description}</span>
                                <div className="list__item-actions">
                                    <button
                                        className="list__item-complete"
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            completeItem(item.id);
                                        }}
                                        disabled={editingItemId !== null || isAddingNewItem}
                                        title="Закрыть задачу"
                                    >
                                        Закрыть
                                    </button>
                                    <button
                                        className="list__item-edit"
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingItem(item);
                                        }}
                                        disabled={editingItemId !== null || isAddingNewItem}
                                        title="Изменить задачу"
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        className="list__item-delete"
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDeleteSingleItemModal(item.id);
                                        }}
                                        disabled={editingItemId !== null || isAddingNewItem}
                                        title="Удалить задачу"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
    
                {isAddingNewItem && (
                    <li className="list__item">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newItem.description}
                            onChange={(e) => {
                                setNewItem({ ...newItem, description: e.target.value });
                                setInputError(false);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                inputError ? "Сперва добавьте задачу" : "Новая задача"
                            }
                            className={`list__item-input ${
                                inputError ? "list__item-input--error" : ""
                            }`}
                        />
                        <button
                            className="list__item-confirm"
                            type="button"
                            onClick={confirmAddItem}
                        >
                            ✓
                        </button>
                        <button
                            className="list__item-decline"
                            type="button"
                            onClick={declineAddItem}
                        >
                            ✕
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );    
}

export default InteractiveList;
