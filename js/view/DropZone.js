import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
  static createDropZone() {
    const range = document.createRange();

    range.selectNode(document.body);

    const dropZone = range.createContextualFragment(`
        <div class="kanban--dropzone"></div>
    `).children[0];

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("kanban--dropzone--active");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("kanban--dropzone--active");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("kanban--dropzone--active");

      const columnElement = dropZone.closest(".kanban--column");
      const columnId = Number(columnElement.dataset.id);
      const dropZonesInColumn = Array.from(
        columnElement.querySelectorAll(".kanban--dropzone")
      );
      const droppedIndex = dropZonesInColumn.indexOf(dropZone);

      const itemId = Number(e.dataTransfer.getData("text/plain"));
      const droppeditemElement = document.querySelector(
        `[data-id="${itemId}"]`
      );

      const insertAfter = dropZone.parentElement.classList.contains(
        "kanban--item"
      )
        ? dropZone.parentElement
        : dropZone;

      if (droppeditemElement.contains(dropZone)) {
        return;
      }

      insertAfter.after(droppeditemElement);
      KanbanAPI.updateItem(itemId, {
        columnId,
        position: droppedIndex,
      });
    });

    return dropZone;
  }
}
