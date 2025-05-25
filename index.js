
const API_URL = "https://682f143f746f8ca4a47fbc38.mockapi.io/Todo-List_2";
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const emptyImage = document.querySelector('.empty-image');

document.addEventListener("DOMContentLoaded", getTodos);
addTaskBtn.addEventListener("click", addTodo);

async function getTodos() {
  try {
    const response = await axios.get(API_URL);

    const ul = document.querySelector('#task-list');
    ul.innerHTML = "";

    // Xắp sếp
    response.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    response.data.forEach((item) => {
      
      // Format Date
      const date = new Date(item.createdAt);
      const formatDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

      // Tạo li
      const li = document.createElement('li');
      
      // Gắn class vào li
      li.classList.add('todo-item');

      // Gắn phần tử con vào li
      li.innerHTML = 
      `
      <input type="checkbox" class="checkbox" id="checkedbox" />
              <div class="todo-content">
                <span>${item.content}</span>
                <p>Create: ${formatDate}</p>
              </div>

              <div class="task-buttons">
                <button class="edit-btn" onclick="handleUpdate(${item.id},'${item.content}')">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn" onclick="handleDelete(${item.id})">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
      `
      // Gắn li vào ul
      ul.appendChild(li);
      
      // Checked 
      
      // const checkedBox = document.querySelector('span');

      // console.log(checkedBox);
      
      // const span = li.querySelector('span');


      // checkedBox.addEventListener("click" , () => {
      //   console.log(span.textContent);
        
      //   span.classList.toggle('text-line-though');  
      // })

       // Xuất hiện hình ảnh
      emptyImage.style.display = li.children.length > 1 ? 'none' : null ;
    })
    
  } catch (error) {
    console.log("Thất bại rồi" + error);
  }
}

async function addTodo(event) {
  event.preventDefault();

  const inputData = taskInput.value.trim();

  if(!inputData){
    return;
  }

  const newTodo = {
    createdAt: new Date().toISOString(),
    content: inputData,
    isCompleted: false,
  };

  try {
    await axios.post(API_URL, newTodo);
    
    taskInput.value = "";
    getTodos();

    showNotification("Add successfully!");
    
  } catch (error) {
    console.log("Thất bại rồi" + error);
  }
}

function handleUpdate(id, content){
  Swal.fire({
  title: "Edit Your Task",
  input: "text",
  inputAttributes: {
    autocapitalize: "off"
  },
  inputValue: content,
  showCancelButton: true,
  confirmButtonText: "Save",
  showLoaderOnConfirm: true,
  preConfirm: async (dataInput) => {
    
    await axios.put(`${API_URL}/${id}`, {
      content: dataInput,
    });
    getTodos();
    showNotification("Updated successfully!")
  },
  });
}

function handleDelete(id){
  const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger mr-3",
  },
  buttonsStyling: false
});
swalWithBootstrapButtons
.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "No, cancel!",
  reverseButtons: true
})
.then(async (result) => {
  if (result.isConfirmed) {
    await axios.delete(`${API_URL}/${id}`)  
    getTodos();
    emptyImage.style.display = 'block';
    showNotification("Deleted successfully");
    
  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire({
      title: "Cancelled",
      text: "Your imaginary file is safe :)",
      icon: "error"
    });
  }
});
}

function showNotification(message){
  Swal.fire({
      title: message,
      icon: "success",
      draggable: true
    });
}


