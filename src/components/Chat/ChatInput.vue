<template>
    <div class="chat-input">
        <div class="left">
            <div
                id="editor"
                ref="editor"
                contenteditable="true"
                :class="editorClass"
                :style="editorStyle"
                @paste.prevent="handlePaste($event)"
                @keyup="handleKeyUp($event)"
                @keydown="handleKeyDown($event)"
            >
            <br>
            </div>
            <div>
                <i v-show="loading" class="el-icon-loading" />
            </div>
        </div>
    </div>
</template>
  
<script>
import $ from 'jquery';

export default {
    name: 'ChatInput',
    props: {
        access: {
            type: String,
            default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzMDczMzgxNTMiLCJyZWZyZXNoX3Rva2VuX2lkIjoiMDk3OWM2MzgwZWY4NDg2NGFkNDNhYWRlZmI4YTQ5NDgiLCJuYmYiOjE2ODAwMDQ1MTksImV4cCI6MTY4MDAwNDgxOSwiaXNzIjoiT25saW5lU29jaWFsSXNzdWVyIiwiYXVkIjoiT25saW5lU29jaWFsQXVkaWVuY2UifQ.oLjCRQy2izlfYfBuniescjDr4z0gxTIY4wk1Rq596ik'
        },
        editorClass: {
            type: String,
            default: ''
        },
        editorStyle: {
            type: Object,
            default: () => ({})
        },
        imgShowWidth: { // 聊天输入框中粘贴的图片显示的宽度
            type: Number,
            default: 50
        },
        imgShowHeight: { // 聊天输入框中粘贴的图片显示的高度
            type: Number,
            default: 50
        },
        uploadUrl: {
            type: String,
            default: "https://kanghui29.cn/api/tool/upload/image"
        },
        name: { // 上传 表单 name
            type: String,
            default: 'formFile'
        },
        enter: { // 是否支持回车， 目前还有个 bug 中文输入后，在结尾回车，需要回车两次
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            msgList: [],
            loading: false
        }
    },
    methods: {
        async handlePaste(event) {
            const pasteResult = this.handlePastePlainText(event.clipboardData);
            if (pasteResult) return;
            await this.handlePasteImageFile(event.clipboardData);
        },

        handleKeyUp(event) {
            const childNodes = event.target.childNodes;
            this.emitChange(childNodes);
            if (event.keyCode === 13) {
                this.$emit('enter');
            }
        },

        handleKeyDown(event) {
            if (event.keyCode === 13) { // 禁止换行默认行为
                event.preventDefault();
                if (this.enter) {
                    const oBr = document.createElement('br');
                    this.cursorInsert(oBr);
                }
            }
        },

        // 去格式粘贴 文本
        handlePastePlainText(clipboardData) {
            const text = clipboardData.getData('text/plain');
            if (text) {
                const textNode = document.createTextNode(text);
                this.cursorInsert(textNode);
                return true;
            }
            return false;
        },

        // 粘贴图片
        async handlePasteImageFile(clipboardData) {
            const img = this.getPasteImageFile(clipboardData.files);
            if (!img) return;
            const uploadRes = await this.uploadChatImg(img);
            // const uploadRes = "https://bubble29.oss-cn-shanghai.aliyuncs.com/onlinesocial/23-02-21/boy.jpg";
            if (uploadRes == undefined || uploadRes == "") {
                this.$message.error('图片上传失败,请重新上传');
                return;
            }
            const oImage = await this.getImageObject(uploadRes, this.imgShowWidth, this.imgShowHeight);
            this.cursorInsert(oImage);
            // 光标处插入 image 后，重新出发 emit 时间
            const oEditor = this.$refs.editor;
            this.emitChange(oEditor.childNodes);
        },

        emitChange(editorChildNodes) {
            const oldMsgList = JSON.parse(JSON.stringify(this.msgList));
            this.msgList = []; // 重置
            for (let i = 0; i < editorChildNodes.length; i++) {
                if (editorChildNodes[i].nodeType === 1 && editorChildNodes[i].nodeName === 'BR') { // 处理回车
                    const lastMsg = this.msgList[this.msgList.length - 1];
                    if (lastMsg?.type === 'text') {
                        lastMsg.content += '\n';
                    }
                } else if (editorChildNodes[i].nodeType === 3 && editorChildNodes[i].nodeValue) {
                    const lastMsg = this.msgList[this.msgList.length - 1];
                    if (lastMsg?.type === 'text') {
                        lastMsg.content += editorChildNodes[i].nodeValue;
                    } else {
                        this.msgList.push({
                            type: 'text',
                            content: editorChildNodes[i].nodeValue
                        });
                    }
                } else if (editorChildNodes[i].nodeType === 1 && editorChildNodes[i].nodeName === 'IMG') {
                    const dataset = editorChildNodes[i].dataset;
                    this.msgList.push({
                        type: 'image',
                        url: editorChildNodes[i].src,
                        width: +dataset.width,
                        height: +dataset.height
                    });
                }
            }
            if (!this.msgList.length && !oldMsgList.length) {
                return;
            }
            this.$emit('change', [...this.msgList]);
        },

        // 光标处插入节点
        cursorInsert(node) {
            // 获取光标范围
            const selObj = window.getSelection();
            const range = selObj.getRangeAt(0);
            // 光标处插入节点
            range.insertNode(node);
            // 取消insert node 后的选中状态，将光标恢复到 insert node 后面
            range.collapse(false);
        },

        getPasteImageFile(clipboardDataFiles) {
            if (!clipboardDataFiles.length) {
                console.log('没有要粘贴的文件');
                return null;
            }
            // 剪切版中选择的(用户第一个点的在尾)第一张图片
            const clipboardDataFileList = Array.from(clipboardDataFiles || []);
            let firstSelectedImage = null;
            clipboardDataFileList.forEach(file => {
                if (!file.type.match(/image\//i)) {
                    return;
                }
                firstSelectedImage = file;
            });
            /**
             * 这里的 firstSelectedFile 对象就是和 <input type="file" /> onchange 时 一样的 文件对象
             * */
            return firstSelectedImage;
        },

        /**
         * 上传聊天图片
         * @param file
         * @return {Promise<null|{width: number, height: number, length: number, md5: string, path: string}>}
         */
        async uploadChatImg(file) {
            const formData = new FormData();
            formData.append(this.name, file);
            this.loading = true;
            console.log(formData);
            $.ajax({
                url: this.uploadUrl,
                type: "post",
                headers: { 
                    'Authorization': "Bearer " + this.access,
                },
                data: formData,
                processData: false,
                contentType: false,
                success: function(resp) {
                    console.log(resp);
                    if (resp.IsSuccess) {
                        console.log("上传成功");
                        return resp.Result;
                    } else {
                        console.log(resp.Message);
                    }
                },
                error: function(resp) {
                    console.log(resp.Status);
                    console.log(resp);
                    alert("服务器出错了");
                }
            });
            this.loading = false;
        },
        // 获取一个 image object
        getImageObject(uploadRes, showWidth, showHeight) {
            const oImage = new Image(showWidth, showHeight);
            const datasetFields = ['width', 'height'];
            datasetFields.forEach(field => {
                oImage.setAttribute(`data-${field}`, uploadRes[field]);
            })
            oImage.src = uploadRes.path;
            return oImage;
        },
        // 清除 输入框
        clean() {
            this.$refs.editor.innerHTML = '';
        },
        // 输入框 焦点
        focus() {
            this.$refs.editor.focus();
        }
    }
}
</script>
  
<style scoped lang="scss">
.chat-input {
    display: flex;
    border: 1px solid #dcdfe6;
    .left {
        width: 100%;
        div:nth-of-type(1) {
            padding: 4px;
            width: 300px;
            min-height: 100px;
            outline: none;
        }
    }
}
</style>