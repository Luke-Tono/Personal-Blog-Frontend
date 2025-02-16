<template>
  <div class="">
    <div class="headBack">
      <el-row class="container">
        <el-col :span="24">
          <!-- pc端导航 -->
          <div class="headBox">
            <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
              :router="true"
            >
              <el-menu-item index="/Home"><i class="fa fa-wa fa-home"></i> 首页</el-menu-item>
              <el-submenu index="/Share">
                <template slot="title"><i class="fa fa-wa fa-archive"></i> 分类</template>
                <el-menu-item
                  v-for="(item, index) in classListObj"
                  :key="'class1' + index"
                  :index="'/Share?classId=' + item.id"
                >{{ item.name }}</el-menu-item>
              </el-submenu>
              <el-menu-item index="/Friendslink"><i class="fa fa-wa fa-users"></i>友链</el-menu-item>

								<!-- 🔥 搜索框嵌入导航栏 -->
							<div class="search-box">
								<el-input
									v-model="searchQuery"
									placeholder="搜索文章..."
									prefix-icon="el-icon-search"
									class="search-input"
									@keyup.enter="handleEnter"
								/>
								<!-- 搜索按钮 -->
								<el-menu-item index="search" class="search-icon" @click="searchArticles">
									<i class="fa fa-search"></i>
								</el-menu-item>
								<!-- <el-button type="primary" icon="el-icon-search" @click="searchArticles"></el-button> -->
							</div>
							




              <div class="userInfo">
                <div v-show="!haslogin" class="nologin">
                  <a href="javascript:void(0);" @click="logoinFun(1)">登录&nbsp;</a>|<a href="javascript:void(0);" @click="logoinFun(0)">&nbsp;注册</a>
                </div>
                <div v-show="haslogin" class="haslogin">
                  <i class="fa fa-fw fa-user-circle userImg"></i>
                  <ul class="haslogin-info">
                    <li><a href="#/UserInfo">个人中心</a></li>
                    <li><a href="javascript:void(0);" @click="userlogout">退出登录</a></li>
                  </ul>
                </div>
              </div>
            </el-menu>
          </div>
        </el-col>
      </el-row>
    </div>

    <div
      class="headImgBox"
      :style="{ backgroundImage: `url(${this.$store.state.themeObj.top_image || 'img/background.jpg'})` }"
    >
      <div class="scene">
        <div><span id="luke"></span></div>
      </div>
      <div class="h-information">
        <img :src="'static/img/header11.png'" alt="" />
        <h2 class="h-description">
          {{ this.$store.state.themeObj.autograph ? this.$store.state.themeObj.autograph : "sansansansan，正是男儿读书时" }}
        </h2>
      </div>
    </div>
  </div>
</template>


