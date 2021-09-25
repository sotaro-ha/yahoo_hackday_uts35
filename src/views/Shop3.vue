<template>
  <div >
    <h1>This page is user detail.</h1>
    <p  v-for="(name) in shops[$route.params.id - 1]"
          :key="name">{{name}}</p>
     <table>
        <th >
          ITEM
        </th>
        <th >
          VALUE
        </th>
        <!-- users のリストにアクセスする際、インデックスは 0 からなので受け取った id の値から `-1` する -->
        <tr
          v-for="(value, name) in shops[$route.params.id - 1]"
          :key="name">
          <td >
            {{ name }}
          </td>
          <td >
            {{ value }}
          </td>
        </tr>
      </table>
  </div>
</template>

<script>
export default {
  name: 'ShopDetail',
  data: function () {
    // 返却するオブジェクト users は本コンポーネントで表示するユーザ情報
    // 本来ならば DB 等で保持するのだが、今回は記事用のサンプルコードということでリストで持たせている
    return {
      shops: [
        {
          id: 1,
          name: 'hogehoge',
          live: 'Japan Tokyo',
          phone: 'NNN-XXXX-HHHH',
          gender: 'male',
          mail: 'hogehoge@mail.com'
        },
        {
          id: 2,
          name: 'barbar',
          live: 'Japan Kanagawa',
          phone: 'NNN-XXXX-BBBB',
          gender: 'male',
          mail: 'barbar@mail.com'
        },
        {
          id: 3,
          name: 'piypiyo',
          live: 'Japan Kanagawa',
          phone: 'NNN-XXXX-PPPP',
          gender: 'female',
          mail: 'piypiyo@mail.com'
        },
        {
          id: 4,
          name: 'fugafuga',
          live: 'Japan Chiba',
          phone: 'NNN-XXXX-FFFF',
          gender: 'male',
          mail: 'fugafuga@mail.com'
        },
        {
          id: 5,
          name: 'varvar',
          live: 'Japan Saitama',
          phone: 'NNN-XXXX-VVVV',
          gender: 'female',
          mail: 'varvar@mail.com'
        }
      ],
    }
  }
}
</script>
<style scoped>
    body{background-color:white}
</style>