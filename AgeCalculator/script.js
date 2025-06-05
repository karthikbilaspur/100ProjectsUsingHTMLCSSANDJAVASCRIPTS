
let currentStep = 1;
let picsArray = [];
let matchName = '';
let chatName = '';
let chatLog = [];

document.getElementById('next-step-1').addEventListener('click', () => {
    currentStep++;
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
});

document.getElementById('prev-step-1').addEventListener('click', () => {
    currentStep--;
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
});

document.getElementById('next-step-2').addEventListener('click', () => {
    currentStep++;
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'block';
});

document.getElementById('prev-step-2').addEventListener('click', () => {
    currentStep--;
    document.getElementById('step-2').style.display = 'block';
    document.getElementById('step-3').style.display = 'none';
});

document.getElementById('submit-form').addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const bio = document.getElementById('bio').value;
    const interests = Array.from(document.getElementById('interests').selectedOptions).map(option => option.value);
    const likes = document.getElementById('likes').value;
    const dislikes = document.getElementById('dislikes').value;
    const pics = document.getElementById('pics').files;

    if (pics.length > 10) {
        alert('Please select a maximum of 10 pictures');
        return;
    }

    for (let i = 0; i < pics.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
            picsArray.push(reader.result);
            if (picsArray.length === pics.length) {
                displayCard(name, age, bio, interests, likes, dislikes, picsArray);
            }
        };
        reader.readAsDataURL(pics[i]);
    }

    if (pics.length === 0) {
        displayCard(name, age, bio, interests, likes, dislikes, picsArray);
    }
});

function displayCard(name, age, bio, interests, likes, dislikes, pics) {
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('.card-container').style.display = 'block';

    document.getElementById('card-name').innerText = name;
    document.getElementById('card-age').innerText = `Age: ${age}`;
    document.getElementById('card-bio').innerText = bio;
    const interestsList = document.getElementById('card-interests');
    interestsList.innerHTML = '';
    interests.forEach(interest => {
        const li = document.createElement('li');
        li.innerText = interest;
        interestsList.appendChild(li);
    });
    document.getElementById('card-likes').innerText = likes;
    document.getElementById('card-dislikes').innerText = dislikes;

    pics.forEach((pic) => {
        const img = document.createElement('img');
        img.src = pic;
        document.getElementById('pics-container').appendChild(img);
    });

    document.getElementById('match-btn').addEventListener('click', () => {
        matchName = name;
        document.querySelector('.card-container').style.display = 'none';
        document.querySelector('.match-container').style.display = 'block';
        document.getElementById('match-name').innerText = matchName;
    });

    document.getElementById('message-btn').addEventListener('click', () => {
        chatName = name;
        document.querySelector('.card-container').style.display = 'none';
        document.querySelector('.chat-container').style.display = 'block';
        document.getElementById('chat-name').innerText = chatName;
    });
}

document.getElementById('start-chat-btn').addEventListener('click', () => {
    document.querySelector('.match-container').style.display = 'none';
    document.querySelector('.chat-container').style.display = 'block';
    document.getElementById('chat-name').innerText = matchName;
});

document.getElementById('send-msg-btn').addEventListener('click', () => {
    const msg = document.getElementById('chat-input').value;
    chatLog.push(msg);
    document.getElementById('chat-log').innerHTML += `<p>${msg}</p>`;
    document.getElementById('chat-input').value = '';
});

// Add event listener for message button
document.getElementById('message-btn').addEventListener('click', () => {
    document.querySelector('.card-container').style.display = 'none';
    document.querySelector('.chat-container').style.display = 'block';
    document.getElementById('chat-name').innerText = document.getElementById('card-name').innerText;
});

// Add event listener for send message button
document.getElementById('send-msg-btn').addEventListener('click', () => {
    const message = document.getElementById('chat-input').value;
    document.getElementById('chat-log').innerHTML += `<p>You: ${message}</p>`;
    document.getElementById('chat-input').value = '';
});