<script>
import {logout} from '../api/user'
import {removeToken} from '../utils/auth'
import {getCategoryList} from '../api/category'
import {
	Typeit
} from '../utils/plug.js'
export default {
	data() { //选项 / 数据
		return {
			userInfo: '', //用户信息
			haslogin: false, //是否已登录
			classListObj: '', //分类
			activeIndex: '/', //当前选择的路由模块
			state: '', //icon点击状态
			pMenu: true, //手机端菜单打开
			// path:'',//当前打开页面的路径
			input: '', //input输入内容
			headBg: 'url(static/img/headbg05.jpg)', //头部背景图
			headTou: '', //头像
			projectList: '', //项目列表
			searchQuery: "", // 存储搜索关键词
      showSearch: false, // 控制搜索框是否显示
		}
	},
	watch: {

	},
	methods: { //事件处理器

		searchArticles() {
    if (!this.searchQuery.trim()) {
      this.$message.warning("请输入搜索内容");
      return;
    }

    // 路由跳转到文章列表页并携带搜索参数
    this.$router.replace({
      path: "/Share",
      query: { 
        keywords: this.searchQuery.trim(),
        pageNum: 1,
        pageSize: 10,
        _t: Date.now() // 添加时间戳防止路由复用
      }
    });
  },
	  handleEnter() {
			this.searchArticles();
		},
		// 切换搜索框的显示和隐藏
    toggleSearch() {
      this.showSearch = !this.showSearch;
    },
    // 执行搜索
    // searchArticles() {
    //   if (!this.searchQuery.trim()) {
    //     this.$message.warning("请输入搜索内容");
    //     return;
    //   }
    //   this.$store.state.keywords = this.searchQuery;
    //   this.$router.push({ path: "/Share" });
    //   this.showSearch = false; // 搜索后隐藏搜索框
    // },
		handleOpen(key, keyPath) { //分组菜单打开
			// console.log(key, keyPath);
		},
		handleClose(key, keyPath) { //分组菜单关闭
			// console.log(key, keyPath);
		},
		searchChangeFun(e) { //input change 事件
			// console.log(e)
			if (this.input == '') {
				this.$store.state.keywords = '';
				this.$router.push({path:'/'});
			}
		},
		getCategoryList(){
			getCategoryList().then((response)=>{
				this.classListObj = response
			})
		},
		handleSelect(key, keyPath) { //pc菜单选择
			//    console.log(key, keyPath);
		},
		logoinFun: function(msg) { //用户登录和注册跳转
			// console.log(msg);
			localStorage.setItem('logUrl', this.$route.fullPath);
			// console.log(666,this.$router.currentRoute.fullPath);
			if (msg == 0) {
				this.$router.push({
					path: '/Login?login=0'
				});
			} else {
				this.$router.push({
					path: '/Login?login=1'
				});
			}
		},
		// 用户退出登录
		userlogout: function() {
			var that = this;
			this.$confirm('是否确认退出?', '退出提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// console.log(that.$route.path);

				logout().then((response)=>{
					removeToken()
					localStorage.removeItem('userInfo');
					that.haslogin = false;
					window.location.reload();
						that.$message({
							type: 'success',
							message: '退出成功!'
						});
					if (that.$route.path == '/UserInfo') {
						that.$router.push({
							path: '/'
						});
					}
				})
			}).catch(() => {
				//
			});

		},
		routeChange: function() {
			var that = this;
			that.pMenu = true
			this.activeIndex = this.$route.path == '/' ? '/Home' : this.$route.path;
			if (localStorage.getItem('userInfo')) { //存储用户信息
				that.haslogin = true;
				that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
				// console.log(that.userInfo);
			} else {
				that.haslogin = false;
			}
			//获取分类
			if (!this.$route.query.isSearch) {
				this.getCategoryList();
			}

			if ((this.$route.name == "Share" || this.$route.name == "Home") && this.$store.state.keywords) {
				this.input = this.$store.state.keywords;
			} else {
				this.input = '';
				this.$store.state.keywords = '';
			}
		}
	},
	components: { //定义组件

	},
	watch: {
		// 如果路由有变化，会再次执行该方法
		'$route': 'routeChange'
	},
	created() { //生命周期函数
		//判断当前页面是否被隐藏
		var that = this;
		var hiddenProperty = 'hidden' in document ? 'hidden' :
			'webkitHidden' in document ? 'webkitHidden' :
			'mozHidden' in document ? 'mozHidden' :
			null;
		var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
		var onVisibilityChange = function() {
			if (!document[hiddenProperty]) { //被隐藏
				if (that.$route.path != '/DetailShare') {
					if (localStorage.getItem('userInfo')) {
						that.haslogin = true;
					} else {
						that.haslogin = false;
					}
				}
			}
		}
		document.addEventListener(visibilityChangeEvent, onVisibilityChange);
		// console.log();
		this.routeChange();


	},
	mounted() { //页面元素加载完成
		var that = this;
		var timer = setTimeout(function() {
			Typeit(that.$store.state.themeObj.user_start, "#luke"); //打字机效果
			clearTimeout(timer);
		}, 500);
	}
}
</script>

<style>
/*********头部导航栏********/

/*头部导航栏盒子*/

.headBack {
	width: 100%;
	background: rgba(40, 42, 44, 0.6);
	/*margin-bottom:30px;*/
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	z-index: 100;
	height: 60px; /* 增大导航栏高度 */
  line-height: 60px; /* 让内容垂直居中 */
}

.headBox li.is-active {
	/*background: #48456C;*/
	background: rgba(73, 69, 107, 0.7);
}

.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
	
	border-bottom: none!important;
}

.headBox .el-menu {

	background: transparent;
	border-bottom: none!important;
	
}

.headBox .el-menu-demo li.el-menu-item,
.headBox .el-menu--horizontal .el-submenu .el-submenu__title {

	border-bottom: none!important;
	height: 60px;
  line-height: 60px;

}

