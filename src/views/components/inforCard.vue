<style lang="less">
.infor-card-icon-con{ 
    height: 20%;
}
.height-100{
    height: 100%;
}
.infor-card-con{
    height: 100px;
}
.infor-intro-text{
    font-size:12px;
    font-weight:500;
    color:#C8C8C8;
}
</style>

<template>
    <Card :padding="0" >
        <div class="infor-card-con">
            <Row span="16" class="height-100">
                <Row type="flex" align="middle" justify="center" class="height-100"><div>
                <p :style="{textAlign: 'center', color: '#f25e43', fontSize: '30px', fontWeight: 700}"
                    class="infor-card-count user-created-count">
                    <span>{{ endVal }}</span>
                    <p class="infor-intro-text" slot="intro">{{ introText }}</p>
                </p>
                </div>
                </Row>
            </Row>
			<Row class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}">
            </Row>
        </div>
    </Card>
</template>

<script>

export default {
    name: 'inforCard',
    props: {
        idName: String,
        endVal: {type:Number, default: 0},
        color: String,
        iconType: String,
        introText: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        iconSize: {
            type: Number,
            default: 40
        }
    },
    watch: {
        endVal(n,o){
            this.endVal = n;
        }
    },
};
</script>

