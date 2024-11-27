<template>
  <div ref="container" id="container" class="container">
    <div class="row">
      <!-- SIGN UP -->
      <div class="col align-items-center flex-col sign-up">
        <div class="form-wrapper align-items-center">
          <div class="form sign-up">
            <div class="input-group">
              <i class="bx bx-mail-send"></i>
              <input type="email" v-model="email" placeholder="Email" />
            </div>
            <div class="input-group">
              <i class="bx bxs-lock-alt"></i>
              <input type="password" v-model="password" placeholder="Password" />
            </div>
            <div class="input-group">
              <i class="bx bxs-lock-alt"></i>
              <input type="password" v-model="confirmPassword" placeholder="Confirm Password" />
            </div>
            <div class="input-group checkbox-group">
              <label class="animated-checkbox">
                <input type="checkbox" v-model="agreeToTerms" />
                <span class="checkmark"></span>
                I agree to the terms and conditions
              </label>
            </div>
            <button @click="register">Sign up</button>
            <p>
              <span>Already have an account?</span>
              <b @click="toggle" class="pointer">Sign in here</b>
            </p>
          </div>
        </div>
      </div>

      <!-- SIGN IN -->
      <div class="col align-items-center flex-col sign-in">
        <div class="form-wrapper align-items-center">
          <div class="form sign-in">
            <div class="input-group">
              <i class="bx bx-mail-send"></i>
              <input type="email" v-model="loginEmail" placeholder="Email" />
            </div>
            <div class="input-group">
              <i class="bx bxs-lock-alt"></i>
              <input type="password" v-model="loginPassword" placeholder="Password" />
            </div>
            <div class="input-group checkbox-group">
              <label class="animated-checkbox">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                Remember me
              </label>
            </div>
            <div class="input-group checkbox-group">
              <label class="animated-checkbox">
                <input type="checkbox" v-model="autoLogin" />
                <span class="checkmark"></span>
                Auto login
              </label>
            </div>
            <button @click="login">Sign in</button>
            <p>
              <b>Forgot password?</b>
            </p>
            <p>
              <span>Don't have an account?</span>
              <b @click="toggle" class="pointer">Sign up here</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      loginEmail: '',
      loginPassword: '',
      rememberMe: false,
      autoLogin: false,
    };
  },
  methods: {
    toggle() {
      this.$refs.container.classList.toggle('sign-in');
      this.$refs.container.classList.toggle('sign-up');
    },
    register() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        alert('Please enter a valid email address');
        return;
      }

      if (this.email && this.password && this.confirmPassword && this.agreeToTerms) {
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        const user = {
          email: this.email,
          password: this.password,
        };
        localStorage.setItem(this.email, JSON.stringify(user));
        alert('Registration successful!');
        this.toggle();
      } else {
        alert('Please fill in all fields and agree to the terms');
      }
    },
    async login() {
      try {
        const storedUser = JSON.parse(localStorage.getItem(this.loginEmail));

        if (storedUser && this.loginPassword === storedUser.password) {
          alert('Login successful!');
          localStorage.setItem('currentUser', JSON.stringify(storedUser));

          // Remember Me 기능
          if (this.rememberMe) {
            localStorage.setItem('rememberedEmail', this.loginEmail);
          } else {
            localStorage.removeItem('rememberedEmail');
          }

          // Auto Login 기능
          if (this.autoLogin) {
            localStorage.setItem('autoLogin', true);
          } else {
            localStorage.removeItem('autoLogin');
          }

          this.$router.push({ path: '/' });
        } else {
          alert('Invalid email or password');
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
        alert('Error reading user data. Please try again.');
      }
    },
    handleLogout() {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('autoLogin');
      this.currentUser = null;
      alert('You have been logged out.');
      this.$router.push({ path: '/signin' });
    },
  },
  mounted() {
    if (localStorage.getItem('autoLogin')) {
      const autoLoginUser = localStorage.getItem('currentUser');
      if (autoLoginUser) {
        this.loginEmail = autoLoginUser;
        const storedUser = JSON.parse(localStorage.getItem(autoLoginUser));
        if (storedUser) {
          this.loginPassword = storedUser.password;
          this.login();
        }
      }
    } else {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        this.loginEmail = rememberedEmail;
        this.rememberMe = true;
      }
    }

    setTimeout(() => {
      this.$refs.container.classList.add('sign-in');
    }, 200);
  },
};
</script>

