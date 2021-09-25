<template>
  <div class="app">
   <header>
     <div class="header_container">
       <router-link to="/"> <div class="header_logo"><img class="logo_img" src="../assets/logo.png" width="50px"/></div></router-link>
        <button class="my_page">My Page</button>
     </div>
   </header>
   <div class="content_container">
  <router-link to ="/shops/1"><div class="content_panel "><div class="shop_image img1"></div><div class="shop_text"><p class="shop_title">おにぎり</p><p class="shop_price">70円</p><p class="shop_percent">40%引き！</p></div></div></router-link>
   <router-link to ="/shops/2"><div class="content_panel"><div class="shop_image img2"></div><div class="shop_text"><p class="shop_title">お弁当</p><p class="shop_price">300円</p><p class="shop_percent">30%引き！</p></div></div></router-link>
   <router-link to ="/shops/3"><div class="content_panel"><div class="shop_image img3"></div><div class="shop_text"><p class="shop_title">煮物</p><p class="shop_price">300円</p><p class="shop_percent">40%引き！</p></div></div></router-link>
  <router-link to ="/shops/4"> <div class="content_panel"><div class="shop_image img4"></div><div class="shop_text"><p class="shop_title">ハンバーガー</p><p class="shop_price">200円</p><p class="shop_percent">40%引き！</p></div></div></router-link>
  <router-link to ="/shops/5"> <div class="content_panel"><div class="shop_image img5"></div><div class="shop_text"><p class="shop_title">唐揚げくん</p><p class="shop_price">150円</p><p class="shop_percent">20%引き！</p></div></div></router-link>
  <router-link to ="/shops/6"> <div class="content_panel"><div class="shop_image img6"></div><div class="shop_text"><p class="shop_title">お弁当</p><p class="shop_price">300円</p><p class="shop_percent">40%引き！</p></div></div></router-link>
  <router-link to ="/shops/7"> <div class="content_panel"><div class="shop_image img7"></div><div class="shop_text"><p class="shop_title">日の丸弁当</p><p class="shop_price">300円</p><p class="shop_percent">10%引き！</p></div></div></router-link>
  <router-link to ="/shops/8"> <div class="content_panel"><div class="shop_image img8"></div><div class="shop_text"><p class="shop_title">野菜カレー</p><p class="shop_price">400円</p><p class="shop_percent">40%引き！</p></div></div></router-link>
   </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app{
  transition: all 1s ease-in;
}
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
.content_container{
  display:flex;
  justify-content: center;
  align-items: center;
  flex-wrap:wrap;
  padding:10px;
}
.content_panel{
  width:200px;
  height:300px;
  background-color:white;
  margin-bottom:16px;
  margin-right:16px;
  border-radius: 0 0 10px 10px; 
filter:drop-shadow(0px 0px 3px rgba(0,0,0,0.3));
cursor:pointer;
}
.content_panel:hover{
  filter:drop-shadow(0px 0px 5px rgba(0,0,0,0.5));
  transition: all .1s ease-in;
}
.shop_image{
  background-color:white;
  background-size:contain;
  background-repeat: no-repeat;
  width:200px;
  height:200px;
  filter:drop-shadow(0px 3px 3px rgba(0,0,0,0.2));
}
.shop_text{
  height:100px;
  background-color:whitesmoke;
  border-radius: 0 0 10px 10px; 
}
.shop_title{
  font-size:18px;
  text-align:left;
  font-weight:700;
  margin-left:16px;
}
.shop_price{
  font-size:18px;
  text-align:left;
  font-weight:700;
  margin-left:18px;
}
.shop_percent{
  font-size:18px;
  text-align:right;
  font-weight:700;
  margin-left:16px;
  color:rgb(209, 0, 0);
}
a:visited{
  text-decoration: none;
}
.img1{
background-image:url("../assets/onigiri_maru.png")
}
.img2{
  background-image:url("../assets/food_obentou.png")
}
.img3{
  background-image:url("../assets/food_yasai_nimono.png")
}
.img4{
  background-image:url("../assets/hamburger_meat_sauce.png")
}
.img5{
  background-image:url("../assets/karaagekun.png")
}
.img6{
  background-image:url("../assets/obentou_hamburg.png")
}
.img7{
  background-image:url("../assets/obentou_hinomaru.png")
}
.img8{
  background-image:url("../assets/vegetable_curry.png")
}

</style>
