<template>
  <div class="app">
   <header>
     <div class="header_container">
        <div class="header_logo"><img class="logo_img" src="../assets/logo.png" width="50px"/></div>
        <button class="my_page">My Page</button>
     </div>
   </header>
   <div class="content_container">
   <div class="content_panel"><div class="shop_image"></div><div class="shop_text"><p class="shop_title">コンビニ</p></div></div>
   <div class="content_panel"><div class="shop_image"></div><div class="shop_text"></div></div>
   <div class="content_panel"><div class="shop_image"></div><div class="shop_text"></div></div>
   <div class="content_panel"><div class="shop_image"></div><div class="shop_text"></div></div>
   <div class="content_panel"><div class="shop_image"></div><div class="shop_text"></div></div>
   <div class="content_panel"><div class="shop_image"></div><div class="shop_text"></div></div>
   <div class="content_panel"><div class="shop_image"></div><div class="shop_text"></div></div>
   <div class="content_panel"><div class="shop_image"></div><div class="shop_text"></div></div>
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
}
.content_panel:hover{
  filter:drop-shadow(0px 0px 5px rgba(0,0,0,0.5));
  transition: all .1s ease-in;
}
.shop_image{
  background-color:white;
  background-image:url("../assets/onigiri_maru.png");
  background-size:contain;
  background-repeat: no-repeat;
  width:200px;
  height:200px;
  filter:drop-shadow(0px 3px 3px rgba(0,0,0,0.2));
}
.shop_text{
  height:100px;
  background-color:orange;
  border-radius: 0 0 10px 10px; 
}
.shop_title{
  font-size:18px;
  text-align:left;
  font-weight:700;
  margin-left:16px;
}

</style>
