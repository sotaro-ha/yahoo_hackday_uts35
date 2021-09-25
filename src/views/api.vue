<template>
  <body>

    <div id="app">
    </div>

   
</body>

</template>
 <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.js"></script>
    <script>
        new Vue(
            el: '#app',
            data() {
                return {
                    //APIデータを受け取る配列を定義
                    prefectures: null,
                }
            },
            mounted() {
                   var prefectures_url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';
                axios
                .get(prefectures_url, { headers: { 'X-API-KEY': '各自で取得したKEY' } })
                .then(response => (this.prefectures = response));
            
        )}
    </script>