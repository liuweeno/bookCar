<template>
  <div class="container">
    <ul>
      <li class="prebt" :class="{ unclick: paginationState.currentPage == 1 }" @click="pre_page">
        <a>&lt;上一页</a>
      </li>
      <li v-show="paginationState.page1Show" @click="page_jump(1)">
        <a>1</a>
      </li>
      <li class="omit" v-show="paginationState.preOmitShow">...</li>

      <span v-if="paginationState.prePageRange">
        <li
          v-for="i in paginationState.prePageRange"
          @click="page_jump(paginationState.startPage + i - 1)"
          :key="i + 'q'"
        >
          <a>{{ paginationState.startPage + i - 1 }}</a>
        </li>
      </span>
      <li class="active">
        <a>{{ paginationState.currentPage }}</a>
      </li>
      <span v-if="paginationState.nextPageRange">
        <li
          v-for="i in paginationState.nextPageRange"
          @click="page_jump(paginationState.currentPage + i)"
          :key="i + 'l'"
        >
          <a>{{ paginationState.currentPage + i }}</a>
        </li>
      </span>

      <li class="omit" v-show="paginationState.nextOmitShow">...</li>
      <li v-show="paginationState.lastPageShow" @click="page_jump(paginationState.totalPage)">
        <a>{{ paginationState.totalPage }}</a>
      </li>
      <li
        class="nextbt"
        :class="{ unclick: paginationState.currentPage == paginationState.totalPage }"
        @click="next_page"
      >
        <a>下一页&gt;</a>
      </li>
    </ul>
    <div class="skipdiv">
      <span
        >共{{ paginationState.totalPage }}页,到第<input
          type="number"
          value="2"
          min="1"
          :max="paginationState.totalPage"
          ref="page_input"
        />页</span
      >
      <a @click="page_jump(parseInt($refs.page_input.value))">确定</a>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';

const paginationState = reactive({
  currentPage: 2,
  page1Show: false,
  lastPageShow: true,
  preOmitShow: false,
  nextOmitShow: true,
  startPage: 1,
  endPage: 5,
  prePageRange: 1,
  nextPageRange: 1,
  totalPage: 9,
  continues: 5,
});

let change_page = () => {};

const uppage = () => {
  let half = Math.trunc(paginationState.continues / 2);

  if (paginationState.currentPage + half > paginationState.totalPage)
    paginationState.endPage = paginationState.totalPage;
  else paginationState.endPage = paginationState.currentPage + half;
  if (paginationState.endPage - half * 2 < 1) paginationState.startPage = 1;
  else paginationState.startPage = paginationState.endPage - half * 2;

  if (paginationState.startPage > 1) paginationState.page1Show = true;
  else paginationState.page1Show = false;
  if (paginationState.startPage > 2) paginationState.preOmitShow = true;
  else paginationState.preOmitShow = false;

  if (paginationState.endPage < paginationState.totalPage) paginationState.lastPageShow = true;
  else paginationState.lastPageShow = false;
  if (paginationState.endPage < paginationState.totalPage - 1) paginationState.nextOmitShow = true;
  else paginationState.nextOmitShow = false;

  paginationState.prePageRange = paginationState.currentPage - paginationState.startPage;
  paginationState.nextPageRange = paginationState.endPage - paginationState.currentPage;
};

const pre_page = () => {
  if (paginationState.currentPage != 1) {
    paginationState.currentPage -= 1;
    uppage();
    change_page(paginationState.currentPage);
  }
};

const next_page = () => {
  if (paginationState.currentPage != paginationState.totalPage) {
    paginationState.currentPage += 1;
    uppage();
    change_page(paginationState.currentPage);
  }
};

const page_jump = (index) => {
  paginationState.currentPage = index;
  uppage();
  change_page(paginationState.currentPage);
};

watch(
  () => paginationState.currentPage,
  () => {
    uppage();
  },
);

onMounted(() => {
  paginationState.currentPage = paginationState.currentPage;
  uppage();
});
</script>

<style scoped lang="less">
.container {
  display: inline-block;
  padding: 10px;
}
.container ul {
  padding: 0;
  display: inline-block;
  list-style-type: none;
  font-size: 0;
}

.container ul li {
  display: inline-block;
  border: 1px solid rgb(219, 219, 219);
  font-size: 14px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
.container ul li:hover {
  border: 1px solid @theme-main-color1;
}
.container ul li.active {
  background-color: @theme-main-color1;
  color: white;
}
.container ul li.prebt {
  width: 80px;
  margin-right: 10px;
}
.container ul li.nextbt {
  width: 80px;
  margin-left: 10px;
}
.container ul li.unclick {
  border: 1px solid rgb(219, 219, 219);
  color: rgb(159, 159, 159);
}
.container ul li.omit {
  width: 20px;
  border: 0;
}
.container ul li a {
  vertical-align: middle;
}

.container .skipdiv {
  display: inline-block;
  margin-left: 10px;
  height: 40px;
  font-size: 14px;
}
.container .skipdiv span {
  color: grey;
}
.container .skipdiv span input {
  width: 35px;
  color: grey;
  border: 1px solid rgb(212, 212, 212);
}
.container .skipdiv a {
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid rgb(212, 212, 212);
  cursor: pointer;
}
.container .skipdiv a:hover {
  border: 1px solid @theme-main-color1;
  color: @theme-main-color1;
}
</style>
