<template>
    <div>
        <Modal
            v-model="modalinfo"
            :title="projectname"
            :styles="{top: '30px'}"
            okText= "保存"
            @on-ok="scantaskadd">
            <Form :model="taskinfo" :label-width="80">
                <Tabs>
                    <TabPane label="参数" >
                     <FormItem label="扫描目标">
                            <Input 
                                v-model="taskinfo.task_host"
                                :rows="5"
                                type="textarea" 
                                placeholder="一行一个目标网址，IP支持.1/24形式的C段简写"></Input>
                        </FormItem> 
                        <FormItem label="任务参数">
                            <Input type="text" 
                            v-model="taskinfo.task_args"
                            placeholder="-key1=value -key2=value"></Input>
                        </FormItem>  
                        <FormItem label="扫描类型">
                            <CheckboxGroup v-model="taskinfo.task_name">
                                <Checkbox v-for="task in tasktype" :label="task.task_name"><Tag checkable :checked=false :color="rands()">{{ task.task_desc }}</Tag></Checkbox>
                            </CheckboxGroup>
                        </FormItem> 
                    </TabPane>
                    <TabPane label="选项">
                        <FormItem label="任务等级">
                            <Select v-model="taskinfo.task_level">
                                <Option value="0">立刻</Option>
                                <Option value="1">紧急</Option>
                                <Option value="2">优先</Option>
                                <Option value="3">一般</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="任务备注">
                            <Input type="text" v-model="taskinfo.task_note"></Input>
                        </FormItem> 
                    </TabPane>
                    <!--<TabPane label="上传">
                        <div class="margin-top-10">
                            <Card>
                                <div class="height-200px">
                                    <Upload
                                        multiple
                                        type="drag"
                                        action="/upload.php"
                                        :on-success="uploadsuccess">
                                        <div style="padding: 60px 0;height: 200px;">
                                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                            <p>上传文件</p>
                                        </div>
                                    </Upload>
                                </div>
                            </Card>
                        </div>
                    </TabPane>-->
                </Tabs>
            </Form>
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'TaskAdd',
	data(){
		return {
            taskinfo: {
                task_host:'',
                task_note:'',
                task_level:'3',
                task_name:[],
                task_args:'',
            },
        };
	},
	props: {
        modalinfo:false
        
    },
    methods: {
        
    }
};
</script>
