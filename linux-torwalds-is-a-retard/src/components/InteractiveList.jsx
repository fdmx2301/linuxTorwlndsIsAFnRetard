import { useState, useRef, useEffect, useCallback } from "react";
import '../styles/InteractiveList.css';

function InteractiveList() {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isAddingNewItem, setIsAddingNewItem] = useState(false);
    const [newItem, setNewItem] = useState({
        id: null,
        description: "",
    });
    const [inputError, setInputError] = useState(false);
    const inputRef = useRef(null);

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

    const clearList = () => {
        setItems([]);
        setSelectedItems([]);
        setIsAddingNewItem(false);
        setNewItem({ id: null, description: "" });
        setInputError(false);
    };

    const toggleSelectItem = (itemId) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter((id) => id !== itemId)
                : [...prevSelectedItems, itemId]
        );
    };

    const deleteSelectedItems = () => {
        setItems((prevItems) =>
            prevItems.filter((item) => !selectedItems.includes(item.id))
        );
        setSelectedItems([]);
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            confirmAddItem(e);
        }
        if (e.key === "Escape") {
            setSelectedItems([]);
            if (isAddingNewItem) {
                setIsAddingNewItem(false);
                setNewItem({ id: null, description: "" });
                setInputError(false);
            }
        }
    }, [confirmAddItem, isAddingNewItem]);
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
                    disabled={isAddingNewItem}
                    title="Добавить задачу"
                >
                    +
                </button>
                <button 
                    className="control-panel__item control-panel__item--delete-selected"
                    type="button"
                    onClick={deleteSelectedItems}
                    disabled={selectedItems.length === 0}
                    title="Удалить выбранные задачи"
                >
                    &times;
                </button>
                <button 
                    className="control-panel__item control-panel__item--clearlist"
                    type="button"
                    onClick={clearList}
                    disabled={items.length === 0}
                    title="Очистить список"
                >
                    Очистить список
                </button>
            </div>
            
            <ul className="list__body">
                {items.map((item) => (
                    <li className="list__item" key={item.id}>
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            className="list__item-checkbox"
                        />
                        <span>{item.description}</span>
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
                            placeholder={inputError ? "Сперва добавьте задачу" : "Новая задача"}
                            className={`list__item-input ${inputError ? "list__item-input--error" : ""}`}
                        />
                        <button
                            className="list__item-confirm"
                            type="button"
                            onClick={confirmAddItem}
                        >
                            <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    d="M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" 
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default InteractiveList;
