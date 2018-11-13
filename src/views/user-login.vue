<style lang="less">
.login{
    width: 100%;
    height: 100%;
    background-image: url('../images/loginbd.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    &-con{
        margin:auto;
        position: absolute;
        left: 50%;
        top: 30%;
        transform: translate(-50%,-50%);
        width: 300px;
        &-header{
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            padding: 30px 0;
        }
        .form-con{
            padding: 10px 0 0;
        }
        .login-tip{
            font-size: 10px;
            text-align: center;
            color: #c3c3c3;
        }
    }
}

</style>

<template>
    <div class="login" keydown.enter="handleSubmit('')">
        <div class="login-con">
        <center><font size="6" color="#fffff0"></font></center>
        <BR/>
            <Card>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                        <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span>
                        </Input>
                        </FormItem>
                        <FormItem v-if="debug">
                            <Button @click="handleSubmit('')" type="primary" long>登录</Button>
                        </FormItem>
                        <FormItem v-else>
                            <div class="l-captcha" data-site-key="28b0f1ba9bba5e197b5db736c5875152" data-callback="login"></div> 
                        </FormItem>
                    </Form>
                    <p class="login-tip"></p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util.js';
import CryptoJS from 'crypto-js'

export default {
    data () {
        return {
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
            debug: document.domain=='127.0.0.1'||document.domain=='',
        };
    },
    mounted() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://captcha.luosimao.com/static/js/api.js';
        document.body.appendChild(script);
        let self = this;
        window.login = function(verify){
            self.handleSubmit(verify);
        };
    },
    methods: {
        handleSubmit (verify) {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let data = {
                        'u':this.form.username,
                        'p':CryptoJS.SHA256(this.form.password).toString(),
                        'v':verify||CryptoJS.SHA1(this.form.password).toString(),
                        'username':this.form.username,
                        'password':CryptoJS.SHA512(this.form.password).toString(),
                    };
                    util.ajax({
                        method: 'POST',
                        action: 'userlogin',
                        json:   data
                    }).then(res => {
                        this.projectselect(res.projectid);
                        Cookies.set('user', res.username);
                        Cookies.set('access', res.group);
                        localStorage.token = res.token;
                        this.$store.commit('setAvator','data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABbCAYAAAAcNvmZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnhJREFUeNrs3U9LFGEcwPGf7ebaYWGhCBLCPQaRbNFd9w2YHrwF5dGTBtG1vIpit45l9AJ8BbmetQi6qCdB2EMprH/AXFzrN/qgo+2Ms+Mz0+P2/cLDoM4M8uHh2XkOy4gQEV2qjjgXPZiqDeqhT0dJR9GM/6GKjpqOBR1z318W1hLBVuCCHl7reK6jwDw9wZ9Q9Io1bIUeN9AgB6MPKXotNraZzTNmNlN4HnRZwb+1jG2g5826TBbAr4VcOAN0yx1NUJ2opcjYZo1m6YgP/j4Stu+pg+JXUsc3UWY2Tx12GjMTNxSb5cPecjIYiG12hsxqez0Lm9l9+FitPwybRz3L6WrRH4RdhCe5wP6H2AQ22AS2u2Wt3m3068XnbNwQmS8eH329KnfJk/udks91OAXUO711hWf2rT2RgdUzv/KQnz7KOQfdHstIriHSvevDvs6aTWCDTWCDDTa1Mfbm6aZm+WfDSZyVHw2HsT/3RDtv6Y7Ifubkx09f6lLdPnQKemf/t0xWfjm8XV+5KVLNi+TrwefUM39t1T3o4Y+7cu92puklA7rp8XaZUWejDaRlvY8H7i720ZToPB4xZtLi+kHTvz2+m7VyHz4g+YAksMEmsMEGm8AGm8AGm8AGG2wCG2wCG2ywCWywCWywCWywwSawwSawwQabwAabwAabwE637FX4J5fWD+RdxHOrW4dgXybv21+ufgOMZQRsAhvstmoN7JSg/W9pAjvZ5lhG0msW7HSqnH85ENjJ9YKnkZSgm73yCmz7fVDotzxnpwM9wqYmnaVjhB1kwk8dOh4GLR3+sljF3oJ7G5bZsJdtXoRdxrG1LTgR/RFgAEIioEX14WSDAAAAAElFTkSuQmCC');
                        this.$router.push({
                            name: 'project_index'
                        });
                    }).catch(err => {
                        this.$Message.error(err);
                        window.LUOCAPTCHA.reset();
                    });
                };
            });
        },
        projectselect(projectid){
            this.projectid = projectid;
            util.ajax({
                method:'POST',
                action:'projectselect',
                json:{'projectid':projectid}
            }).then(res => {
                localStorage.projectid = res.projectid;
                localStorage.projectname = res.projectname;
                this.$Message.info('确定选择该系统');
            }).catch(err => {
                this.$Message.error(err);
            });
        },
    }
};
</script>

