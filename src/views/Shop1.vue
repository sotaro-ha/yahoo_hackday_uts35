<template>
  <div >
    <header>
     <div class="header_container">
        <div class="header_logo"><img class="logo_img" src="../assets/logo.png" width="50px"/></div>
        <button class="my_page">My Page</button>
     </div>
   </header>
    <div class="main_background">
      <h2>おにぎり</h2>
      <p>このおにぎりは、○□△コンビニのご飯です！</p>
      <div class="img_box"><img src="../assets/onigiri_maru.png" alt=""></div>
      <div class="price_box">
      <p>70円</p>
      <div>40%引き！</div>
      </div>
    <button class="buy_button">購入はこちら</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Shop1'
}
</script>
<style scoped>
header{
  height :70px;
  background-color: rgb(255, 221, 110);
  width:100%;
}
.header_container{
  max-width:1200px;
  display:flex;
  justify-content: space-between;
  align-items: center;
   padding:10px;
}
.my_page{
  width:100px;
  height:40px;
  background:#ffffff;
  border-radius:25px;
  font-size:16px;
  border:none;
  cursor:pointer;
}
.my_page:hover{
  filter:drop-shadow(0px 0px 5px rgba(0,0,0,0.1));
  transition: all .1s ease-in;
}
</style>