.headBox .el-submenu li.el-menu-item {
	height: 38px;
	line-height: 38px;
}

.headBox li .fa-wa {
	vertical-align: baseline;
}

.headBox ul li.el-menu-item,
.headBox ul li.el-menu-item.is-active,
.headBox ul li.el-menu-item:hover,
.headBox .el-submenu div.el-submenu__title,
.headBox .el-submenu__title i.el-submenu__icon-arrow {
	font-size: 20px; /* 增大图标 */
  margin-right: 5px; /* 图标和文字之间的间距 */
	color: #fff;
	height: 60px !important;  /* 设置更高的行高 */
  line-height: 60px !important;
}

.headBox .el-menu--horizontal .el-submenu>.el-menu {
	top: 38px;
	border: none;
	padding: 0;
	
}

.headBox>ul li.el-menu-item:hover,
.headBox>ul li.el-submenu:hover .el-submenu__title {
	background: #48456C;
	border-bottom: none;
}

.headBox>ul .el-submenu .el-menu,
.headBox>ul .el-submenu .el-menu .el-menu-item {
	
	background: #48456C;
}

.headBox>ul .el-submenu .el-menu .el-menu-item {
	min-width: 0;
}

.headBox>ul .el-submenu .el-menu .el-menu-item:hover {
	background: #64609E;
	
}

/*pc搜索框*/

.headBox .pcsearchbox {
	padding: 0;
	max-width: 170px;
	/*min-width: 30px;*/
	height: 100%;
	line-height: 38px;
	position: absolute;
	top: 0;
	right: 0;
	cursor: pointer;
}

.headBox .pcsearchbox:hover .pcsearchinput {
	opacity: 1;
	/*transform: scaleX(1);*/
	visibility: visible;
}

.headBox .pcsearchbox i.pcsearchicon {
	color: #fff;
	padding-left: 10px;
}

.headBox .pcsearchbox .pcsearchinput {
	width: 180px;
	padding: 10px 20px 10px 20px;
	background: rgba(40, 42, 44, 0.6);
	border-radius: 0 0 2px 2px;
	position: absolute;
	right: 0;
	top: 38px;
	opacity: 0;
	visibility: hidden;
	/*transform: scaleX(0);*/
	transform-origin: right;
	transition: all 0.3s ease-out;
}

.headBox .pcsearchbox .hasSearched {
	opacity: 1;
	/*transform: scaleX(1);*/
	visibility: visible;
}

.headBox .pcsearchbox .el-input {
	width: 100%;
}

.headBox .el-input__inner {
	height: 30px;
	border: none;
	background: #fff;
	/*border: 1px solid #333;*/
	border-radius: 2px;
	padding-right: 10px;
}

.headBox .userInfo {
	height: 100%;
	line-height: 38px;
	position: absolute;
	right: 30px;
	top: 0;
	color: #fff;
}

.headBox .userInfo a {
	color: #fff;
	font-size: 13px;
	transition: all 0.2s ease-out;
}

.headBox .userInfo a:hover {
	color: #48456C;
}

.headBox .nologin {
	text-align: right;
}

.headBox .haslogin {
	text-align: right;
	position: relative;
	min-width: 80px;
	cursor: pointer;
}

.headBox .haslogin:hover ul {
	visibility: visible;
	opacity: 1;
}

.headBox .haslogin ul {
	background: rgba(40, 42, 44, 0.6);
	padding: 5px 10px;
	position: absolute;
	right: 0;
	visibility: hidden;
	opacity: 0;
	transition: all 0.3s ease-out;
}

.headBox .haslogin ul li {
	border-bottom: 1px solid #48456C;
}

.headBox .haslogin ul li:last-child {
	border-bottom: 1px solid transparent;
}

/*******移动端*******/

.mobileBox {
	position: relative;
	height: 38px;
	line-height: 38px;
	color: #fff;
}

.hideMenu {
	position: relative;
	width: 100%;
	height: 100%;
	line-height: 38px;
}

.hideMenu ul.mlistmenu {
	width: 100%;
	position: absolute;
	left: 0;
	top: 100%;
	box-sizing: border-box;
	z-index: 999;
	box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12), 0 0 8px 0 rgba(0, 0, 0, .04);
	background: #48456C;
	color: #fff;
	border-right: none;
}

.hideMenu .el-submenu .el-menu {
	background: #64609E;
}

