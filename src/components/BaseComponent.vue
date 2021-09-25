<!--
BaseComponent : Component単位で共通の処理を記述
-->

<script lang="ts">
// Vue
import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';

// Store
import StoreModule from '@/store/index';

//@Component
@Mixin
export default class BaseComponent extends Vue {
  get store() {
    return StoreModule;
  }
  linkToOtherWindow(url: string) {
    window.open(url, '_blank');
  }
}
</script>
