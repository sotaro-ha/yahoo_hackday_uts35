<template>
  <div >
    <header>
     <div class="header_container">
        <router-link to="/"><div class="header_logo"><img class="logo_img" src="../assets/logo.png" width="50px"/></div></router-link >
        <button class="my_page">My Page</button>
     </div>
   </header>
    <div class="main_background">
      <h2 class="title">煮物</h2>
      <p>この煮物は、○□△惣菜の煮物です！</p>
      <div class="img_box"><img src="../assets/food_yasai_nimono.png" alt=""></div>
      <div class="price_box">
      <p class="price">300円</p>
      <div class="percent">40%引き！</div>
      </div>
      <p>消費期限が本日中なので、急いで食べてもらえると嬉しいです</p>
    <button class="buy_button">購入はこちら</button>
    <router-link to="/"><p>ホームに戻る</p></router-link>
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
  filter:drop-shadow(0px 3px 3px rgba(0,0,0,0.3));
}
.header_container{
  max-width:1200px;
  display:flex;
  justify-content: space-between;
  align-items: center;
   padding:10px;
}
body{
  padding:10px;
}
.title{
  margin:16px;
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
.img_box{
  width:80%;
  margin:0 auto;
}
.price_box{
  display:flex;
  justify-content: center;
  font-size:20px;
  font-weight: 700;
}
.price{
  margin:10px;
  padding:10px;
}
.percent{
  background-color:chocolate;
  color:cornsilk;
  margin:10px;
  padding:10px;
}
.main_background{
  background-color:white;
}
.buy_button{
  width:80%;
  margin: 0 auto;
  margin:16px;
  padding:8px;
  font-weight:700;
  font-size:18px;
  border:none;
  border-radius:10px;
  background-color:chocolate;
  color:cornsilk;
  max-width: 600px;
  cursor:pointer;
}
.buy_button:hover{
  filter:drop-shadow(0px 0px 5px rgba(0,0,0,0.3));
}

</style>