import { backend } from 'declarations/backend';

const shoppingList = document.getElementById('shopping-list');
const addItemForm = document.getElementById('add-item-form');
const newItemInput = document.getElementById('new-item');

async function loadItems() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
        const li = createListItem(item);
        shoppingList.appendChild(li);
    });
}

function createListItem(item) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
        <div class="note">${item.note}</div>
        <div>
            <button class="toggle-btn ${item.completed ? 'completed' : ''}">
                <i class="fas ${item.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
            </button>
            <button class="add-note-btn"><i class="fas fa-sticky-note"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    const toggleBtn = li.querySelector('.toggle-btn');
    toggleBtn.addEventListener('click', async () => {
        const success = await backend.updateItem(item.id, !item.completed);
        if (success) {
            await loadItems();
        }
    });

    const addNoteBtn = li.querySelector('.add-note-btn');
    addNoteBtn.addEventListener('click', async () => {
        const note = prompt('Enter a note for this item:', item.note);
        if (note !== null) {
            const success = await backend.addNoteToItem(item.id, note);
            if (success) {
                await loadItems();
            }
        }
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async () => {
        const success = await backend.deleteItem(item.id);
        if (success) {
            await loadItems();
        }
    });

    return li;
}

addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = newItemInput.value.trim();
    if (text) {
        await backend.addItem(text);
        newItemInput.value = '';
        await loadItems();
    }
});

// Initial load
loadItems();
