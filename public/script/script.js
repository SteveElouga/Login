const input = document.getElementById('email');
const label = document.querySelector('label[for="email"]');

input.addEventListener('input', function () {
  if (input.value.trim() !== '') {
    label.classList.add('active');
  } else {
    label.classList.remove('active');
  }
});

const login = document.querySelector('.btnLogin-popup')
const wrapper = document.querySelector('.wrapper')

login.addEventListener('click', ()=>{
    if(wrapper.classList.contains('active')){
        wrapper.classList.remove('active')
    }else{
        wrapper.classList.add('active')
    }
})

const icon = document.querySelector('.icon-close')
icon.addEventListener('click', ()=>{
    
        wrapper.classList.remove('active')
})

const up = document.querySelector('.btnSignup-popup-sign')
const sign = document.querySelector('.wrapper-sign')

up.addEventListener('click', ()=>{
        if(sign.classList.contains('active')){
            sign.classList.remove('active')
        }else{
            sign.classList.add('active')
        }
})

