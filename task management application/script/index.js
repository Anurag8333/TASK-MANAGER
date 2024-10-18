const state = {
    taskContainer: [],
};

const taskContent = document.querySelector(".task_content");
const taskModal = document.querySelector(".task_modal_body");

const htmlTaskContent = ({ id, title, description, type, url }) => `
<div class ="col-md-6 col-lg-4 mt-3 mb-3" id=${id} key=${id}>
<div class="card shadow-sm task__card">
<div class="card-header d-flex gap-2 justify-content-end task_card_header">
<button type="button" class="btn btn-outline-info mr-2 z-5" name=${id} onclick="editTask.apply(this,arguments)"><i class="fa-solid fa-pen-to-square" name=${id} ></i></button>
<button type="button" class="btn btn-outline-danger z-5 mr-2" name=${id} onclick="deleteTask.apply(this,arguments)"><i class="fa-solid fa-trash" name=${id}></i></button>
</div> 
<div class"card-body p-5">
${
  url ?
  `<img src=${url}  height="300px" alt ="card image cap" class="card-img-top rounded-lg"/>`
  :
  `<img src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" width="100%" alt ="card image cap" class="card-img-top md-3 rounded-lg"/>`
}
<h4 class="task_card_title mx-2">${title}</h4>
<p class="card-text mx-2">${description}</p>
<div class="tags text-white d-flex flex-wrap">
    <span class="badge bg-primary m-1 mx-2">${type}</span>
</div>
</div>  
<div class="card-footer ">
<button type="button" class="btn btn-outline-primary float-end " data-bs-toggle="modal"
data-bs-target="#showTask"
id=${id}
onclick="openTask.apply(this,arguments)"
>Open Task</button>
</div>
</div>
</div>
`;

const htmlModalContent =({id,title,description,type,url})=>{
const data = new Date(parseInt(id));
return ` 
<div id=${id} class="rounded mx-auto d-block">
  ${
    url? `<img src=${url} alt="card image cap" class="card-img-top place_holder_image mb-3"/>`
    :
    ` <img src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" alt="card image cap" class="card-img-top place_holder_image mb-3"/>`
  }
  <br/>
  <strong class="text-sm text-muted">Created on ${data}</strong>
  <h2 class="my-3">${title}</h2>
  <p class="Lead">
  ${description}
  </p>
  </div>`;
};


const updateLocalStorage =()=>{
  localStorage.setItem(
    "tasks",JSON.stringify({
      tasks: state.taskContainer,
    })
  );
};

const LoadInitialData =() =>{
  const LocalStorageCopy = JSON.parse(localStorage.tasks);

  if(LocalStorageCopy)state.taskContainer=LocalStorageCopy.tasks;

  state.taskContainer.map((cardData)=>{
    taskContent.insertAdjacentHTML("beforeend",htmlTaskContent(cardData));
  });

  // console.log(state.taskContainer[0]);

//   let body = document.querySelector("body");
// body.innerHTML= htmlModalContent(state.taskContainer[0]);


};


const handleSubmit =(event)=>{
const id = `${Date.now()}`;
const input ={
  url:document.getElementById("img_url").value,
  title:document.getElementById("task_title").value,
  type:document.getElementById("tags").value,
  description:document.getElementById("task_description").value
};

if(input.title ==="" || input.description === ""){
 return alert("Please fill in all fields");
}

taskContent.insertAdjacentHTML("beforeend",htmlTaskContent({
  ...input,id
})
);

state.taskContainer.push({...input,id});
updateLocalStorage();
};

const openTask =(e)=>{
  if(!e) e = Window.event;
  const getTask = state.taskContainer.find(({id})=>id == e.target.id);
  taskModal.innerHTML= htmlModalContent(getTask);
};

const deleteTask= (e)=>{
  if(!e) e = Window.event;
 const targetId = e.target.getAttribute('name');
 console.log(targetId);
 const  type = e.target.tagName;
 console.log(type);
const removeTask = state.taskContainer.filter(({id})=> id !== targetId);
console.log("remove : "+removeTask);
state.taskContainer = removeTask;
updateLocalStorage();
console.log(state.taskContainer);

if(type == "BUTTON"){
  console.log(e.target.parentNode.parentNode.parentNode.parentNode);
  console.log(e.target.parentNode.parentNode.parentNode);
  return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode
  );
}
else{
return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
  e.target.parentNode.parentNode.parentNode.parentNode
);
}
};


const editTask = (e)=>{
  if(!e) e = Window.event;
  const targetId = e.target.getAttribute('name');
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if(type === "BUTTON"){
    parentNode = e.target.parentNode.parentNode;
  }
  else{
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  console.log(type);
  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];
  console.log(taskTitle);
  console.log(taskDescription);
  console.log(taskType);
  console.log(submitButton);
 
  taskTitle.setAttribute("contenteditable","true");
  taskDescription.setAttribute("contenteditable","true");
  taskType.setAttribute("contenteditable","true");

  submitButton.setAttribute("onclick","saveEdit.apply(this,arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML ="Save Changes";
};   

const saveEdit =(e)=>{
 if(!e) e = Window.event;
 const targetId = e.target.id;
 const type = e.target.tagName;
 let parentNode;
 let taskTitle;
 let taskType;
 let taskDescription;
 let submitButton;
 if(type === "BUTTON"){
  parentNode = e.target.parentNode.parentNode;
 }  
 taskTitle = parentNode.childNodes[3].childNodes[3];
 taskDescription = parentNode.childNodes[3].childNodes[5];
 taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
 submitButton = parentNode.childNodes[5].childNodes[1];
 console.log(taskTitle);

let copyState = state.taskContainer;

copyState = copyState.map((task)=> task.id == targetId ? {
  id : task.id,
  title : taskTitle.innerHTML,
  description : taskDescription.innerHTML,
  type : taskType.innerHTML,
  url : task.url, 
}:task);

state.taskContainer = copyState;
updateLocalStorage(); 

taskTitle.setAttribute("contenteditable","false");
taskDescription.setAttribute("contenteditable","false");
taskType.setAttribute("contenteditable","false");

submitButton.setAttribute("onclick","openTask.apply(this,arguments)");
submitButton.setAttribute("data-bs-toggle","modal");
  submitButton.setAttribute("data-bs-target","#showTask");
  submitButton.innerHTML = "Open Task";
};

console.log(state.taskContainer);

const searchTask =(e)=>{
  if(!e) e = Window.event;

  while(taskContent.firstChild){
    taskContent.removeChild(taskContent.firstChild);
  }

  const resultData = state.taskContainer.filter(({title})=> {
    return title.includes(e.target.value)
  });
  console.log(resultData);
  resultData.map((cardData)=>{
    taskContent.insertAdjacentHTML("beforeend",htmlTaskContent(cardData));
  });
}