.hideMenu .el-menu-item,
.hideMenu .el-submenu__title {
	color: #fff;
}

.hideMenu>i {
	position: absolute;
	left: 10px;
	top: 12px;
	width: 30px;
	height: 30px;
	font-size: 16px;
	color: #fff;
	cursor: pointer;
}

.hideMenu .el-menu-item,
.el-submenu__title {
	height: 40px;
	line-height: 40px;
}

.mobileBox .searchBox {
	padding-left: 40px;
	width: 100%;
	box-sizing: border-box;
}

.mobileBox .searchBox .el-input__inner {
	display: block;
	border-radius: 2px;
	border: none;
	height: 25px;
}

.hideMenu ul.mlistmenu.pshow {
	display: block;
}

.hideMenu ul.mlistmenu .el-submenu__icon-arrow,
.mobileBox li.el-menu-item a {
	color: #fff;
}

.hideMenu>ul li.el-menu-item:hover,
.hideMenu>ul li.el-menu-item.is-active {
	
	background: #48576a;
}



/*头部背景图*/

.headImgBox {
	height: 650px;
	position: relative;
	width: 100%;
	background-size: cover;
	background-position: center 50%;
	background-repeat: no-repeat;
	margin-bottom: 90px;
}

.h-information {
	text-align: center;
	width: 70%;
	margin: auto;
	position: relative;
	top: 480px;
	padding: 40px 0;
	font-size: 16px;
	opacity: 0.98;
	background: rgba(230, 244, 249, 0.8);
	border-radius: 5px;
	z-index: 1;
	animation: b 1s ease-out;
	-webkit-animation: b 1s ease-out;
}

@-webkit-keyframes b {
	0% {
		-webkit-transform: translateY(90px);
		transform: translateY(90px);
	}
	80% {
		-webkit-transform: translateY(5px);
		transform: translateY(5px)
	}
	90% {
		-webkit-transform: translateY(-5px);
		transform: translateY(-5px)
	}
	to {
		-webkit-transform: translateY(0);
		transform: translateY(0)
	}
}

@keyframes b {
	0% {
		-webkit-transform: translateY(90px);
		transform: translateY(90px);
	}
	80% {
		-webkit-transform: translateY(5px);
		transform: translateY(5px)
	}
	90% {
		-webkit-transform: translateY(-5px);
		transform: translateY(-5px)
	}
	to {
		-webkit-transform: translateY(0);
		transform: translateY(0)
	}
}

.h-information img {
	width: 100px;
	height: 100px;
	border-radius: 100%;
	transition: all .4s ease-in-out;
	-webkit-transition: all .4s ease-in-out;
	object-fit: cover;
}

/* .h-information img:hover {
	transform: rotate(360deg);
	-webkit-transform: rotate(360deg);
} */

