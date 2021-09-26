<template>
  <div >
    <header>
     <div class="header_container">
        <router-link to="/"><div class="header_logo"><img class="logo_img" src="../assets/logo.png" width="50px"/></div></router-link >
        <button class="my_page">My Page</button>
     </div>
   </header>
   <div class="page_background">
       <h2>ご購入ありがとうございました</h2>
   </div>
   <p>ドライバーの現在地(イメージ)</p>
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8951196043663!2d139.73470871499651!3d35.679584380194655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b7897bf41df%3A0x7b4b471810cbba59!2z44Ok44OV44O844ixIEdOQk5FVOmWi-eZuumBi-WWtuODgeODvOODoA!5e0!3m2!1sja!2sjp!4v1632621501371!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    <p>あと△分で到着します</p>
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
h2{
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