const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
const button = document.querySelector("button")

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === ".....") {
      element.textContent = "";
    }
  },300)
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++
    }
  }, 20)
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNuber = Math.random();
  const hexString = randomNuber.toString(16);

  return `id ${timeStamp}-${hexString}`
}

function chatStripe(isAI, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAI && "ai"}">
        <div class="chat"> 
          <div class="profile">
              <img src = "${isAI ? "./shuvo.jpg" : "./images.png"}"
              alt="${isAI ? "bot" : "user"}">
          </div>
          <div class="message" id="${uniqueId}">
          ${value}
          </div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  // user's stripe
  const ifEmpty = data.get("prompt")
  if (ifEmpty==="") {
    alert("please write something")
  }else{
    chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
    form.reset();
    // bot chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  
    chatContainer.scrollTop = chatContainer.scrollHeight;
  
    const messageDiv = document.getElementById(uniqueId);
  
    loader(messageDiv)
  
    // fetch data from server
    const response = await fetch("https://shuvo-artificial.onrender.com/chat",{
        method: "POST",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            prompt: data.get("prompt")
        })
    })
    clearInterval(loadInterval);
    messageDiv.innerHTML = " ";
    if (response.ok) {
      const datas = await response.json();
      const parsedData = datas.bot.trim();
      typeText(messageDiv,parsedData)
    }else{
      const error = await response.text();
      messageDiv.innerHTML = "something went wrong"
      alert(error)
    }
  }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})