.h-information h2 {
	margin-top: 20px;
	font-size: 18px;
	font-weight: 700;
	/*font-family: 'Sigmar One';*/
}
.h-information h2  a{
	background: linear-gradient(to right, #DF2050, #48456D);
	-webkit-background-clip: text;
	color: transparent;
}
.headImgBox .scene {
	width: 100%;
	/*height:300px;*/
	text-align: center;
	/* font-size: 100px; */
	font-size: 120px;
	font-weight: 200;
	color: #fff;
	position: absolute;
	left: 0;
	top: 160px;
	font-family: 'Sigmar One', Arial;
	text-shadow: 0 2px 2px #47456d;

}

.headImgBox .scene span {
	transform: matrix(1, 0, 0, 1, 0, 0);
	-webkit-transform: matrix(1, 0, 0, 1, 0, 0);
	text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
}

.saying:after {
	content: "|";
	font-family: Arial, sans-serif;
	font-size: 1em;
	/*line-height: 0;*/
	display: inline-block;
	vertical-align: baseline;
	opacity: 1;
	text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
	animation: caret 500ms infinite;
}

@keyframes caret {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
}

.userImg {
    font-size: 32px !important; /* 增大图标 */
    line-height: 60px !important; /* 让它和导航栏对齐 */
    vertical-align: middle;
    color: #fff; /* 保持白色 */
}


/* 设置整个用户菜单的宽度 */
.haslogin-info {
    background-color: #3D3B56 !important;
    border-radius: 8px;
    padding: 0px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 120px !important; /* 确保宽度匹配 */
}

/* 调整菜单项高度，使菜单整体变小 */
.haslogin-info li {
    font-size: 16px !important; /* 适当减少字体大小 */
    font-weight: bold !important;
    padding: 8px 0 !important;  /* 适当减少 padding */
    text-align: center !important;
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
}

/* 让超链接的高度更紧凑 */
.haslogin-info a {
    font-size: 16px !important; /* 适当减少字体 */
    color: white !important;
    text-decoration: none !important;
    width: 100% !important;
    display: block !important;
    padding: 8px 0 !important; /* 减少 padding 让高度变小 */
}

/* 鼠标悬停样式 */
.haslogin-info li:hover {
    background-color: #5A5788 !important; /* 悬停颜色 */
		border-radius: 8px;
}






/********* 头部导航栏 ********/

/* 头部导航栏盒子 */
.headBack {
    width: 100%;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加下阴影 */
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 100;
    height: 60px; /* 导航栏稍微加高 */
    line-height: 60px;
}

/* 导航栏菜单 */
.headBox .el-menu {
    background: transparent;
    border-bottom: none !important;
}

/* 一级菜单（首页、分类、友链） */
.headBox .el-menu-demo li.el-menu-item,
.headBox .el-menu--horizontal .el-submenu .el-submenu__title {
    border-bottom: none !important;
    height: 60px;
    line-height: 60px;
    font-size: 18px; /* 调整一级菜单的字体大小 */
    font-weight: bold;
    color: #fff;
    padding: 0 20px;
}

/* 鼠标悬停 一级菜单 */
.headBox .el-menu-demo li.el-menu-item:hover,
.headBox .el-menu--horizontal .el-submenu:hover .el-submenu__title {

    border-radius: 6px;
}

/* 二级菜单（Java 下拉） */
.headBox .el-menu--horizontal .el-submenu>.el-menu {
    position: absolute;
    top: 100%; /* 让下拉菜单正好出现在导航栏下方 */
    left: 0;

    border-radius: 8px;
    padding: 5px 0 5px 5px;
    min-width: 118px; /* 增加宽度 */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* 添加阴影，使菜单更立体 */
}

/* 下拉菜单的每一项 */
.headBox .el-submenu li.el-menu-item {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding: 0 20px;
    color: white;
    transition: background 0.3s ease-in-out;
}

/* 鼠标悬停 二级菜单 */
.headBox .el-submenu li.el-menu-item:hover {
		height: 20px;
    background: #5A5788; /* 改变背景色 */
    border-radius: 6px;
}

/* 选中的菜单项 */
.headBox .el-submenu li.el-menu-item.is-active {
    background: #6C64A0 !important;
    color: #fff !important;
    font-weight: bold;
}

/* 一级菜单项（分类）右侧的小三角调整 */
.el-submenu__title i.el-submenu__icon-arrow {
    font-size: 14px !important;
    margin-left: px;
    color: white;
}

/* 鼠标悬停 一级菜单项（分类）的小三角颜色变化 */
.headBox .el-menu--horizontal .el-submenu:hover .el-submenu__title i.el-submenu__icon-arrow {
    color: #ccc;
}



/* 让 `headBack` 作为 `search-box` 的参考点 */
.headBack {
  width: 100%;
  background: rgba(40, 42, 44, 0.6);
  position: relative;
  z-index: 100;
  height: 60px;
  line-height: 60px;
}

/* 让 `.search-box` 在导航栏内部 */
.search-box {
  display: flex;
  align-items: center;
  margin-left: auto; /* 让它自动靠右 */
  margin-right: 20px; /* 右边留点间距 */

}

/* 搜索输入框 */
.search-input {
	padding: 2px 10px 12px 20px;
	width: 260px; /* 宽度 */
  height: 50px; /* 高度 */
  font-size: 18px;
	
	
}

.search-input .el-input__inner {
  width: 260px; /* 适当增加宽度 */
  height: 55px; /* 🔥 加大高度 */
  font-size: 18px;
  border-radius: 30px; /* 🔥 增加圆角 */
  padding: 12px 45px 12px 20px; /* 右侧留空间给图标 */
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #ddd;
  transition: all 0.3s ease-in-out;

}

/* 搜索按钮样式 */
.search-box .el-button {
  height: 40px;
  padding: 5px 25px;
}

</style>
