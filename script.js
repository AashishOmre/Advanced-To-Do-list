let addbtn = document.querySelector('.add-btn');
let mainModal = document.querySelector('.main-modal-cont');
let ticketCont = document.querySelector('.ticket-cont');
let flag = true;

let ticketArr = [];

// get all tickets from local storage
if (localStorage.getItem('tickets')){
  ticketArr = JSON.parse(localStorage.getItem('tickets'));
  ticketArr.forEach(function(Object1){
    generateTicket(Object1.color, Object1.text, Object1.ticketid);
  })
}


addbtn.addEventListener('click', function (e) {

  //display a model
  if (flag) {
    mainModal.style.display = 'flex';
    flag = false
  }
  else {
    mainModal.style.display = 'none';

    flag = true;
  }

});



//filter color with respective clicked color button


let toolBoxColors = document.querySelectorAll('.colors');

for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener('click', function () {

    let currentColor = toolBoxColors[i].classList[0];

    let targetTicket = ticketArr.filter(function (TicketObject) {
      return (currentColor === TicketObject.color);
    })

    let allTickets = document.querySelectorAll('.main-ticket');
    // remove previous tickets
    for (let i = 0; i < allTickets.length - 1; i++) {
      allTickets[i].remove();
    }

    //print clicked color tickets
    targetTicket.forEach(function (Object) {
      generateTicket(Object.color, Object.text, Object.ticketid);

    })
  })
}


//show all tickets after dbl clicking on any priority color btn
for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener('dblclick', function () {
    let allTickets = document.querySelectorAll('.main-ticket');
    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }

    ticketArr.forEach(function (Object) {
      generateTicket(Object.color, Object.text, Object.ticketid);
    })
  })

}


let color = ['lightpink', 'lightgreen', 'lightblue', 'black']
let prioritycolor = color[color.length - 1];

let body = document.querySelector("body");
let main = document.querySelector('.main-modal-cont');

let textarea = document.querySelector('.text-cont');

//creating ticket after pressing shift btn
main.addEventListener('keydown', function (e) {

  if ((e.key) == 'Shift') {
    generateTicket(prioritycolor, textarea.value);
    main.style.display = 'none';
    flag = true;

    //remove last task from modal
    textarea.value = '';
  }

});


//Generate Task

function generateTicket(color, text, ticketid) {

  let id = ticketid || shortid();

  let div = document.createElement('div');

  div.setAttribute('class', 'main-ticket');

  div.innerHTML = `<div class="main-ticket">
<div class="ticket-color ${color}">
</div>
<div class="ticket-id">
     #${id}
</div>
<div class="ticket-body">
  ${text}
  <div class="lock-icon">
    <i class="fa-solid fa-lock"></i>
  </div>
</div>
</div>`;

  ticketCont.appendChild(div);
  removehandler(div,id);
  handlelock(div,id);
  handleColor(div,id);
  if (!ticketid) {
    ticketArr.push({ color, text, ticketid: id });
    localStorage.setItem('tickets', JSON.stringify(ticketArr));
  }

}


//remove-btn functionality

let removebtn = document.querySelector('.remove-btn');
let allticket = document.querySelectorAll('.main-ticket');
let flag1 = false;

removebtn.addEventListener('click', function () {
  flag1 = !flag1
  if (flag1) {
    removebtn.style.color = '#ee5253';
  }
  else {
    removebtn.style.color = '';
  }
});

function removehandler(ticket , id ) {
  ticket.addEventListener('click', function () {
    if(!flag1)
        return

     let idx=getTicketIdx(id);

     //localstorage  removal of Ticket

     //slice part of array (idx,count)
      ticketArr.splice(idx,1);  

      let updatedArr= JSON.stringify(ticketArr);
      //update localstorage
      localStorage.setItem('tickets',updatedArr);
      ticket.remove();
  })

}

//changing priority color

let allpriorityColor = document.querySelectorAll('.priority-color');

allpriorityColor.forEach(function (colorEle) {

  colorEle.addEventListener('click', function () {
    allpriorityColor.forEach(function (e) {
      e.classList.remove('active');
    })
    colorEle.classList.add('active');

    prioritycolor = colorEle.classList[0];
  })


});

//lock and unlock functionality

function handlelock(ticket,id) {
  let lockicon = ticket.querySelector('.lock-icon');
  let lockicon1 = lockicon.children[0];

  let Tickettext = ticket.querySelector('.ticket-body');

  let lock = 'fa-lock';
  let unlock = 'fa-lock-open';
  lockicon1.addEventListener('click', function () {
    if (lockicon1.classList.contains(lock)) {
      lockicon1.classList.remove(lock);
      lockicon1.classList.add(unlock);
      Tickettext.setAttribute("contenteditable", "true");
    }
    else {
      lockicon1.classList.remove(unlock);
      lockicon1.classList.add(lock);
      Tickettext.setAttribute("contenteditable", "false");
    }
    let idx=getTicketIdx(id);
    ticketArr[idx].text=Tickettext.innerText;
     //update localstorage
     localStorage.setItem('tickets',JSON.stringify(ticketArr));

  })
}



function handleColor(ticket,id) {
  let ticketColorBand = ticket.querySelector(".ticket-color");

  ticketColorBand.addEventListener("click", function () {
    let currentTicketColor = ticketColorBand.classList[1];

    let currentTicketColoridx = color.findIndex(function (color) {
      return currentTicketColor === color;
    });

    currentTicketColoridx++;

    let newTicketColorIdx = currentTicketColoridx % color.length;
    let newTicketColor = color[newTicketColorIdx];
     
    ticketColorBand.classList.remove(currentTicketColor);
    ticketColorBand.classList.add(newTicketColor);

     let ticketIdx = getTicketIdx(id);
     console.log(ticketArr,newTicketColor,ticketIdx);
     ticketArr[ticketIdx].color= newTicketColor;

     //update localstorage
     localStorage.setItem('tickets',JSON.stringify(ticketArr));

  });
}

//get ticket index of passed ticket id
function getTicketIdx(id){
   let ticketIdx=ticketArr.findIndex(function(Object){
        return Object.ticketid === id 
   })
   return ticketIdx;
}