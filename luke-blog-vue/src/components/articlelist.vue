<!-- 文章列表 -->
<template>
    <el-row class="sharelistBox">

        <el-col :span="24" class="s-item tcommonBox" v-for="(item,index) in articleList" :key="'article'+index">
            <span class="s-round-date">
                <span class="month" v-html="showInitDate(item.createTime,'month')+'月'"></span>
                <span class="day" v-html="showInitDate(item.createTime,'date')"></span>
            </span>
            <header>
                <h1>
                    <a :href="'#/DetailArticle?aid='+item.id" target="_blank">
                        {{item.title}}
                    </a>
                </h1>
                <h2>
                    <i class="fa fa-fw fa-user"></i>发表于
                    <i class="fa fa-fw fa-clock-o"></i><span v-html="showInitDate(item.createTime,'all')">{{showInitDate(item.createTime,'all')}}</span> •
                    <i class="fa fa-fw fa-eye"></i>{{item.viewCount}} 次围观 •

                </h2>
                <div class="ui label">
                    <a :href="'#/Share?classId='+item.class_id">{{item.categoryName}}</a>
                </div>
            </header>
            <div class="article-content">
                <p style="text-indent:2em;">
                    {{item.summary}}
                </p>
                <p  style="max-height:300px;overflow:hidden;text-align:center;">
                    <img :src="item.thumbnail" alt="" class="maxW">
                </p>
            </div>
            <div class="viewdetail">
                <a class="tcolors-bg" :href="'#/DetailArticle?aid='+item.id" target="_blank">
                    阅读全文>>
                </a>
            </div>

        </el-col>
         <el-col class="viewmore">
            <a v-show="hasMore" class="tcolors-bg" href="javascript:void(0);" @click="addMoreFun">点击加载更多</a>
            <a v-show="!hasMore" class="tcolors-bg" href="javascript:void(0);">暂无更多数据</a>
        </el-col>
    </el-row>
</template>

<script>
import {initDate} from '../utils/server.js'
import {articleList, searchArticles} from '../api/article' 
    export default {
        name:'Share',
        data() { //选项 / 数据
            return {
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    categoryId: 0
                },
                articleList:[],
                hasMore:true
            }
        },

        methods: { //事件处理器
            showInitDate: function(oldDate,full){
                return initDate(oldDate,full)
            },
            getList(){
                const keywords = this.$route.query.keywords;
                const categoryId = this.$route.query.classId;
                

                // 更新查询参数
                this.queryParams.categoryId = categoryId ? parseInt(categoryId) : 0;

                // 根据是否有关键词决定使用哪个接口
                const request = keywords ? 
                    searchArticles(keywords, this.queryParams.pageNum, this.queryParams.pageSize) :
                    articleList(this.queryParams);

                request.then((response) => {
                    if(this.queryParams.pageNum === 1) {
                        // 第一页直接替换数据
                        this.articleList = response.rows;
                    } else {
                        // 加载更多时拼接数据
                        this.articleList = this.articleList.concat(response.rows);
                    }
                    
                    // 判断是否还有更多数据
                    this.hasMore = response.total > this.articleList.length;
                    if(this.hasMore) {
                        this.queryParams.pageNum++; // 页码加1
                    }
                })
            },
            showSearchShowList:function(initData){//展示数据
                if(initData) {
                    // 重置页码和列表
                    this.queryParams.pageNum = 1;
                    this.articleList = [];
                }
                this.getList();
            },
            addMoreFun:function(){//查看更多
                this.showSearchShowList(false);
            },
            routeChange:function(){
                // var that = this;
                // this.queryParams.categoryId = (that.$route.query.classId==undefined?0:parseInt(that.$route.query.classId));//获取传参的classId
                // this.showSearchShowList(true);
                this.queryParams.pageNum = 1;
                this.articleList = [];
                this.showSearchShowList(true);
            }
        },
        components: { //定义组件

        },
        watch: {
           // 如果路由有变化，会再次执行该方法
        //    '$route':'routeChange',
        //    '$store.state.keywords':'routeChange'
            '$route'(to, from) {
            // 当搜索关键词或分类ID变化时重新加载
            if(to.query.keywords !== from.query.keywords || 
               to.query.classId !== from.query.classId) {
                this.routeChange();
            }
        }
         },
        created() { //生命周期函数
            // console.log(this.$route);

            this.routeChange();
        }
    }
</script>

<style>
/*分享标题*/
.shareTitle{
    margin-bottom: 40px;
    position: relative;
    border-radius: 5px;
    background: #fff;
    padding:15px;
}
.shareclassTwo{
    width:100%;
}
.shareclassTwo li{
    display: inline-block;
}
.shareclassTwo li a{
    display: inline-block;
    padding:3px 7px;
    margin:5px 10px;
    color:#fff;
    border-radius: 4px;
    background: #64609E;
    border: 1px solid #64609E;
    transition: transform 0.2s linear;
    -webkit-transition: transform 0.2s linear;
}
.shareclassTwo li a:hover{
    transform: translate(0,-3px);
    -webkit-transform: translate(0,-3px);
}
.shareclassTwo li a.active{
    background: #fff;
    color:#64609E;

}
/*文章列表*/
    .sharelistBox{
        transition: all 0.5s ease-out;
        font-size: 15px;
    }


    /*.sharelistBox .viewmore a:hover,.s-item .viewdetail a:hover{
        background: #48456C;
    }*/
</style>