<style>
:root {
    --primary-color: #4EA685;
    --secondary-color: #57B894;
    --black: #000000;
    --white: #ffffff;
    --gray: #efefef;
    --gray-2: #757575;

    --facebook-color: #4267B2;
    --google-color: #DB4437;
    --twitter-color: #1DA1F2;
    --insta-color: #E1306C;
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap');

* {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.checkbox-group {
  display: flex;
  align-items: center;
}

.animated-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
}

.animated-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.animated-checkbox .checkmark {
  position: relative;
  height: 20px;
  width: 20px;
  background-color: #ccc;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;
  margin-right: 10px;
}

.animated-checkbox input:checked ~ .checkmark {
  background-color: #4ea685;
  transform: scale(1.1);
}

.animated-checkbox .checkmark::after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.animated-checkbox input:checked ~ .checkmark::after {
  display: block;
}

.animated-checkbox .checkmark:hover {
  background-color: #b0e3d0;
}

html,
body {
    margin: 0;
    padding: 0;
    height: auto;
    overflow-y: auto;
}

.container {
    position: relative;
    min-height: 100%;
    overflow: visible;
}

.row {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
}

.col {
    width: 50%;
}

.align-items-center {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.form-wrapper {
    width: 100%;
    max-width: 28rem;
}

.form {
    padding: 1rem;
    background-color: var(--white);
    border-radius: 1.5rem;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    transform: scale(0);
    transition: .5s ease-in-out;
    transition-delay: 1s;
}

.input-group {
    position: relative;
    width: 100%;
    margin: 1rem 0;
}

.input-group i {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    font-size: 1.4rem;
    color: var(--gray-2);
}

.input-group input {
    width: 100%;
    padding: 1rem 3rem;
    font-size: 1rem;
    background-color: var(--gray);
    border-radius: .5rem;
    border: 0.125rem solid var(--white);
    outline: none;
}

.input-group input:focus {
    border: 0.125rem solid var(--primary-color);
}

.form button {
    cursor: pointer;
    width: 100%;
    padding: .6rem 0;
    border-radius: .5rem;
    border: none;
    background-color: var(--primary-color);
    color: var(--white);
    font-size: 1.2rem;
    outline: none;
}

.form p {
    margin: 1rem 0;
    font-size: .7rem;
}

.flex-col {
    flex-direction: column;
}

.social-list {
    margin: 2rem 0;
    padding: 1rem;
    border-radius: 1.5rem;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    transform: scale(0);
    transition: .5s ease-in-out;
    transition-delay: 1.2s;
}

.social-list>div {
    color: var(--white);
    margin: 0 .5rem;
    padding: .7rem;
    cursor: pointer;
    border-radius: .5rem;
    transform: scale(0);
    transition: .5s ease-in-out;
}

.social-list>div:nth-child(1) {
    transition-delay: 1.4s;
}

.social-list>div:nth-child(2) {
    transition-delay: 1.6s;
}

.social-list>div:nth-child(3) {
    transition-delay: 1.8s;
}

.social-list>div:nth-child(4) {
    transition-delay: 2s;
}

.social-list>div>i {
    font-size: 1.5rem;
    transition: .4s ease-in-out;
}

.social-list>div:hover i {
    transform: scale(1.5);
}

.facebook-bg {
    background-color: var(--facebook-color);
}

.google-bg {
    background-color: var(--google-color);
}

.twitter-bg {
    background-color: var(--twitter-color);
}

.insta-bg {
    background-color: var(--insta-color);
}

.pointer {
    cursor: pointer;
}

.container.sign-in .form.sign-in,
.container.sign-in .social-list.sign-in,
.container.sign-in .social-list.sign-in>div,
.container.sign-up .form.sign-up,
.container.sign-up .social-list.sign-up,
.container.sign-up .social-list.sign-up>div {
    transform: scale(1);
}

.content-row {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 6;
    width: 100%;
}

.text {
    margin: 4rem;
    color: var(--white);
}

.text h2 {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 2rem 0;
    transition: 1s ease-in-out;
}

.text p {
    font-weight: 600;
    transition: 1s ease-in-out;
    transition-delay: .2s;
}

.img img {
    width: 30vw;
    transition: 1s ease-in-out;
    transition-delay: .4s;
}

.text.sign-in h2,
.text.sign-in p,
.img.sign-in img {
    transform: translateX(-250%);
}

.text.sign-up h2,
.text.sign-up p,
.img.sign-up img {
    transform: translateX(250%);
}

.container.sign-in .text.sign-in h2,
.container.sign-in .text.sign-in p,
.container.sign-in .img.sign-in img,
.container.sign-up .text.sign-up h2,
.container.sign-up .text.sign-up p,
.container.sign-up .img.sign-up img {
    transform: translateX(0);
}

.container::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100vh;
    width: 300vw;
    transform: translate(35%, 0);
    background-image: linear-gradient(-45deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    transition: 1s ease-in-out;
    z-index: 6;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-bottom-right-radius: max(50vw, 50vh);
    border-top-left-radius: max(50vw, 50vh);
}

.container.sign-in::before {
    transform: translate(0, 0);
    right: 50%;
}

.container.sign-up::before {
    transform: translate(100%, 0);
    right: 50%;
}

@media only screen and (max-width: 425px) {
    .container::before,
    .container.sign-in::before,
    .container.sign-up::before {
        height: 100vh;
        border-bottom-right-radius: 0;
        border-top-left-radius: 0;
        z-index: 0;
        transform: none;
        right: 0;
    }

    .container.sign-in .col.sign-in,
    .container.sign-up .col.sign-up {
        transform: translateY(0);
    }

    .content-row {
        align-items: flex-start !important;
    }

    .content-row .col {
        transform: translateY(0);
        background-color: unset;
    }

    .col {
        width: 100%;
        position: absolute;
        padding: 2rem;
        background-color: var(--white);
        border-top-left-radius: 2rem;
        border-top-right-radius: 2rem;
        transform: translateY(100%);
        transition: 1s ease-in-out;
    }

    .row {
        align-items: flex-end;
        justify-content: flex-end;
    }

    .form,
    .social-list {
        box-shadow: none;
        margin: 0;
        padding: 0;
    }

    .text {
        margin: 0;
    }

    .text p {
        display: none;
    }

    .text h2 {
        margin: .5rem;
        font-size: 2rem;
    }
}
</style>
