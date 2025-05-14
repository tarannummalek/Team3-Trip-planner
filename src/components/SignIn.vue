<template>
  <div>
    <h2>Sign In</h2>
    <form @submit.prevent="signIn">
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="submit">Sign In</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    signIn() {
      console.log("Signing in:", this.email);
    }
  }
};
</script>
