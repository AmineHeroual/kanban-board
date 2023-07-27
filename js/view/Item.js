import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";
import Kanban from "./Kanban.js";

export default class Item {
  constructor(id, content) {
    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Item.createRoot();
    this.elements.input = this.elements.root.querySelector(
      ".kanban--item-input"
    );

    this.elements.upBtn = this.elements.root.querySelector(".taskBtn--update");
    this.elements.delBtn = this.elements.root.querySelector(".taskBtn--delete");

    this.elements.root.dataset.id = id;
    this.elements.input.textContent = content;
    this.elements.body = content;
    this.content = content;
    this.elements.root.appendChild(bottomDropZone);

    const onBlur = () => {
      const newContent = this.elements.input.textContent.trim();

      if (newContent == this.content) {
        return;
      }

      this.content = newContent;
      KanbanAPI.updateItem(id, {
        content: this.content,
      });
    };

    // update item

    this.elements.upBtn.addEventListener("click", () => {
      window.location.reload();
    });

    // delete item

    this.elements.input.addEventListener("blur", onBlur);
    this.elements.delBtn.addEventListener("click", () => {
      const check = confirm("Are you sure you want to delete this item?");

      if (check) {
        KanbanAPI.deleteItem(id);

        this.elements.input.removeEventListener("blur", onBlur);
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });

    this.elements.root.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
    });

    this.elements.input.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  }

  static createRoot() {
    const range = document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
        <div class="kanban--item" draggable="true">
        <div class="box">
        <div class="kanban--item-input" contenteditable></div>
        <div class="taskBtns">
        <button  class="taskBtn taskBtn--update">&#10227;</button>
        <button   class="taskBtn taskBtn--delete">&#10008;</button>
      </div>
        </div>
        </div>
    `).children[0];
  }
}
