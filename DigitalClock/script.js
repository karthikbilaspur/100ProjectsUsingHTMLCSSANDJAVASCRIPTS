// script.js
class DigitalClock {
    constructor() {
      this.hours = document.querySelectorAll(".hours .digit");
      this.minutes = document.querySelectorAll(".minutes .digit");
      this.seconds = document.querySelectorAll(".seconds .digit");
      this.colons = document.querySelectorAll(".colons");
      this.alarmTimeInput = document.getElementById("alarm-time");
      this.setAlarmButton = document.getElementById("set-alarm");
      this.alarmSound = new Audio("alarm-sound.mp3");
  
      this.setNumber = this.setNumber.bind(this);
      this.updateClock = this.updateClock.bind(this);
      this.checkAlarm = this.checkAlarm.bind(this);
  
      this.updateClock();
      setInterval(this.updateClock, 1000);
      setInterval(this.checkAlarm, 1000);
  
      this.setAlarmButton.addEventListener("click", () => {
        this.setAlarm();
      });
  
      // Add event listeners for social sharing
      document.querySelector(".facebook-share").addEventListener("click", () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, "_blank");
      });
  
      document.querySelector(".twitter-share").addEventListener("click", () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`;
        window.open(url, "_blank");
      });
  
      document.querySelector(".whatsapp-share").addEventListener("click", () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`;
        window.open(url, "_blank");
      });
  
      document.querySelector(".linkedin-share").addEventListener("click", () => {
        const url = `https://www.linkedin.com/sharing/share?url=${encodeURIComponent(window.location.href)}`;
        window.open(url, "_blank");
      });
    }
  
    setNumber(element, number) {
      const show = element.querySelectorAll(`.n${number}`);
      const hide = element.querySelectorAll(`:not(.n${number})`);
  
      hide.forEach((el) => {
        el.classList.remove("active");
      });
      show.forEach((el) => {
        el.classList.add("active");
      });
    }
  
    updateClock() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
  
      this.setNumber(this.hours[0], Math.floor(hours / 10));
      this.setNumber(this.hours[1], Math.floor(hours % 10));
      this.setNumber(this.minutes[0], Math.floor(minutes / 10));
      this.setNumber(this.minutes[1], Math.floor(minutes % 10));
      this.setNumber(this.seconds[0], Math.floor(seconds / 10));
      this.setNumber(this.seconds[1], Math.floor(seconds % 10));
  
      // Toggle colons
      this.colons.forEach((colon) => {
        colon.style.opacity = now.getMilliseconds() < 500 ? 1 : 0;
      });
    }
  
    setAlarm() {
      const alarmTime = this.alarmTimeInput.value;
      localStorage.setItem("alarmTime", alarmTime);
      alert("Alarm set for " + alarmTime);
    }
  
    checkAlarm() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const alarmTime = localStorage.getItem("alarmTime");
  
      if (alarmTime) {
        const [alarmHours, alarmMinutes] = alarmTime.split(":");
        if (hours == alarmHours && minutes == alarmMinutes) {
          this.alarmSound.play();
          alert("Wake up!");
        }
      }
    }
  }
  
  new DigitalClock();